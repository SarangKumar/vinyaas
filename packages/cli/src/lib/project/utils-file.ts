import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import { resolveAliasDirectory } from "../resolve-alias.ts";

/**
 * Project infrastructure written by `vinyaas init`.
 * This is not a registry item. Components import `cn` from `@/lib/utils`.
 */
export const projectUtilsSource = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

export const projectUtilsSourceJs = `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
`;

/**
 * Writes `lib/utils` at the path implied by the project's `@/lib/utils` alias.
 */
export async function ensureProjectUtils({
  cwd,
  tsx,
  utilsAlias = "@/lib/utils",
}: {
  cwd: string;
  tsx: boolean;
  utilsAlias?: string;
}): Promise<{ status: "created" | "exists"; relativePath: string }> {
  let resolvedBase: string;

  try {
    resolvedBase = await resolveAliasDirectory(cwd, utilsAlias);
  } catch {
    resolvedBase = join(cwd, "lib", "utils");
  }

  const outputPath = `${resolvedBase}${tsx ? ".ts" : ".js"}`;
  const relativePath = relative(cwd, outputPath).split("\\").join("/");

  if (await pathExists(outputPath)) {
    return { status: "exists", relativePath };
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, tsx ? projectUtilsSource : projectUtilsSourceJs, {
    encoding: "utf8",
    flag: "wx",
  });

  return { status: "created", relativePath };
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

/** Path written by init for the default `@/*` → `./*` alias layout. */
export const projectUtilsPath = "lib/utils.ts";
