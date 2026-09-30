import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import {
  ComponentsConfigError,
  parseComponentsConfig,
  type ComponentsConfig,
} from "../../../../../config/components.ts";
import {
  getRegistryBasePath,
  RegistryBasePathError,
} from "../../../../../config/registry.ts";

import { detectTailwind, type PackageManifest } from "../detect-project.ts";
import { resolveAliasDirectory } from "../resolve-alias.ts";
import { CONSUMER_TAILWIND_IMPORT } from "../theme/tokens.ts";

export interface DoctorCheckResult {
  id: string;
  label: string;
  ok: boolean;
  detail?: string;
  /** Presentation group for human output. */
  group: DoctorCheckGroup;
}

export type DoctorCheckGroup =
  "project" | "styling" | "dependencies" | "registry";

export interface DoctorReport {
  ok: boolean;
  checks: DoctorCheckResult[];
}

type DoctorCheck = {
  id: string;
  label: string;
  group: DoctorCheckGroup;
  run: () => Promise<Omit<DoctorCheckResult, "id" | "label" | "group">>;
};

const dependencyPackages = [
  "clsx",
  "tailwind-merge",
  "tailwindcss",
  "@tailwindcss/postcss",
] as const;

const themeTokenSamples = [
  "--background",
  "--foreground",
  "--primary",
] as const;

export interface RunDoctorChecksOptions {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}

/**
 * Project setup validation. Checks are ordered and independent so future
 * diagnostics can be appended without changing command wiring.
 */
