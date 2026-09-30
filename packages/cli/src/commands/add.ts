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
  classifyExistingItems,
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
import type { RegistryItem } from "../lib/registry/types.ts";

const missingConfigMessage = [
  "components.json was not found.",
  "Run `vinyaas init` first.",
].join("\n");

export function registerAddCommand(program: Command): void {
  program
    .command("add")
    .description("Add one or more components from the Vinyaas registry.")
    .argument("<name...>", "Registry item names")
    .option("--cwd <path>", "Consumer project directory.")
    .option("--force", "Overwrite existing component files.")
    .addHelpText("after", "\nExample:\n  $ vinyaas add button card badge")
    .action(
      async (name: string[], options: { cwd?: string; force?: boolean }) => {
        try {
          await executeAdd({
            name: name[0] ?? "",
            names: name,
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
  names,
  cwd,
  force = false,
  from = process.cwd(),
  env = process.env,
  fetch: fetchImpl,
  runPackageManager,
  mutations,
}: {
  name: string;
  names?: readonly string[];
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
    ...(names ? { names } : {}),
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
  names,
  force = false,
  env = process.env,
  fetch: fetchImpl,
  runPackageManager,
  mutations,
}: {
  cwd: string;
  name: string;
  names?: readonly string[];
  force?: boolean;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  runPackageManager?: RunPackageManager;
  mutations?: AddMutations;
}): Promise<InstallPlan> {
  const requested = uniqueNames(names && names.length > 0 ? names : [name]);
  const config = await readComponentsConfig(cwd);
  const resolvedItems = await resolveRegistryItems({
    style: config.style,
    name: requested[0] ?? name,
    names: requested,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
  const scoutPlan = await createInstallPlan({
    cwd,
    config,
    name: requested[0] ?? name,
    items: resolvedItems,
  });
  const existing = await classifyExistingItems({
    cwd,
    plan: scoutPlan,
    force,
    requested,
  });
  const installItemNames = selectInstallItemNames({
    items: resolvedItems,
    installItemNames: existing.installItemNames,
    requested,
  });
  const itemsToInstall = filterItemsForInstall(resolvedItems, installItemNames);
  const plan = await createInstallPlan({
    cwd,
    config,
    name: requested[0] ?? name,
    items: itemsToInstall,
  });

  plan.skipped = requested.filter((itemName) =>
    existing.skipped.includes(itemName),
  );

  const overwrite = new Set(existing.overwriteItemNames);

  for (const entry of plan.entries) {
    entry.overwrite = overwrite.has(entry.itemName);
  }

  const cssUpdate = await createCssUpdate({
    cwd,
    cssPath: config.tailwind.css,
    items: itemsToInstall,
  });
  const envPlan = await createEnvPlan({ cwd, items: itemsToInstall });
  const docsPlan = createDocsPlan(itemsToInstall);
  const dependencyInstall = classifyDependencies(
    plan,
    await readDeclaredDependencies(cwd),
  );

  if (plan.entries.length === 0) {
    console.log(formatAdded(plan, dependencyInstall, requested));
    return plan;
  }

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

  console.log(formatAdded(plan, dependencyInstall, requested));

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

/**
 * Keep dependency-first order while dropping skipped registry items.
 * A skipped shared dependency stays omitted when nothing remaining needs it.
 * Registry deps of skipped requested components are not installed unless
 * another component that is actually being installed still needs them.
 */
function selectInstallItemNames({
  items,
  installItemNames,
  requested,
}: {
  items: readonly RegistryItem[];
  installItemNames: readonly string[];
  requested: readonly string[];
}): string[] {
  const installable = new Set(installItemNames);
  const byName = new Map(items.map((item) => [item.name, item]));
  const needed = new Set<string>();
  const queue = requested.filter((name) => installable.has(name));

  for (const name of queue) {
    needed.add(name);
  }

  while (queue.length > 0) {
    const name = queue.shift();

    if (!name) {
      continue;
    }

    const item = byName.get(name);

    for (const dependency of item?.registryDependencies ?? []) {
      if (!installable.has(dependency) || needed.has(dependency)) {
        continue;
      }

      needed.add(dependency);
      queue.push(dependency);
    }
  }

  return items.map((item) => item.name).filter((name) => needed.has(name));
}

function filterItemsForInstall(
  items: readonly RegistryItem[],
  installItemNames: readonly string[],
): RegistryItem[] {
  const install = new Set(installItemNames);
  return items.filter((item) => install.has(item.name));
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
  requested: readonly string[],
): string {
  const installedRequested = requested.filter(
    (component) => !plan.skipped.includes(component),
  );
  const lines: string[] = [];

  if (plan.skipped.length > 0) {
    lines.push("Skipped:", ...plan.skipped.map((name) => `- ${name}`));
  }

  if (installedRequested.length > 0) {
    if (lines.length > 0) {
      lines.push("");
    }

    if (installedRequested.length === 1) {
      lines.push(`Added ${installedRequested[0]}.`);
    } else {
      lines.push(
        "Installed:",
        ...installedRequested.map((name) => `- ${name}`),
      );
    }
  } else if (plan.entries.length === 0 && plan.skipped.length > 0) {
    if (lines.length > 0) {
      lines.push("");
    }

    lines.push("Nothing new to install.");
  }

  if (plan.entries.length > 0) {
    lines.push(
      "",
      "Files:",
      ...plan.entries.map((entry) => `  ${entry.destinationPath}`),
    );
  }

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

function uniqueNames(names: readonly string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const name of names) {
    if (seen.has(name)) {
      continue;
    }

    seen.add(name);
    unique.push(name);
  }

  return unique;
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
