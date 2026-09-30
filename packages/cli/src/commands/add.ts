import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { Command } from "commander";
import {
  ComponentsConfigError,
  parseComponentsConfig,
  type ComponentsConfig,
} from "../../../../config/components.ts";

import {
  formatAddSummary,
  formatCategoryInstallPrompt,
  formatDryRunSummary,
} from "../lib/add/format.ts";
import { CliError } from "../lib/cli-error.ts";
import { createCssUpdate } from "../lib/css/plan.ts";
import type { CssUpdate } from "../lib/css/types.ts";
import {
  classifyDependencies,
  readDeclaredDependencies,
  type DependencyInstallPlan,
} from "../lib/dependencies/classify.ts";
import { createDocsPlan, formatDocsPlan } from "../lib/docs/plan.ts";
import type { DocsPlan } from "../lib/docs/types.ts";
import { createEnvPlan, formatEnvPlan } from "../lib/env/plan.ts";
import type { EnvInstallPlan } from "../lib/env/types.ts";
import {
  classifyExistingItems,
  createInstallPlan,
  writeInstallPlan,
  type InstallPlan,
} from "../lib/install-plan.ts";
import { findPackageManager } from "../lib/package-manager/detect.ts";
import { installDependencies } from "../lib/package-manager/install.ts";
import type { RunPackageManager } from "../lib/package-manager/types.ts";
import { confirmPrompt, type ConfirmFn } from "../lib/prompt.ts";
import { resolveProjectRoot } from "../lib/project/cwd.ts";
import {
  formatRollbackError,
  restoreFiles,
  snapshotFiles,
  type FileSnapshot,
} from "../lib/transaction/files.ts";
import { RegistryError } from "../lib/registry/client.ts";
import {
  getRegistryCatalog,
  resolveCategoryComponentNames,
} from "../lib/registry/discover.ts";
import { resolveRegistryGraph } from "../lib/registry/resolve.ts";
import { formatUnknownComponentMessage } from "../lib/registry/suggest.ts";
import type { RegistryItem } from "../lib/registry/types.ts";

const missingConfigMessage = [
  "components.json was not found.",
  "Run `vinyaas init` first.",
].join("\n");

