import { Command } from "commander";

import { CliError } from "../lib/cli-error.ts";
import {
  formatStatusJson,
  formatStatusReport,
} from "../lib/manifest/format.ts";
import { listManifestComponents, readManifest } from "../lib/manifest/store.ts";
import { resolveProjectRoot } from "../lib/project/cwd.ts";

export function registerStatusCommand(program: Command): void {
  program
    .command("status")
    .description("Show components installed by Vinyaas in this project.")
    .option("--cwd <path>", "Consumer project directory.")
    .option("--json", "Print machine-readable JSON to stdout.")
    .addHelpText(
      "after",
      [
        "",
        "Examples:",
        "  $ vinyaas status",
        "  $ vinyaas status --json",
        "  $ vinyaas status --cwd ./my-app",
        "",
        "Vinyaas tracks installed components locally to support future update/remove workflows.",
      ].join("\n"),
    )
    .action(async (options: { cwd?: string; json?: boolean }) => {
      try {
        await executeStatus({
          cwd: options.cwd,
          json: options.json === true,
        });
      } catch (error) {
        if (error instanceof CliError) {
          console.error(error.message);
          process.exit(1);
        }

        throw error;
      }
    });
}

export async function executeStatus({
  cwd,
  from = process.cwd(),
  json = false,
}: {
  cwd?: string;
  from?: string;
  json?: boolean;
}): Promise<{ version: string | null; components: string[] }> {
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

  if (json) {
    console.log(formatStatusJson(manifest));
  } else {
    console.log(formatStatusReport(manifest));
  }

  return {
    version: manifest?.version ?? null,
    components: listManifestComponents(manifest),
  };
}
