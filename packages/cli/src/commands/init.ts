import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { Command } from "commander";
import {
  componentBaseColors,
  componentStyles,
  componentsSchemaUrl,
  getRegistryBasePath,
  parseComponentsConfig,
  ComponentsConfigError,
  type ComponentsConfig,
} from "../../../../config/components.ts";

import { CliError } from "../lib/cli-error.ts";
import {
  detectProject,
  hasDependency,
  type DetectedProject,
} from "../lib/detect-project.ts";
import { formatInitSummary, type InitSummary } from "../lib/init/format.ts";
import { findPackageManager } from "../lib/package-manager/detect.ts";
import { installDependencies } from "../lib/package-manager/install.ts";
import type { RunPackageManager } from "../lib/package-manager/types.ts";
import { ensureProjectAlias } from "../lib/project/aliases.ts";
import { resolveProjectRoot } from "../lib/project/cwd.ts";
import {
  ensurePostcssConfig,
  planInitDependencies,
} from "../lib/project/tailwind-setup.ts";
import { ensureProjectUtils } from "../lib/project/utils-file.ts";
import { ensureConsumerCss } from "../lib/theme/ensure-css.ts";

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description(
      "Prepare a React project for Vinyaas (Tailwind v4, theme CSS, aliases, components.json).",
    )
    .option("--cwd <path>", "Consumer project directory.")
    .option("-y, --yes", "Skip prompts and use safe defaults.")
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  $ vinyaas init",
        "  $ vinyaas init --cwd ./my-app",
        "",
        "Safe to run more than once. Existing components.json is left unchanged.",
      ].join("\n"),
    )
    .action(async (options: { cwd?: string; yes?: boolean }) => {
      try {
        await executeInit({
          cwd: options.cwd,
          yes: Boolean(options.yes),
          env: process.env,
        });
      } catch (error) {
        if (error instanceof CliError) {
          console.error(error.message);
          process.exit(1);
        }

        if (error instanceof ComponentsConfigError) {
          console.error(error.message);
          process.exit(1);
        }

        throw error;
      }
    });
}

export async function executeInit({
  cwd,
  from = process.cwd(),
  yes = false,
  env,
  run,
}: {
  cwd?: string;
  from?: string;
  yes?: boolean;
  env: Record<string, string | undefined>;
  run?: RunPackageManager;
}): Promise<void> {
  await runInit({
    cwd: await resolveProjectRoot(cwd, from),
    yes,
    env,
    run,
  });
}

export async function runInit({
  cwd,
  yes = false,
  env,
  run = undefined,
}: {
  cwd: string;
  yes?: boolean;
  env: Record<string, string | undefined>;
  run?: RunPackageManager;
}): Promise<void> {
  void yes;
  const project = await detectProject(cwd);

  if (project.tailwind.kind === "unsupported") {
    throw new CliError(
      [
        "Vinyaas requires Tailwind CSS v4.",
        `This project declares Tailwind ${project.tailwind.version}.`,
        "Upgrade to Tailwind CSS v4, then run `vinyaas init` again.",
      ].join("\n"),
    );
  }

  const aliasResult = project.hasAlias
    ? "exists"
    : await ensureProjectAlias({
        cwd,
        tsx: project.tsx,
        aliasTarget: project.aliasTarget,
      });

  const cssRelative = project.css ?? project.preferredCss;
  const cssAbsolute = join(cwd, cssRelative);
  let previousCss: string | null = null;

  try {
    previousCss = await readFile(cssAbsolute, "utf8");
  } catch (error) {
    if (!isNotFound(error)) {
      throw error;
    }
  }

  const cssUpdate = ensureConsumerCss(previousCss);
  if (cssUpdate.changed) {
    await mkdir(dirname(cssAbsolute), { recursive: true });
    await writeFile(cssAbsolute, cssUpdate.next);
  }

  await ensurePostcssConfig(cwd);

  const dependencyPlan = planInitDependencies(project.packageJson);
  if (
    dependencyPlan.dependencies.length > 0 ||
    dependencyPlan.devDependencies.length > 0
  ) {
    const { manager } = await findPackageManager(cwd);
    await installDependencies({
      cwd,
      manager,
      dependencies: dependencyPlan.dependencies,
      devDependencies: dependencyPlan.devDependencies,
      env,
      run,
    });
  }

  const configPath = join(cwd, "components.json");
  await writeComponentsConfig({
    cwd,
    configPath,
    project,
    cssRelative,
    env,
  });

  const utils = await ensureProjectUtils({
    cwd,
    tsx: project.tsx,
    utilsAlias: project.aliases.utils,
  });

  const declaredDependencies = collectDeclaredDependencies(
    project.packageJson,
    dependencyPlan.dependencies,
  );

  const summary: InitSummary = {
    framework: project.framework,
    typescript: project.tsx,
    tailwind:
      project.tailwind.kind === "ready"
        ? normalizeTailwindLabel(project.tailwind.version)
        : "v4",
    configured: {
      componentsJson: true,
      cssVariables: true,
      aliases:
        aliasResult === "created" ||
        aliasResult === "updated" ||
        project.hasAlias,
      utilsPath: utils.relativePath,
    },
    dependencies: declaredDependencies,
  };

  console.log(formatInitSummary(summary));
}

