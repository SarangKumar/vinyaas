import { stat } from "node:fs/promises";
import path from "node:path";

import { CliError } from "../cli-error.ts";
import type { PackageManager } from "./types.ts";

const lockfiles = [
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
] as const satisfies ReadonlyArray<readonly [string, PackageManager]>;

/**
 * Chooses the consumer package manager from lockfiles in the project root.
 * A missing lockfile or more than one lockfile is an error. Installed
 * executables are not consulted.
 */
export async function findPackageManager(cwd: string): Promise<{
  manager: PackageManager;
  lockfile: string;
}> {
  const found: string[] = [];
  let manager: PackageManager | undefined;

  for (const [filename, packageManager] of lockfiles) {
    if (await fileExists(path.join(cwd, filename))) {
      found.push(filename);
      manager ??= packageManager;
    }
  }

  if (found.length === 0) {
    throw new CliError(
      [
        "No package manager lockfile was found.",
        "Expected one of:",
        ...lockfiles.map(([filename]) => `- ${filename}`),
      ].join("\n"),
    );
  }

  if (found.length > 1 || manager === undefined) {
    throw new CliError(
      [
        "Multiple package manager lockfiles were found:",
        ...found.map((filename) => `- ${filename}`),
        "",
        "Please keep only the lockfile for the package manager used by this project.",
      ].join("\n"),
    );
  }

  return { manager, lockfile: found[0] };
}

export async function detectPackageManager(
  cwd: string,
): Promise<PackageManager> {
  return (await findPackageManager(cwd)).manager;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const file = await stat(filePath);
    return file.isFile();
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
