import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

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

export const projectUtilsPath = "lib/utils.ts";

export async function ensureProjectUtils(
  cwd: string,
): Promise<"created" | "exists"> {
  const outputPath = join(cwd, projectUtilsPath);

  if (await pathExists(outputPath)) {
    return "exists";
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, projectUtilsSource, {
    encoding: "utf8",
    flag: "wx",
  });

  return "created";
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
