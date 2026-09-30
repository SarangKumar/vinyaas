import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Command } from "commander";

import { registerAddCommand } from "./commands/add.js";
import { registerDoctorCommand } from "./commands/doctor.js";
import { registerInfoCommand } from "./commands/info.js";
import { registerInitCommand } from "./commands/init.js";
import { registerListCommand } from "./commands/list.js";
import { registerSearchCommand } from "./commands/search.js";

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

/** Builds the Vinyaas CLI. Subcommands register on the returned program. */
export function createProgram(): Command {
  const program = new Command()
    .name("vinyaas")
    .description(
      "Install and discover Vinyaas UI components from the registry.",
    )
    .version(readPackageVersion());

  registerInitCommand(program);
  registerAddCommand(program);
  registerListCommand(program);
  registerSearchCommand(program);
  registerInfoCommand(program);
  registerDoctorCommand(program);

  return program;
}
