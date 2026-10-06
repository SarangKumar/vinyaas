#!/usr/bin/env node
/**
 * Refuse `npm publish` when dist still embeds the local registry.
 * Always run `pnpm cli:release-build` (from the monorepo root) before publish.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distPath = path.join(packageRoot, "dist/index.js");
const PRODUCTION = "https://vinyaas.vercel.app/r";
const LOCALHOST = "http://localhost:3000/r";

if (!fs.existsSync(distPath)) {
  console.error(
    [
      "prepublishOnly failed: packages/cli/dist/index.js is missing.",
      "From the monorepo root run: pnpm cli:release-build",
    ].join("\n"),
  );
  process.exit(1);
}

const bundle = fs.readFileSync(distPath, "utf8");
const hasProduction = bundle.includes(PRODUCTION);
const hasLocalhost = bundle.includes(LOCALHOST);

if (!hasProduction || hasLocalhost) {
  console.error(
    [
      "prepublishOnly failed: CLI dist must embed the production registry only.",
      `  ${PRODUCTION}: ${hasProduction ? "found" : "MISSING"}`,
      `  ${LOCALHOST}: ${hasLocalhost ? "FOUND (fail)" : "absent"}`,
      "",
      "From the monorepo root run:",
      "  pnpm cli:release-build",
      "then publish from packages/cli.",
    ].join("\n"),
  );
  process.exit(1);
}

console.log("prepublishOnly OK: production registry embedded, localhost absent.");
