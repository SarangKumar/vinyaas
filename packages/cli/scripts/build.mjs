#!/usr/bin/env node
import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRegistryBasePath } from "../../../config/registry.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");

/**
 * Resolves the registry base path once at build time and embeds it as the
 * CLI runtime fallback. Runtime REGISTRY_BASE_PATH / REGISTRY_BASE_URL still
 * override this value when set.
 */
const registryBasePath = getRegistryBasePath(process.env, {
  require: process.env.NODE_ENV === "production",
});

await build({
  entryPoints: [path.join(packageRoot, "src/index.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: path.join(packageRoot, "dist/index.js"),
  packages: "external",
  sourcemap: true,
  define: {
    __VINYAAS_REGISTRY_BASE_PATH__: JSON.stringify(registryBasePath),
  },
});
