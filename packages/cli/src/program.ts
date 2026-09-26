import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Command } from "commander";

import { registerAddCommand } from "./commands/add.js";
import { registerInitCommand } from "./commands/init.js";

export function readPackageVersion(moduleUrl = import.meta.url): string {
  const packageJsonPath = join(
    dirname(fileURLToPath(moduleUrl)),
    "../package.json",
  );
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    version?: string;
  };

  if (!packageJson.version) {
    throw new Error("CLI package version is missing");
  }

  return packageJson.version;
}

/** Builds the Vinyas CLI. Subcommands register on the returned program. */
export function createProgram(): Command {
  const program = new Command()
    .name("vinyas")
    .description("Install Vinyas components into a project.")
    .version(readPackageVersion());

  registerInitCommand(program);
  registerAddCommand(program);

  return program;
}