export function registerAddCommand(program: Command): void {
  program
    .command("add")
    .description("Add one or more components from the Vinyaas registry.")
    .argument("[name...]", "Component names to install")
    .option("--cwd <path>", "Consumer project directory.")
    .option(
      "--force",
      "Overwrite existing component files instead of skipping them.",
    )
    .option(
      "--dry-run",
      "Resolve the install plan and print it without writing files or installing packages.",
    )
    .option(
      "--category <category>",
      "Install every component in a registry category.",
    )
    .option("-y, --yes", "Skip confirmation prompts.")
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  $ vinyaas add button",
        "  $ vinyaas add button card dialog",
        "  $ vinyaas add --category forms",
        "  $ vinyaas add --category forms --yes",
        "  $ vinyaas add button --force",
        "  $ vinyaas add button card --dry-run",
        "",
        "Pass component names for a precise install. Use --category to install a group.",
        "Already-installed components are skipped unless --force is set.",
      ].join("\n"),
    )
    .action(
      async (
        name: string[] | undefined,
        options: {
          cwd?: string;
          force?: boolean;
          dryRun?: boolean;
          category?: string;
          yes?: boolean;
        },
      ) => {
        try {
          const names = name ?? [];
          const plan = await executeAdd({
            name: names[0] ?? "",
            names,
            cwd: options.cwd,
            force: options.force === true,
            dryRun: options.dryRun === true,
            yes: options.yes === true,
            ...(options.category ? { category: options.category } : {}),
            env: process.env,
          });

          if (plan.failed.length > 0) {
            process.exit(1);
          }
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

interface ResolvedAdd {
  plan: InstallPlan;
  itemsToInstall: readonly RegistryItem[];
  dependencyInstall: DependencyInstallPlan;
  cssUpdate: CssUpdate;
  envPlan: EnvInstallPlan;
  docsPlan: DocsPlan;
  requested: readonly string[];
  registryDependencies: readonly string[];
}

export async function executeAdd({
  name,
  names,
  cwd,
  force = false,
  dryRun = false,
  yes = false,
  category,
  from = process.cwd(),
  env = process.env,
  fetch: fetchImpl,
  runPackageManager,
  mutations,
  confirm,
}: {
  name: string;
  names?: readonly string[];
  cwd?: string;
  force?: boolean;
  dryRun?: boolean;
  yes?: boolean;
  category?: string;
  from?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  runPackageManager?: RunPackageManager;
  mutations?: AddMutations;
  confirm?: ConfirmFn;
}): Promise<InstallPlan> {
  return runAdd({
    cwd: await resolveProjectRoot(cwd, from),
    name,
    ...(names ? { names } : {}),
    force,
    dryRun,
    yes,
    ...(category ? { category } : {}),
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
    ...(runPackageManager ? { runPackageManager } : {}),
    ...(mutations ? { mutations } : {}),
    ...(confirm ? { confirm } : {}),
  });
}

export async function runAdd({
  cwd,
  name,
  names,
  force = false,
  dryRun = false,
  yes = false,
  category,
  env = process.env,
  fetch: fetchImpl,
  runPackageManager,
  mutations,
  confirm = confirmPrompt,
}: {
  cwd: string;
  name: string;
  names?: readonly string[];
  force?: boolean;
  dryRun?: boolean;
  yes?: boolean;
  category?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  runPackageManager?: RunPackageManager;
  mutations?: AddMutations;
  confirm?: ConfirmFn;
}): Promise<InstallPlan> {
  const selection = await resolveAddTargetNames({
    name,
    names,
    category,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  const resolved = await resolveAdd({
    cwd,
    name: selection.names[0] ?? name,
    names: selection.names,
    force,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  if (dryRun) {
    console.log(
      formatDryRunSummary({
        plan: resolved.plan,
        dependencyInstall: resolved.dependencyInstall,
        requested: resolved.requested,
        registryDependencies: resolved.registryDependencies,
      }),
    );
    return resolved.plan;
  }

  if (resolved.plan.entries.length === 0) {
    console.log(
      formatAddSummary({
        plan: resolved.plan,
        dependencyInstall: resolved.dependencyInstall,
        requested: resolved.requested,
        registryDependencies: resolved.registryDependencies,
      }),
    );
    return resolved.plan;
  }

  if (selection.categoryInstall && !yes) {
    console.log(
      formatCategoryInstallPrompt({
        plan: resolved.plan,
        dependencyInstall: resolved.dependencyInstall,
        requested: resolved.requested,
        registryDependencies: resolved.registryDependencies,
        category: selection.categoryInstall,
      }),
    );
    const accepted = await confirm("Continue? (y/N)");

    if (!accepted) {
      console.log("Cancelled. No changes made.");
      return {
        ...resolved.plan,
        entries: [],
        items: [],
        dependencies: [],
        devDependencies: [],
      };
    }
  }

  const needsInstall =
    resolved.dependencyInstall.installDependencies.length > 0 ||
    resolved.dependencyInstall.installDevDependencies.length > 0;
  const detected = needsInstall ? await findPackageManager(cwd) : undefined;
  const snapshot = await (mutations?.snapshotFiles ?? snapshotFiles)(cwd, [
    ...(detected ? ["package.json", detected.lockfile] : []),
    ...resolved.plan.entries.map((entry) => entry.destinationPath),
    ...(resolved.cssUpdate.changed ? [resolved.cssUpdate.relativePath] : []),
  ]);

  try {
    if (detected) {
      await installDependencies({
        cwd,
        manager: detected.manager,
        dependencies: resolved.dependencyInstall.installDependencies,
        devDependencies: resolved.dependencyInstall.installDevDependencies,
        env,
        ...(runPackageManager ? { run: runPackageManager } : {}),
      });
    }

    await (mutations?.writeComponents ?? writeInstallPlan)(cwd, resolved.plan);
    await (mutations?.writeCss ?? writeCssUpdate)(cwd, resolved.cssUpdate);
  } catch (error) {
    await rollbackMutation(cwd, snapshot, error, mutations?.restoreFiles);
  }

  console.log(
    formatAddSummary({
      plan: resolved.plan,
      dependencyInstall: resolved.dependencyInstall,
      requested: resolved.requested,
      registryDependencies: resolved.registryDependencies,
    }),
  );

  const envReport = formatEnvPlan(resolved.envPlan);

  if (envReport) {
    console.log("");
    console.log(envReport);
  }

  const docsReport = formatDocsPlan(resolved.docsPlan);

  if (docsReport) {
    console.log("");
    console.log(docsReport);
  }

  return resolved.plan;
}

async function resolveAddTargetNames({
  name,
  names,
  category,
  env,
  fetch: fetchImpl,
}: {
  name: string;
  names?: readonly string[];
  category?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<{ names: string[]; categoryInstall?: string }> {
  const explicit = uniqueNames(
    names && names.length > 0 ? names : name.trim() ? [name] : [],
  );

  if (explicit.length > 0) {
    if (category) {
      console.warn(
        "Ignoring --category because explicit components were provided.",
      );
    }

    return { names: explicit };
  }

  if (!category) {
    throw new CliError(
      [
        "Specify component names or a category.",
        "",
        "Examples:",
        "  $ vinyaas add button",
        "  $ vinyaas add --category forms",
      ].join("\n"),
    );
  }

  const expanded = await resolveCategoryComponentNames({
    category,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });

  return { names: expanded, categoryInstall: category.trim() };
}

/**
 * Shared resolution used by both real installs and `--dry-run`.
 * Performs registry/network and disk reads only — no writes.
 */
export async function resolveAdd({
  cwd,
  name,
  names,
  force = false,
  env = process.env,
  fetch: fetchImpl,
}: {
  cwd: string;
  name: string;
  names?: readonly string[];
  force?: boolean;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
}): Promise<ResolvedAdd> {
  const requested = uniqueNames(
    (names && names.length > 0 ? names : [name]).filter(
      (entry) => entry.trim() !== "",
    ),
  );

  if (requested.length === 0) {
    throw new CliError("Specify component names or a category.");
  }

  const config = await readComponentsConfig(cwd);
  const resolved = await resolveRegistryGraph({
    style: config.style,
    name: requested[0] ?? name,
    names: requested,
    env,
    allowMissing: true,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
  const failed = [...resolved.missing];
  const resolvedItems = resolved.items;

  if (resolvedItems.length === 0) {
    throw await unknownComponentsWithSuggestions(failed, {
      env,
      ...(fetchImpl ? { fetch: fetchImpl } : {}),
    });
  }

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
  plan.failed = failed;

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
  const requestedSet = new Set(requested);
  const registryDependencies = plan.items.filter(
    (itemName) => !requestedSet.has(itemName),
  );

  return {
    plan,
    itemsToInstall,
    dependencyInstall,
    cssUpdate,
    envPlan,
    docsPlan,
    requested,
    registryDependencies,
  };
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

async function unknownComponentsWithSuggestions(
  names: readonly string[],
  {
    env,
    fetch: fetchImpl,
  }: {
    env?: Record<string, string | undefined>;
    fetch?: typeof fetch;
  },
): Promise<RegistryError> {
  let catalogNames: string[] = [];

  try {
    const catalog = await getRegistryCatalog({
      env,
      ...(fetchImpl ? { fetch: fetchImpl } : {}),
    });
    catalogNames = catalog.items.map((item) => item.name);
  } catch {
    catalogNames = [];
  }

  const message = formatUnknownComponentMessage(names, catalogNames);
  return new RegistryError(`${message}\n\nNo files were changed.`);
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