function normalizeTailwindLabel(version: string): string {
  const match = version.match(/(\d+)/);
  return match ? `v${match[1]}` : version;
}

function collectDeclaredDependencies(
  packageJson: DetectedProject["packageJson"],
  installed: readonly string[],
): string[] {
  const preferred = ["clsx", "tailwind-merge"] as const;
  const installedNames = new Set(installed);

  return preferred.filter(
    (name) => hasDependency(packageJson, name) || installedNames.has(name),
  );
}

async function writeComponentsConfig({
  cwd,
  configPath,
  project,
  cssRelative,
  env,
}: {
  cwd: string;
  configPath: string;
  project: DetectedProject;
  cssRelative: string;
  env: Record<string, string | undefined>;
}): Promise<"created" | "updated" | "exists"> {
  void cwd;
  let existingRaw: string | null = null;

  try {
    existingRaw = await readFile(configPath, "utf8");
  } catch (error) {
    if (!isNotFound(error)) {
      throw error;
    }
  }

  const nextConfig = createConfig(project, cssRelative, env);
  const serialized = `${JSON.stringify(nextConfig, null, 2)}\n`;

  if (existingRaw === null) {
    await writeFile(configPath, serialized, { encoding: "utf8", flag: "wx" });
    return "created";
  }

  let existing: ComponentsConfig;

  try {
    existing = parseComponentsConfig(JSON.parse(existingRaw));
  } catch (error) {
    const detail =
      error instanceof ComponentsConfigError
        ? error.message
        : "components.json is not valid JSON.";

    throw new CliError(
      [
        "components.json already exists and is incompatible with Vinyaas.",
        detail,
        "Fix or remove it, then run `vinyaas init` again.",
        "Vinyaas will not overwrite it.",
      ].join("\n"),
    );
  }

  const merged = mergeConfig(existing, nextConfig);
  const mergedSerialized = `${JSON.stringify(merged, null, 2)}\n`;

  if (mergedSerialized === existingRaw) {
    return "exists";
  }

  await writeFile(configPath, mergedSerialized);
  return "updated";
}

function createConfig(
  project: DetectedProject,
  cssRelative: string,
  env: Record<string, string | undefined>,
): ComponentsConfig {
  return parseComponentsConfig({
    $schema: componentsSchemaUrl(getRegistryBasePath(env)),
    style: componentStyles[0],
    tsx: project.tsx,
    tailwind: {
      css: cssRelative,
      baseColor: componentBaseColors[0],
      cssVariables: true,
    },
    aliases: project.aliases,
  });
}

/**
 * Prefer existing user values. Fill only missing required defaults from detection.
 */
function mergeConfig(
  existing: ComponentsConfig,
  detected: ComponentsConfig,
): ComponentsConfig {
  return parseComponentsConfig({
    ...(existing.$schema
      ? { $schema: existing.$schema }
      : detected.$schema
        ? { $schema: detected.$schema }
        : {}),
    style: existing.style,
    tsx: existing.tsx,
    tailwind: {
      css: existing.tailwind.css || detected.tailwind.css,
      baseColor: existing.tailwind.baseColor,
      cssVariables: existing.tailwind.cssVariables,
    },
    aliases: {
      components: existing.aliases.components,
      ui: existing.aliases.ui,
      utils: existing.aliases.utils,
      ...(existing.aliases.lib ? { lib: existing.aliases.lib } : {}),
      ...(existing.aliases.hooks ? { hooks: existing.aliases.hooks } : {}),
    },
  });
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
