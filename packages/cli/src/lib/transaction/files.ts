import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { CliError } from "../cli-error.ts";
import { isInsideProject } from "../resolve-alias.ts";

/** Exact bytes of a project file, or null when the file did not exist. */
export interface FileSnapshot {
  relativePath: string;
  bytes: Buffer | null;
}

/**
 * Reads the exact bytes of project-relative files.
 * A missing file is recorded as absent. Contents are not parsed.
 */
export async function snapshotFiles(
  cwd: string,
  relativePaths: readonly string[],
): Promise<FileSnapshot[]> {
  const files: FileSnapshot[] = [];

  for (const relativePath of uniquePaths(relativePaths)) {
    const absolutePath = projectPath(cwd, relativePath);
    let bytes: Buffer | null;

    try {
      bytes = await readFile(absolutePath);
    } catch (error) {
      if (!isNotFound(error)) {
        throw error;
      }

      bytes = null;
    }

    files.push({ relativePath, bytes });
  }

  return files;
}

/**
 * Restores snapshotted files. Missing files are removed.
 * Failures list paths and do not include file contents.
 */
export async function restoreFiles(
  cwd: string,
  files: readonly FileSnapshot[],
): Promise<void> {
  const failures: string[] = [];

  for (const file of [...files].reverse()) {
    try {
      const absolutePath = projectPath(cwd, file.relativePath);

      if (file.bytes === null) {
        await rm(absolutePath, { force: true });
        continue;
      }

      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, file.bytes);
    } catch (error) {
      failures.push(`- ${file.relativePath}: ${shortError(error)}`);
    }
  }

  if (failures.length > 0) {
    throw new CliError(["Rollback failed:", ...failures].join("\n"));
  }
}

export function formatRollbackError(
  error: unknown,
  rollbackError?: unknown,
): CliError {
  const lines = ["Installation failed."];

  if (rollbackError === undefined) {
    lines.push("Changes were rolled back.", messageOf(error));
  } else {
    lines.push(messageOf(error), rollbackMessage(rollbackError));
  }

  return new CliError(lines.join("\n"));
}

function uniquePaths(relativePaths: readonly string[]): string[] {
  return [...new Set(relativePaths)];
}

function projectPath(cwd: string, relativePath: string): string {
  const segments = relativePath.split(/[\\/]/);

  if (
    path.isAbsolute(relativePath) ||
    relativePath.startsWith("/") ||
    segments.includes("..") ||
    segments.includes("")
  ) {
    throw new CliError(
      ["Cannot snapshot a path outside the project:", relativePath].join("\n"),
    );
  }

  const absolutePath = path.resolve(cwd, relativePath);

  if (!isInsideProject(cwd, absolutePath)) {
    throw new CliError(
      ["Cannot snapshot a path outside the project:", relativePath].join("\n"),
    );
  }

  return absolutePath;
}

function shortError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  if (error instanceof Error) {
    return error.message.split("\n")[0]?.slice(0, 120) || "unknown error";
  }

  return "unknown error";
}

function rollbackMessage(error: unknown): string {
  const message = messageOf(error);

  if (message.startsWith("Rollback failed:")) {
    return message;
  }

  return `Rollback failed:\n${message}`;
}

function messageOf(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "unknown error";
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
