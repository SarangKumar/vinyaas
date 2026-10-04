#!/usr/bin/env node
/**
 * Local npm release verification:
 * - run production CLI release build
 * - npm pack
 * - inspect tarball contents
 * - install the tarball globally and smoke-test the binary
 *
 * Does not publish to npm.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  localRegistryBasePath,
  productionRegistryBasePath,
} from "../config/registry.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliRoot = path.join(root, "packages/cli");
const PRODUCTION_DOCS = `${productionRegistryBasePath.replace(/\/r$/, "")}/components/button`;
const PRODUCTION_REGISTRY = productionRegistryBasePath;
const LOCALHOST_REGISTRY = localRegistryBasePath;

function run(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: { ...process.env, ...(options.env ?? {}) },
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    if (options.capture) {
      process.stderr.write(result.stderr || result.stdout || "");
    }
    process.exit(result.status ?? 1);
  }
  return result;
}

run("pnpm", ["cli:release-build"]);

const pkg = JSON.parse(
  fs.readFileSync(path.join(cliRoot, "package.json"), "utf8"),
);
const cliBundle = path.join(cliRoot, "dist/index.js");

if (!fs.existsSync(cliBundle)) {
  console.error(`Expected built CLI missing: ${cliBundle}`);
  process.exit(1);
}

const bundle = fs.readFileSync(cliBundle, "utf8");
if (!bundle.includes(PRODUCTION_REGISTRY)) {
  console.error("Release check failed: production registry path missing from CLI bundle.");
  process.exit(1);
}
if (bundle.includes(LOCALHOST_REGISTRY)) {
  console.error("Release check failed: localhost registry path found in CLI bundle.");
  process.exit(1);
}

const versionResult = run("node", [cliBundle, "--version"], { capture: true });
const reportedVersion = (versionResult.stdout || "").trim();
if (reportedVersion !== pkg.version) {
  console.error(
    `CLI version mismatch: package.json=${pkg.version}, cli=${reportedVersion}`,
  );
  process.exit(1);
}
console.log(`CLI version OK: ${reportedVersion}`);

const tarballName = `vinyaas-${pkg.version}.tgz`;
const tarballPath = path.join(cliRoot, tarballName);

if (fs.existsSync(tarballPath)) {
  fs.unlinkSync(tarballPath);
}

run("npm", ["pack"], { cwd: cliRoot });

if (!fs.existsSync(tarballPath)) {
  console.error(`Expected pack output missing: ${tarballPath}`);
  process.exit(1);
}

const listed = run("tar", ["-tzf", tarballPath], {
  cwd: cliRoot,
  capture: true,
});
const entries = (listed.stdout || "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const required = [
  "package/dist/index.js",
  "package/README.md",
  "package/package.json",
];
for (const entry of required) {
  if (!entries.includes(entry)) {
    console.error(`npm pack is missing ${entry}`);
    console.error(entries.join("\n"));
    process.exit(1);
  }
}
console.log("\nnpm pack contents OK");

const prefix = fs.mkdtempSync(path.join(os.tmpdir(), "vinyaas-release-"));
const binDir = path.join(prefix, "bin");
fs.mkdirSync(binDir, { recursive: true });

try {
  run("npm", ["install", "-g", tarballPath, `--prefix=${prefix}`]);

  const binary = path.join(
    binDir,
    process.platform === "win32" ? "vinyaas.cmd" : "vinyaas",
  );
  if (!fs.existsSync(binary)) {
    console.error(`Global install missing binary at ${binary}`);
    process.exit(1);
  }

  run(binary, ["--version"]);
  run(binary, ["--help"]);

  const info = run(binary, ["info", "button"], { capture: true });
  const output = `${info.stdout || ""}${info.stderr || ""}`;
  console.log(output.trimEnd());

  if (!output.includes(PRODUCTION_DOCS)) {
    console.error(
      [
        "",
        `Expected docs URL ${PRODUCTION_DOCS} from \`vinyaas info button\`.`,
        "",
        "The CLI correctly embeds https://vinyaas.vercel.app/r, but the live",
        "registry item still returns localhost docs. Deploy the rebuilt",
        "apps/docs/public/r artifacts (docs site) before publishing the CLI:",
        "",
        "  1. pnpm cli:release-build",
        "  2. Deploy apps/docs (so /r/new-york/button.json is live)",
        "  3. pnpm cli:release-check",
        "  4. cd packages/cli && npm publish --access public",
      ].join("\n"),
    );
    process.exit(1);
  }
} finally {
  fs.rmSync(prefix, { recursive: true, force: true });
  fs.unlinkSync(tarballPath);
}

console.log("\ncli:release-check OK — ready for manual `npm publish --access public`");
