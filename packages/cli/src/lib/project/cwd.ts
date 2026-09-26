import { stat } from "node:fs/promises";
import path from "node:path";

import { CliError } from "../cli-error.ts";

/**
 * Resolves the consumer project root.
 * Relative paths are resolved from `from`, which is the process working directory.
 * The result is absolute. This does not change `process.cwd()`.
 */
export async function resolveProjectRoot(
  requested?: string,
  from: string = process.cwd(),
): Promise<string> {
  const base = path.resolve(from);

  if (requested === undefined) {
    return base;
  }

  const projectRoot = path.resolve(base, requested);
  let info: Awaited<ReturnType<typeof stat>>;

  try {
    info = await stat(projectRoot);
  } catch (error) {
    if (isNotFound(error)) {
      throw new CliError(
        ["Project directory does not exist:", requested].join("\n"),
      );
    }

    throw error;
  }

  if (!info.isDirectory()) {
    throw new CliError(
      ["Project path is not a directory:", requested].join("\n"),
    );
  }

  return projectRoot;
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
