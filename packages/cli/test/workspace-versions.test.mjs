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
  it("keeps the monorepo packages on 1.0.0 for the first stable release", () => {
    const root = readPackage("package.json");
    const cli = readPackage("packages/cli/package.json");
    const docs = readPackage("apps/docs/package.json");

    assert.equal(root.name, "vinyaas-monorepo");
    assert.equal(root.private, true);
    assert.equal(root.version, "1.0.0");

    assert.equal(cli.name, "vinyaas");
    assert.equal(cli.version, "1.0.0");
    assert.equal(cli.bin.vinyaas, "./dist/index.js");
    assert.equal(cli.publishConfig?.access, "public");

    assert.equal(docs.name, "docs");
    assert.equal(docs.private, true);
    assert.equal(docs.version, "1.0.0");
  });
});
