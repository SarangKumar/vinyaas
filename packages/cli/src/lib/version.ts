import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Reads the published CLI package version.
 * Resolves both source (`src/lib`) and bundled (`dist`) layouts.
 */
export function readPackageVersion(moduleUrl = import.meta.url): string {
  const here = dirname(fileURLToPath(moduleUrl));

  for (const candidate of [
    join(here, "../package.json"),
    join(here, "../../package.json"),
  ]) {
    try {
      const packageJson = JSON.parse(readFileSync(candidate, "utf8")) as {
        name?: string;
        version?: string;
      };

      if (packageJson.name === "vinyaas" && packageJson.version) {
        return packageJson.version;
      }
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error("CLI package version is missing");
}
