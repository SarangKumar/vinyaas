#!/usr/bin/env node
import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRegistryBasePath } from "../../../config/registry.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");

/** Production registry root used for npm release builds. */
export const PRODUCTION_REGISTRY_BASE_PATH = "https://vinyaas.vercel.app/r";

const isRelease =
  process.env.VINYAAS_RELEASE === "1" || process.env.NODE_ENV === "production";

/**
 * Resolves the registry base path once at build time and embeds it as the
 * CLI runtime fallback. Runtime REGISTRY_BASE_PATH / REGISTRY_BASE_URL still
 * override this value when set.
 *
 * Release builds default to the production registry and refuse localhost.
 */
const registryBasePath = resolveBuildRegistryBasePath();

if (isRelease && registryBasePath.includes("localhost")) {
  throw new Error(
    [
      "Release CLI builds must not embed a localhost registry path.",
      `Resolved: ${registryBasePath}`,
      `Set REGISTRY_BASE_PATH=${PRODUCTION_REGISTRY_BASE_PATH}`,
    ].join("\n"),
  );
}

console.log(`Embedding registry base path: ${registryBasePath}`);

await build({
  entryPoints: [path.join(packageRoot, "src/index.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: path.join(packageRoot, "dist/index.js"),
  packages: "external",
  sourcemap: true,
  // Release builds minify so the localhost fallback string is constant-folded away
  // once __VINYAAS_REGISTRY_BASE_PATH__ is baked to production.
  minify: isRelease,
  define: {
    __VINYAAS_REGISTRY_BASE_PATH__: JSON.stringify(registryBasePath),
  },
});

function resolveBuildRegistryBasePath() {
  if (isRelease) {
    return getRegistryBasePath(
      {
        ...process.env,
        REGISTRY_BASE_PATH:
          process.env.REGISTRY_BASE_PATH?.trim() ||
          PRODUCTION_REGISTRY_BASE_PATH,
      },
      { require: true },
    );
  }

  return getRegistryBasePath(process.env, { require: false });
}
