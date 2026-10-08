import { Command } from "commander";
import { ComponentsConfigError } from "../../../../config/components.ts";

import { executeAdd } from "./add.ts";
import { CliError } from "../lib/cli-error.ts";
import type { InstallPlan } from "../lib/install-plan.ts";
import { listManifestComponents, readManifest } from "../lib/manifest/store.ts";
import type { RunPackageManager } from "../lib/package-manager/types.ts";
import { confirmPrompt, type ConfirmFn } from "../lib/prompt.ts";
import { resolveProjectRoot } from "../lib/project/cwd.ts";
import { RegistryError } from "../lib/registry/client.ts";
import {
  formatUpdateConfirmQuestion,
  formatUpdatePrompt,
} from "../lib/update/format.ts";

export function registerUpdateCommand(program: Command): void {
  program
    .command("update")
    .description("Update installed components to the latest registry versions.")
    .argument(
      "[name...]",
      "Component names to update. Omit to update every installed component.",
    )
    .option("--cwd <path>", "Consumer project directory.")
    .option(
      "--dry-run",
      "Resolve the update plan and print it without writing files.",
    )
    .option("-y, --yes", "Skip confirmation prompts.")
    .addHelpText(
      "after",
      [
        "",
        "Usage:",
        "  $ vinyaas update",
        "  $ vinyaas update <component...>",
        "",
        "Examples:",
        "  $ vinyaas update button",
        "  $ vinyaas update button card",
        "  $ vinyaas update",
        "  $ vinyaas update --yes",
        "  $ vinyaas update button --dry-run",
        "",
        "Updates overwrite local component files with the latest registry source.",
        "With no names, every component in `.vinyaas/manifest.json` is updated",
        "after confirmation (unless --yes).",
        "Only components already installed via Vinyaas can be updated.",
      ].join("\n"),
    )
    .action(
      async (
        name: string[] | undefined,
        options: {
          cwd?: string;
          dryRun?: boolean;
          yes?: boolean;
        },
      ) => {
        try {
          const plan = await executeUpdate({
            names: name ?? [],
            cwd: options.cwd,
            dryRun: options.dryRun === true,
            yes: options.yes === true,
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

export async function executeUpdate({
  names = [],
  cwd,
  dryRun = false,
  yes = false,
  from = process.cwd(),
  env = process.env,
  fetch: fetchImpl,
  runPackageManager,
  confirm = confirmPrompt,
}: {
  names?: readonly string[];
  cwd?: string;
  dryRun?: boolean;
  yes?: boolean;
  from?: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  runPackageManager?: RunPackageManager;
  confirm?: ConfirmFn;
}): Promise<InstallPlan> {
  const projectRoot = await resolveProjectRoot(cwd, from);
  let manifest;

  try {
    manifest = await readManifest(projectRoot);
  } catch (error) {
    throw new CliError(
      error instanceof Error
        ? error.message
        : "Could not read .vinyaas/manifest.json.",
    );
  }

  const installed = listManifestComponents(manifest);

  if (installed.length === 0) {
    throw new CliError(
      [
        "No components are installed in this project.",
        "Run `vinyaas add <component>` first.",
      ].join("\n"),
    );
  }

  const requested = names.map((name) => name.trim()).filter(Boolean);
  const updateAll = requested.length === 0;
  let targets: string[];

  if (updateAll) {
    targets = installed;
  } else {
    const missing = requested.filter((name) => !installed.includes(name));

    if (missing.length > 0) {
      throw new CliError(
        [
          missing.length === 1
            ? `${missing[0]} is not installed in this project.`
            : `These components are not installed: ${missing.join(", ")}.`,
          "Installed:",
          ...installed.map((name) => `  ${name}`),
          "",
          "Install missing components with `vinyaas add`, then update.",
        ].join("\n"),
      );
    }

    targets = [...new Set(requested)];
  }

  if (!dryRun && !yes) {
    console.log(formatUpdatePrompt({ targets, updateAll }));
    const accepted = await confirm(
      formatUpdateConfirmQuestion({ targets, updateAll }),
    );

    if (!accepted) {
      console.log("Cancelled. No changes made.");
      return {
        name: targets[0] ?? "",
        entries: [],
        items: [],
        dependencies: [],
        devDependencies: [],
        skipped: [],
        failed: [],
      };
    }
  }

  return executeAdd({
    name: targets[0] ?? "",
    names: targets,
    cwd: projectRoot,
    force: true,
    dryRun,
    yes: true,
    from: projectRoot,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
    ...(runPackageManager ? { runPackageManager } : {}),
    summaryMode: "update",
  });
}
