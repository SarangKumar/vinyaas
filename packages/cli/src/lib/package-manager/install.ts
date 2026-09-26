import { spawn } from "node:child_process";

import { CliError } from "../cli-error.ts";
import type {
  PackageManager,
  PackageManagerCommand,
  RunPackageManager,
} from "./types.ts";

const installArgs: Record<PackageManager, [string, string]> = {
  pnpm: ["pnpm", "add"],
  npm: ["npm", "install"],
  yarn: ["yarn", "add"],
  bun: ["bun", "add"],
};

/**
 * Installs npm dependencies with the consumer's package manager.
 * Does not inspect package.json and does not skip packages that are already present.
 */
export async function installDependencies({
  cwd,
  manager,
  dependencies,
  env = process.env,
  run = runPackageManager,
}: {
  cwd: string;
  manager: PackageManager;
  dependencies: readonly string[];
  env?: NodeJS.ProcessEnv;
  run?: RunPackageManager;
}): Promise<void> {
  if (dependencies.length === 0) {
    return;
  }

  const [command, subcommand] = installArgs[manager];

  await run({
    command,
    args: [subcommand, ...dependencies],
    cwd,
    env,
  });
}

export function runPackageManager(
  command: PackageManagerCommand,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command.command, command.args, {
      cwd: command.cwd,
      env: command.env,
      stdio: "inherit",
      shell: false,
    });

    child.on("error", (error) => {
      reject(
        new CliError(
          [
            "Dependency installation failed.",
            `Could not run ${command.command}.`,
            error.message,
          ].join("\n"),
        ),
      );
    });

    child.on("close", (status) => {
      if (status === 0) {
        resolve();
        return;
      }

      reject(
        new CliError(
          [
            "Dependency installation failed.",
            `${command.command} ${command.args.join(" ")} exited with status ${status ?? "unknown"}.`,
          ].join("\n"),
        ),
      );
    });
  });
}
