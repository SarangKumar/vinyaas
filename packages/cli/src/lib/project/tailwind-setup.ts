import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { hasDependency, type PackageManifest } from "../detect-project.ts";

const postcssConfigNames = [
  "postcss.config.mjs",
  "postcss.config.js",
  "postcss.config.cjs",
  "postcss.config.ts",
] as const;

const defaultPostcssConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`;

/**
 * Ensures a Tailwind v4 PostCSS config exists.
 * Reuses an existing config that already references `@tailwindcss/postcss`.
 */
export async function ensurePostcssConfig(
  cwd: string,
): Promise<"created" | "exists"> {
  for (const name of postcssConfigNames) {
    const path = join(cwd, name);

    try {
      const source = await readFile(path, "utf8");
      if (
        source.includes("@tailwindcss/postcss") ||
        source.includes("tailwindcss")
      ) {
        return "exists";
      }
    } catch (error) {
      if (!isNotFound(error)) {
        throw error;
      }
    }
  }

  await writeFile(join(cwd, "postcss.config.mjs"), defaultPostcssConfig);
  return "created";
}

/** Dependencies init may need to install for Tailwind v4 + cn(). */
export function planInitDependencies(packageJson: PackageManifest): {
  dependencies: string[];
  devDependencies: string[];
} {
  const dependencies: string[] = [];
  const devDependencies: string[] = [];

  if (!hasDependency(packageJson, "clsx")) {
    dependencies.push("clsx");
  }

  if (!hasDependency(packageJson, "tailwind-merge")) {
    dependencies.push("tailwind-merge");
  }

  if (
    !hasDependency(packageJson, "tailwindcss") &&
    !hasDependency(packageJson, "@tailwindcss/postcss") &&
    !hasDependency(packageJson, "@tailwindcss/vite")
  ) {
    devDependencies.push("tailwindcss@^4");
  }

  if (
    !hasDependency(packageJson, "@tailwindcss/postcss") &&
    !hasDependency(packageJson, "@tailwindcss/vite")
  ) {
    devDependencies.push("@tailwindcss/postcss@^4");
  }

  return { dependencies, devDependencies };
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
