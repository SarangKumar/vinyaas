import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { Command } from "commander";
import {
  ComponentsConfigError,
  parseComponentsConfig,
  type ComponentsConfig,
} from "../../../../config/components.ts";

import { CliError } from "../lib/cli-error.ts";
import { createCssUpdate } from "../lib/css/plan.ts";
import type { CssUpdate } from "../lib/css/types.ts";
import {
  classifyDependencies,
  formatDeclaredDependencies,
  readDeclaredDependencies,
  type DependencyInstallPlan,
} from "../lib/dependencies/classify.ts";
import { createDocsPlan, formatDocsPlan } from "../lib/docs/plan.ts";
import { createEnvPlan, formatEnvPlan } from "../lib/env/plan.ts";
import {
  assertDestinationsAvailable,
  createInstallPlan,
  writeInstallPlan,
  type InstallPlan,
} from "../lib/install-plan.ts";
import { findPackageManager } from "../lib/package-manager/detect.ts";
import { installDependencies } from "../lib/package-manager/install.ts";
import type { RunPackageManager } from "../lib/package-manager/types.ts";
import { resolveProjectRoot } from "../lib/project/cwd.ts";
import {
  formatRollbackError,
  restoreFiles,
  snapshotFiles,
  type FileSnapshot,
} from "../lib/transaction/files.ts";
import { RegistryError } from "../lib/registry/client.ts";
import { resolveRegistryItems } from "../lib/registry/resolve.ts";

const missingConfigMessage = [
  "components.json was not found.",
  "Run `vinyaas init` first.",
].join("\n");

export function registerAddCommand(program: Command): void {
  program
    .command("add")
    .description("Add a component from the Vinyaas registry.")
    .argument("<name>", "Registry item name")
    .option("--cwd <path>", "Consumer project directory.")
    .option("--force", "Overwrite existing component files.")
    .action(
      async (name: string, options: { cwd?: string; force?: boolean }) => {
        try {
          await executeAdd({
            name,
            cwd: options.cwd,
            force: options.force === true,
            env: process.env,
          });
        } catch (error) {
          if (
            error instanceof CliError ||
            error instanceof RegistryError ||
            error instanceof ComponentsConfigError
          ) {
            console.error(error.message);
            process.exit(1);
          }

          throw error;
        }
      },
    );
}

interface AddMutations {
  snapshotFiles?: typeof snapshotFiles;
  restoreFiles?: typeof restoreFiles;
  writeComponents?: (cwd: string, plan: InstallPlan) => Promise<void>;
  writeCss?: (cwd: string, update: CssUpdate) => Promise<void>;
}

export async function executeAdd({
  name,
  cwd,
  force = false,
  from = process.cwd(),
  env = process.env,
  fetch: fetchImpl,
  runPackageManager,
  mutations,
}: {
  name: string;
  cwd?: string;
  force?: boolean;
  from?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  runPackageManager?: RunPackageManager;
  mutations?: AddMutations;
}): Promise<InstallPlan> {
  return runAdd({
    cwd: await resolveProjectRoot(cwd, from),
    name,
    force,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
    ...(runPackageManager ? { runPackageManager } : {}),
    ...(mutations ? { mutations } : {}),
  });
}

export async function runAdd({
  cwd,
  name,
  force = false,
  env = process.env,
  fetch: fetchImpl,
  runPackageManager,
  mutations,
}: {
  cwd: string;
  name: string;
  force?: boolean;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  runPackageManager?: RunPackageManager;
  mutations?: AddMutations;
}): Promise<InstallPlan> {
  const config = await readComponentsConfig(cwd);
  const items = await resolveRegistryItems({
    style: config.style,
    name,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
  const plan = await createInstallPlan({ cwd, config, name, items });

  await assertDestinationsAvailable(cwd, plan, force);
  const cssUpdate = await createCssUpdate({
    cwd,
    cssPath: config.tailwind.css,
    items,
  });
  const envPlan = await createEnvPlan({ cwd, items });
  const docsPlan = createDocsPlan(items);
  const dependencyInstall = classifyDependencies(
    plan,
    await readDeclaredDependencies(cwd),
  );

  const needsInstall =
    dependencyInstall.installDependencies.length > 0 ||
    dependencyInstall.installDevDependencies.length > 0;
  const detected = needsInstall ? await findPackageManager(cwd) : undefined;
  const snapshot = await (mutations?.snapshotFiles ?? snapshotFiles)(cwd, [
    ...(detected ? ["package.json", detected.lockfile] : []),
    ...plan.entries.map((entry) => entry.destinationPath),
    ...(cssUpdate.changed ? [cssUpdate.relativePath] : []),
  ]);

  try {
    if (detected) {
      await installDependencies({
        cwd,
        manager: detected.manager,
        dependencies: dependencyInstall.installDependencies,
        devDependencies: dependencyInstall.installDevDependencies,
        env,
        ...(runPackageManager ? { run: runPackageManager } : {}),
      });
    }

    await (mutations?.writeComponents ?? writeInstallPlan)(cwd, plan);
    await (mutations?.writeCss ?? writeCssUpdate)(cwd, cssUpdate);
  } catch (error) {
    await rollbackMutation(cwd, snapshot, error, mutations?.restoreFiles);
  }

  console.log(formatAdded(plan, dependencyInstall));

  const envReport = formatEnvPlan(envPlan);

  if (envReport) {
    console.log("");
    console.log(envReport);
  }

  const docsReport = formatDocsPlan(docsPlan);

  if (docsReport) {
    console.log("");
    console.log(docsReport);
  }

  return plan;
}

async function rollbackMutation(
  cwd: string,
  snapshot: readonly FileSnapshot[],
  error: unknown,
  restore: typeof restoreFiles = restoreFiles,
): Promise<never> {
  try {
    await restore(cwd, snapshot);
  } catch (rollbackError) {
    throw formatRollbackError(error, rollbackError);
  }

  throw formatRollbackError(error);
}

async function readComponentsConfig(cwd: string): Promise<ComponentsConfig> {
  const configPath = path.join(cwd, "components.json");
  let source: string;

  try {
    source = await readFile(configPath, "utf8");
  } catch (error) {
    if (isNotFound(error)) {
      throw new CliError(missingConfigMessage);
    }

    throw error;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(source) as unknown;
  } catch {
    throw new CliError("Could not read components.json.");
  }

  return parseComponentsConfig(parsed);
}

async function writeCssUpdate(cwd: string, update: CssUpdate): Promise<void> {
  if (!update.changed) {
    return;
  }

  await writeFile(path.resolve(cwd, update.relativePath), update.next, "utf8");
}

function formatAdded(
  plan: InstallPlan,
  dependencyInstall: DependencyInstallPlan,
): string {
  const lines = [
    `Added ${plan.name}.`,
    "",
    "Files:",
    ...plan.entries.map((entry) => `  ${entry.destinationPath}`),
  ];

  if (dependencyInstall.installDependencies.length > 0) {
    lines.push(
      "",
      "Installed dependencies:",
      ...dependencyInstall.installDependencies.map(
        (dependency) => `  ${dependency}`,
      ),
    );
  }

  if (dependencyInstall.installDevDependencies.length > 0) {
    lines.push(
      "",
      "Installed devDependencies:",
      ...dependencyInstall.installDevDependencies.map(
        (dependency) => `  ${dependency}`,
      ),
    );
  }

  const declared = formatDeclaredDependencies(dependencyInstall.present);

  if (declared) {
    lines.push("", declared);
  }

  return lines.join("\n");
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