export async function runDoctorChecks(
  cwd: string,
  options: RunDoctorChecksOptions = {},
): Promise<DoctorReport> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetch ?? globalThis.fetch.bind(globalThis);

  const context: {
    config: ComponentsConfig | null;
    configError: string | null;
    packageJson: PackageManifest | null;
    registryBasePath: string | null;
  } = {
    config: null,
    configError: null,
    packageJson: null,
    registryBasePath: null,
  };

  const checks: DoctorCheck[] = [
    {
      id: "components-json",
      label: "components.json",
      group: "project",
      run: async () => {
        const configPath = path.join(cwd, "components.json");

        try {
          const raw = await readFile(configPath, "utf8");
          let parsed: unknown;

          try {
            parsed = JSON.parse(raw);
          } catch {
            context.configError = "components.json is not valid JSON.";
            return { ok: false, detail: context.configError };
          }

          try {
            context.config = parseComponentsConfig(parsed);
            return { ok: true };
          } catch (error) {
            context.configError =
              error instanceof ComponentsConfigError
                ? error.message
                : "components.json is missing required fields.";
            return { ok: false, detail: context.configError };
          }
        } catch (error) {
          if (isNotFound(error)) {
            context.configError = "components.json was not found.";
            return { ok: false, detail: context.configError };
          }

          throw error;
        }
      },
    },
    {
      id: "aliases",
      label: "aliases configured",
      group: "project",
      run: async () => {
        if (!context.config) {
          return {
            ok: false,
            detail: context.configError ?? "components.json is required first.",
          };
        }

        const required = [
          context.config.aliases.components,
          context.config.aliases.ui,
          context.config.aliases.utils,
        ] as const;

        for (const specifier of required) {
          try {
            await resolveAliasDirectory(cwd, specifier);
          } catch (error) {
            return {
              ok: false,
              detail:
                error instanceof Error
                  ? error.message
                  : `Could not resolve alias ${specifier}.`,
            };
          }
        }

        return { ok: true };
      },
    },
    {
      id: "utils-file",
      label: "utils file found",
      group: "project",
      run: async () => {
        if (!context.config) {
          return {
            ok: false,
            detail: context.configError ?? "components.json is required first.",
          };
        }

        let directory: string;

        try {
          directory = await resolveAliasDirectory(
            cwd,
            context.config.aliases.utils,
          );
        } catch (error) {
          return {
            ok: false,
            detail:
              error instanceof Error
                ? error.message
                : "Could not resolve utils alias.",
          };
        }

        const candidates = context.config.tsx
          ? [`${directory}.ts`, `${directory}.tsx`]
          : [`${directory}.js`, `${directory}.jsx`, `${directory}.ts`];

        for (const candidate of candidates) {
          if (await pathExists(candidate)) {
            return {
              ok: true,
              detail: path.relative(cwd, candidate).split(path.sep).join("/"),
            };
          }
        }

        return {
          ok: false,
          detail: `Utils file not found for ${context.config.aliases.utils}.`,
        };
      },
    },
    {
      id: "tailwind-v4",
      label: "Tailwind v4",
      group: "styling",
      run: async () => {
        try {
          context.packageJson = await readPackageManifest(cwd);
        } catch (error) {
          return {
            ok: false,
            detail:
              error instanceof Error
                ? error.message
                : "Could not read package.json.",
          };
        }

        const status = detectTailwind(context.packageJson);

        if (status.kind === "ready") {
          return { ok: true, detail: status.version };
        }

        if (status.kind === "unsupported") {
          return {
            ok: false,
            detail: `Tailwind ${status.version} is installed; Vinyaas requires v4.`,
          };
        }

        return {
          ok: false,
          detail: "tailwindcss v4 was not found in package.json.",
        };
      },
    },
    {
      id: "css-file",
      label: "global CSS",
      group: "styling",
      run: async () => {
        if (!context.config) {
          return {
            ok: false,
            detail: context.configError ?? "components.json is required first.",
          };
        }

        const cssPath = path.join(cwd, context.config.tailwind.css);

        try {
          const source = await readFile(cssPath, "utf8");

          if (
            !source.includes(CONSUMER_TAILWIND_IMPORT) &&
            !/@import\s+["']tailwindcss["']/.test(source)
          ) {
            return {
              ok: false,
              detail: `${context.config.tailwind.css} is missing @import "tailwindcss".`,
            };
          }

          return { ok: true, detail: context.config.tailwind.css };
        } catch (error) {
          if (isNotFound(error)) {
            return {
              ok: false,
              detail: `CSS file not found: ${context.config.tailwind.css}`,
            };
          }

          throw error;
        }
      },
    },
    {
      id: "theme-tokens",
      label: "theme tokens",
      group: "styling",
      run: async () => {
        if (!context.config) {
          return {
            ok: false,
            detail: context.configError ?? "components.json is required first.",
          };
        }

        const cssPath = path.join(cwd, context.config.tailwind.css);

        try {
          const source = await readFile(cssPath, "utf8");
          const missing = themeTokenSamples.filter(
            (token) => !source.includes(token),
          );

          if (!source.includes("@theme inline") || missing.length > 0) {
            return {
              ok: false,
              detail: `${context.config.tailwind.css} is missing Vinyaas theme tokens. Run \`vinyaas init\`.`,
            };
          }

          return { ok: true };
        } catch (error) {
          if (isNotFound(error)) {
            return {
              ok: false,
              detail: `CSS file not found: ${context.config.tailwind.css}`,
            };
          }

          throw error;
        }
      },
    },
    ...dependencyPackages.map((packageName): DoctorCheck => ({
      id: `dependency-${packageName}`,
      label: packageName,
      group: "dependencies",
      run: async () => {
        if (!context.packageJson) {
          try {
            context.packageJson = await readPackageManifest(cwd);
          } catch (error) {
            return {
              ok: false,
              detail:
                error instanceof Error
                  ? error.message
                  : "Could not read package.json.",
            };
          }
        }

        if (hasPackage(context.packageJson, packageName)) {
          return { ok: true };
        }

        return {
          ok: false,
          detail: `${packageName} is not declared in package.json. Run \`vinyaas init\`.`,
        };
      },
    })),
    {
      id: "registry-url",
      label: "registry URL",
      group: "registry",
      run: async () => {
        try {
          context.registryBasePath = resolveDoctorRegistryBasePath(
            context.config,
            env,
          );
          return { ok: true, detail: context.registryBasePath };
        } catch (error) {
          return {
            ok: false,
            detail:
              error instanceof Error
                ? error.message
                : "Registry URL is not configured.",
          };
        }
      },
    },
    {
      id: "registry-reachable",
      label: "registry reachable",
      group: "registry",
      run: async () => {
        if (!context.registryBasePath) {
          try {
            context.registryBasePath = resolveDoctorRegistryBasePath(
              context.config,
              env,
            );
          } catch (error) {
            return {
              ok: false,
              detail:
                error instanceof Error
                  ? error.message
                  : "Registry URL is not configured.",
            };
          }
        }

        const catalogUrl = `${context.registryBasePath.replace(/\/$/, "")}/new-york/index.json`;

        try {
          const response = await fetchImpl(catalogUrl, {
            method: "GET",
            signal: AbortSignal.timeout(8_000),
          });

          if (!response.ok) {
            return {
              ok: false,
              detail: `Could not reach ${context.registryBasePath} (HTTP ${response.status}).`,
            };
          }

          return { ok: true, detail: context.registryBasePath };
        } catch (error) {
          return {
            ok: false,
            detail: `Could not reach ${context.registryBasePath}${
              error instanceof Error ? `: ${error.message}` : "."
            }`,
          };
        }
      },
    },
  ];

  const results: DoctorCheckResult[] = [];

  for (const check of checks) {
    const result = await check.run();
    results.push({
      id: check.id,
      label: check.label,
      group: check.group,
      ok: result.ok,
      ...(result.detail ? { detail: result.detail } : {}),
    });
  }

  return {
    ok: results.every((check) => check.ok),
    checks: results,
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  const lines = ["✓ Vinyaas doctor", ""];
  const groups: { id: DoctorCheckGroup; title: string }[] = [
    { id: "project", title: "Project" },
    { id: "styling", title: "Styling" },
    { id: "dependencies", title: "Dependencies" },
    { id: "registry", title: "Registry" },
  ];

  for (const group of groups) {
    const checks = report.checks.filter((check) => check.group === group.id);

    if (checks.length === 0) {
      continue;
    }

    lines.push(group.title);

    for (const check of checks) {
      if (check.id === "registry-url") {
        if (!check.ok) {
          lines.push(`  ✗ ${check.label}`);
        }
        continue;
      }

      if (check.id === "registry-reachable") {
        if (check.ok && check.detail) {
          lines.push(`  ✓ ${check.detail}`);
        } else {
          lines.push(`  ✗ ${check.label}`);
        }
        continue;
      }

      lines.push(`  ${check.ok ? "✓" : "✗"} ${check.label}`);
    }

    lines.push("");
  }

  if (report.ok) {
    lines.push("No issues found.");
    return lines.join("\n");
  }

  const failed = report.checks.filter((check) => !check.ok);

  lines.push("Issues found:");

  for (const check of failed) {
    lines.push(`  ✗ ${check.label}${check.detail ? `: ${check.detail}` : ""}`);
  }

  const fixHint = failed.some((check) => check.id === "components-json")
    ? "Run:\n  vinyaas init"
    : "Run:\n  vinyaas init";

  lines.push("", fixHint);

  return lines.join("\n");
}

function resolveDoctorRegistryBasePath(
  config: ComponentsConfig | null,
  env: Record<string, string | undefined>,
): string {
  const fromSchema = registryBasePathFromSchema(config?.$schema);

  if (fromSchema) {
    return fromSchema;
  }

  try {
    return getRegistryBasePath(env);
  } catch (error) {
    if (error instanceof RegistryBasePathError) {
      throw new Error(
        "Registry URL is not configured. Set REGISTRY_BASE_PATH or add $schema to components.json.",
      );
    }

    throw error;
  }
}

function registryBasePathFromSchema(schema: string | undefined): string | null {
  if (!schema) {
    return null;
  }

  try {
    const url = new URL(schema);
    const marker = "/r/";
    const index = url.pathname.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return `${url.origin}${url.pathname.slice(0, index + 2)}`;
  } catch {
    return null;
  }
}

function hasPackage(manifest: PackageManifest, name: string): boolean {
  return Boolean(
    manifest.dependencies?.[name] ||
    manifest.devDependencies?.[name] ||
    manifest.peerDependencies?.[name],
  );
}

async function readPackageManifest(cwd: string): Promise<PackageManifest> {
  const packageJsonPath = path.join(cwd, "package.json");
  const source = await readFile(packageJsonPath, "utf8");
  const parsed = JSON.parse(source) as unknown;

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("package.json must be an object.");
  }

  return parsed as PackageManifest;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch (error) {
    if (isNotFound(error)) {
      return false;
    }

    throw error;
  }
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
