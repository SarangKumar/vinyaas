#!/usr/bin/env node
/**
 * Point generated registry JSON `$schema` URLs at local or production.
 *
 * Always rebuilds from the production registry base so docs and other
 * non-schema URLs stay on production. Then rewrites only `$schema` values
 * when targeting local testing.
 *
 * Usage:
 *   pnpm registry:schema:local
 *   pnpm registry:schema:production
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  localRegistryBasePath,
  productionRegistryBasePath,
  registryItemSchemaUrl,
} from "../config/registry.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(root, "apps/docs/public/r");
const mode = process.argv[2];

if (mode !== "local" && mode !== "production") {
  console.error("Usage: tsx scripts/registry-schema.ts <local|production>");
  process.exit(1);
}

console.log(
  `Rebuilding registry from ${productionRegistryBasePath} (docs/content stay production)`,
);

const build = spawnSync("pnpm", ["exec", "tsx", "scripts/build-registry.ts"], {
  cwd: root,
  env: {
    ...process.env,
    REGISTRY_BASE_PATH: productionRegistryBasePath,
  },
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (build.error) {
  console.error(build.error.message);
  process.exit(1);
}

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (mode === "production") {
  console.log(
    `Registry $schema base → ${productionRegistryBasePath} (unchanged after production rebuild)`,
  );
  process.exit(0);
}

const productionSchemaPrefix = `${productionRegistryBasePath}/schema/`;
const localSchemaPrefix = `${localRegistryBasePath}/schema/`;
const rewritten = await rewriteSchemaUrls(outputRoot, {
  fromPrefix: productionSchemaPrefix,
  toPrefix: localSchemaPrefix,
});

console.log(
  `Rewrote $schema on ${rewritten} file(s) → ${registryItemSchemaUrl(localRegistryBasePath)}`,
);

async function rewriteSchemaUrls(
  directory: string,
  {
    fromPrefix,
    toPrefix,
  }: {
    fromPrefix: string;
    toPrefix: string;
  },
): Promise<number> {
  let count = 0;
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      count += await rewriteSchemaUrls(fullPath, { fromPrefix, toPrefix });
      continue;
    }

    if (!entry.name.endsWith(".json")) {
      continue;
    }

    const source = await fs.readFile(fullPath, "utf8");
    let parsed: unknown;

    try {
      parsed = JSON.parse(source);
    } catch {
      continue;
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      continue;
    }

    const record = parsed as Record<string, unknown>;
    const schema = record.$schema;

    if (typeof schema !== "string" || !schema.startsWith(fromPrefix)) {
      continue;
    }

    record.$schema = `${toPrefix}${schema.slice(fromPrefix.length)}`;
    const next = `${JSON.stringify(record, null, 2)}\n`;

    if (next !== source) {
      await fs.writeFile(fullPath, next, "utf8");
      count += 1;
    }
  }

  return count;
}
