import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(packageRoot, "../..");

function readPackage(relativePath) {
  return JSON.parse(readFileSync(join(repoRoot, relativePath), "utf8"));
}

describe("workspace package versions", () => {
  it("versions CLI and docs independently for the v1.1.0 release", () => {
    const root = readPackage("package.json");
    const cli = readPackage("packages/cli/package.json");
    const docs = readPackage("apps/docs/package.json");

    // Workspace root stays private; version tracks the site/CLI release line.
    assert.equal(root.name, "vinyaas-monorepo");
    assert.equal(root.private, true);
    assert.equal(root.version, "1.1.0");

    // Published CLI package for this release.
    assert.equal(cli.name, "vinyaas");
    assert.equal(cli.version, "1.1.0");
    assert.equal(cli.bin.vinyaas, "dist/index.js");
    assert.equal(cli.publishConfig?.access, "public");
    assert.match(cli.description, /registry-driven React component/i);
    assert.ok(cli.keywords.includes("tailwind-v4"));
    assert.ok(cli.keywords.includes("shadcn"));
    assert.ok(cli.keywords.includes("react-components"));
    assert.equal(cli.homepage, "https://vinyaas.vercel.app");

    // Docs/website ships with the same release line; remains private.
    assert.equal(docs.name, "docs");
    assert.equal(docs.private, true);
    assert.equal(docs.version, "1.1.0");
  });
});
