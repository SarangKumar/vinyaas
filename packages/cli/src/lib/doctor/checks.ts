import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import {
  ComponentsConfigError,
  parseComponentsConfig,
  type ComponentsConfig,
} from "../../../../../config/components.ts";

import { detectTailwind, type PackageManifest } from "../detect-project.ts";
import { resolveAliasDirectory } from "../resolve-alias.ts";
import { CONSUMER_TAILWIND_IMPORT } from "../theme/tokens.ts";

export interface DoctorCheckResult {
  id: string;
  label: string;
  ok: boolean;
  detail?: string;
}

export interface DoctorReport {
  ok: boolean;
  checks: DoctorCheckResult[];
}

type DoctorCheck = {
  id: string;
  label: string;
  run: () => Promise<Omit<DoctorCheckResult, "id" | "label">>;
};

/**
 * Project setup validation. Checks are ordered and independent so future
 * diagnostics can be appended without changing command wiring.
 */
export async function runDoctorChecks(cwd: string): Promise<DoctorReport> {
  const context: {
    config: ComponentsConfig | null;
    configError: string | null;
    packageJson: PackageManifest | null;
  } = {
    config: null,
    configError: null,
    packageJson: null,
  };

  const checks: DoctorCheck[] = [
    {
      id: "components-json",
      label: "components.json found",
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
      id: "tailwind-v4",
      label: "Tailwind v4 detected",
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
      label: "CSS file configured",
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
      id: "aliases",
      label: "aliases configured",
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
  ];

  const results: DoctorCheckResult[] = [];

  for (const check of checks) {
    const result = await check.run();
    results.push({
      id: check.id,
      label: check.label,
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
  const lines = ["Checking Vinyaas setup...", ""];

  for (const check of report.checks) {
    lines.push(`${check.ok ? "✓" : "✗"} ${check.label}`);
  }

  lines.push("");

  if (report.ok) {
    lines.push("Your project is ready.");
  } else {
    const failed = report.checks.filter((check) => !check.ok);
    lines.push("Issues found:");

    for (const check of failed) {
      lines.push(`- ${check.label}${check.detail ? `: ${check.detail}` : ""}`);
    }

    lines.push("", "Run `vinyaas init` to fix setup issues.");
  }

  return lines.join("\n");
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
