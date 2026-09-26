import { stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { Command } from "commander";
import {
  componentBaseColors,
  componentStyles,
  componentsSchemaUrl,
  parseComponentsConfig,
  registryBaseUrlFromEnv,
  type ComponentsConfig,
} from "../../../../config/components.ts";

import { CliError } from "../lib/cli-error.js";
import { detectProject } from "../lib/detect-project.js";
import { resolveProjectRoot } from "../lib/project/cwd.js";

const alreadyExistsMessage = [
  "components.json already exists.",
  "Vinyas will not overwrite it.",
].join("\n");

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Create components.json for the current project.")
    .option("--cwd <path>", "Consumer project directory.")
    .action(async (options: { cwd?: string }) => {
      try {
        await executeInit({ cwd: options.cwd, env: process.env });
      } catch (error) {
        if (error instanceof CliError) {
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
  env,
}: {
  cwd?: string;
  from?: string;
  env: Record<string, string | undefined>;
}): Promise<void> {
  await runInit({
    cwd: await resolveProjectRoot(cwd, from),
    env,
  });
}

export async function runInit({
  cwd,
  env,
}: {
  cwd: string;
  env: Record<string, string | undefined>;
}): Promise<void> {
  const outputPath = join(cwd, "components.json");

  if (await pathExists(outputPath)) {
    throw new CliError(alreadyExistsMessage);
  }

  const project = await detectProject(cwd);
  const config = createConfig(project, env);

  await writeFile(outputPath, `${JSON.stringify(config, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });

  console.log("Created components.json.");
}

function createConfig(
  project: Awaited<ReturnType<typeof detectProject>>,
  env: Record<string, string | undefined>,
): ComponentsConfig {
  return parseComponentsConfig({
    $schema: componentsSchemaUrl(registryBaseUrlFromEnv(env)),
    style: componentStyles[0],
    tsx: project.tsx,
    tailwind: {
      css: project.css,
      baseColor: componentBaseColors[0],
      cssVariables: true,
    },
    aliases: project.aliases,
  });
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }

    throw error;
  }
}
