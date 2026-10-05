#!/usr/bin/env node
/**
 * Production CLI release build:
 * 1. Rebuild registry artifacts with production URLs
 * 2. Bundle CLI with production registry path embedded
 * 3. Verify version + embedded registry path
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  localRegistryBasePath,
  productionRegistryBasePath,
} from "../config/registry.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTION_REGISTRY = productionRegistryBasePath;
const LOCALHOST_REGISTRY = localRegistryBasePath;

function run(command, args, env = {}) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(
  "pnpm",
  ["registry:build"],
  { REGISTRY_BASE_PATH: PRODUCTION_REGISTRY },
);

run(
  "pnpm",
  ["--filter", "vinyaas", "build"],
  {
    VINYAAS_RELEASE: "1",
    REGISTRY_BASE_PATH: PRODUCTION_REGISTRY,
    NODE_ENV: "production",
  },
);

const cli = path.join(root, "packages/cli/dist/index.js");
if (!fs.existsSync(cli)) {
  console.error(`Missing CLI bundle: ${cli}`);
  process.exit(1);
}

run("node", [cli, "--version"]);

const bundle = fs.readFileSync(cli, "utf8");
const hasProduction = bundle.includes(PRODUCTION_REGISTRY);
const hasLocalhostRegistry = bundle.includes(LOCALHOST_REGISTRY);

console.log("\nRegistry path scan:");
console.log(
  `  ${PRODUCTION_REGISTRY}: ${hasProduction ? "found" : "MISSING"}`,
);
console.log(
  `  ${LOCALHOST_REGISTRY}: ${hasLocalhostRegistry ? "FOUND (fail)" : "absent"}`,
);

if (!hasProduction) {
  console.error("Release build failed: production registry path was not embedded.");
  process.exit(1);
}

if (hasLocalhostRegistry) {
  console.error(
    "Release build failed: localhost registry path is still embedded in the CLI bundle.",
  );
  process.exit(1);
}

const buttonJson = path.join(
  root,
  "apps/docs/public/r/new-york/button.json",
);
const button = JSON.parse(fs.readFileSync(buttonJson, "utf8"));
if (button.docs !== "https://vinyaas.vercel.app/components/button") {
  console.error(
    `Release build failed: expected production docs in ${buttonJson}, got ${button.docs}`,
  );
  process.exit(1);
}

const expectedSchema = `${PRODUCTION_REGISTRY}/schema/registry-item.json`;
if (button.$schema !== expectedSchema) {
  console.error(
    `Release build failed: expected production $schema in ${buttonJson}, got ${button.$schema}`,
  );
  process.exit(1);
}

const localhostHits = findLocalhostRegistryFiles(
  path.join(root, "apps/docs/public/r"),
  LOCALHOST_REGISTRY,
);
if (localhostHits.length > 0) {
  console.error(
    [
      "Release build failed: localhost registry URLs found in generated registry JSON.",
      "Run `pnpm registry:schema:production` (or `pnpm registry:build` with production",
      "REGISTRY_BASE_PATH) before releasing.",
      "",
      ...localhostHits.slice(0, 10).map((file) => `  ${file}`),
      localhostHits.length > 10
        ? `  …and ${localhostHits.length - 10} more`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  process.exit(1);
}

console.log("\ncli:release-build OK");

function findLocalhostRegistryFiles(directory, localhostBase) {
  /** @type {string[]} */
  const hits = [];

  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!entry.name.endsWith(".json")) {
        continue;
      }
      const source = fs.readFileSync(fullPath, "utf8");
      if (source.includes(localhostBase)) {
        hits.push(path.relative(root, fullPath));
      }
    }
  }

  walk(directory);
  return hits;
}
