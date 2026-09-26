import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { Command } from "commander";
import {
  ComponentsConfigError,
  parseComponentsConfig,
  type ComponentsConfig,
} from "../../../../config/components.ts";

import { CliError } from "../lib/cli-error.ts";
import { createInstallPlan, type InstallPlan } from "../lib/install-plan.ts";
import { detectPackageManager } from "../lib/package-manager/detect.ts";
import { installDependencies } from "../lib/package-manager/install.ts";
import type { RunPackageManager } from "../lib/package-manager/types.ts";
import { RegistryError, fetchRegistryItem } from "../lib/registry/client.ts";

const missingConfigMessage = [
  "components.json was not found.",
  "Run `vinyas init` first.",
].join("\n");

export function registerAddCommand(program: Command): void {
  program
    .command("add")
    .description("Add a component from the Vinyas registry.")
    .argument("<name>", "Registry item name")
    .action(async (name: string) => {
      try {
        await runAdd({ cwd: process.cwd(), name, env: process.env });
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
    });
}

export async function runAdd({
  cwd,
  name,
  env = process.env,
  fetch: fetchImpl,
  runPackageManager,
}: {
  cwd: string;
  name: string;
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  runPackageManager?: RunPackageManager;
}): Promise<InstallPlan> {
  const config = await readComponentsConfig(cwd);
  const item = await fetchRegistryItem({
    style: config.style,
    name,
    env,
    ...(fetchImpl ? { fetch: fetchImpl } : {}),
  });
  const plan = await createInstallPlan({ cwd, config, item });

  await assertDestinationsAvailable(cwd, plan);

  if (plan.dependencies.length > 0) {
    const manager = await detectPackageManager(cwd);

    await installDependencies({
      cwd,
      manager,
      dependencies: plan.dependencies,
      env,
      ...(runPackageManager ? { run: runPackageManager } : {}),
    });
  }

  await writePlan(cwd, plan);
  console.log(formatAdded(plan));

  return plan;
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

async function assertDestinationsAvailable(
  cwd: string,
  plan: InstallPlan,
): Promise<void> {
  const existing: string[] = [];

  for (const entry of plan.entries) {
    if (await pathExists(path.resolve(cwd, entry.destinationPath))) {
      existing.push(entry.destinationPath);
    }
  }

  if (existing.length > 0) {
    throw new CliError(["File already exists:", ...existing].join("\n"));
  }
}

async function writePlan(cwd: string, plan: InstallPlan): Promise<void> {
  for (const entry of plan.entries) {
    const destination = path.resolve(cwd, entry.destinationPath);

    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, entry.content, {
      encoding: "utf8",
      flag: "wx",
    });
  }
}

function formatAdded(plan: InstallPlan): string {
  const lines = [
    `Added ${plan.name}.`,
    "",
    "Files:",
    ...plan.entries.map((entry) => `  ${entry.destinationPath}`),
  ];

  if (plan.dependencies.length > 0) {
    lines.push(
      "",
      "Installed dependencies:",
      ...plan.dependencies.map((dependency) => `  ${dependency}`),
    );
  }

  if (plan.registryDependencies.length > 0) {
    lines.push(
      "",
      "Registry dependencies were not installed:",
      ...plan.registryDependencies.map((dependency) => `  ${dependency}`),
    );
  }

  return lines.join("\n");
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    const file = await stat(filePath);
    return file.isFile();
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
