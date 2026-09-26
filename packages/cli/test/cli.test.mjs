import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const entrypoint = join(packageRoot, "dist/index.js");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8"),
);

function run(args) {
  return execFileAsync(process.execPath, [entrypoint, ...args], {
    cwd: packageRoot,
  }).then(
    (result) => ({
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: 0,
    }),
    (error) => ({
      stdout: typeof error.stdout === "string" ? error.stdout : "",
      stderr: typeof error.stderr === "string" ? error.stderr : "",
      exitCode: typeof error.code === "number" ? error.code : 1,
    }),
  );
}

describe("vinyas", () => {
  it("points the vinyas binary at the built entrypoint", () => {
    const source = readFileSync(entrypoint, "utf8");

    assert.equal(packageJson.name, "@vinyas/cli");
    assert.equal(packageJson.bin.vinyas, "./dist/index.js");
    assert.match(source, /^#!\/usr\/bin\/env node\n/);
  });

  it("prints the package version", async () => {
    const result = await run(["--version"]);

    assert.equal(result.exitCode, 0);
    assert.equal(result.stdout, `${packageJson.version}\n`);
  });

  it("prints help", async () => {
    const result = await run(["--help"]);

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /Usage: vinyas/);
    assert.match(result.stdout, /--version/);
    assert.match(result.stdout, /--help/);
    assert.match(result.stdout, /\binit\b/);
    assert.match(result.stdout, /\badd\b/);
  });

  it("shows --cwd on init and add", async () => {
    const init = await run(["init", "--help"]);
    const add = await run(["add", "--help"]);

    assert.equal(init.exitCode, 0);
    assert.match(init.stdout, /--cwd <path>/);
    assert.equal(add.exitCode, 0);
    assert.match(add.stdout, /--cwd <path>/);
  });

  it("fails for an unknown command", async () => {
    const result = await run(["nope"]);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /nope/);
  });

  it("fails for an unknown option", async () => {
    const result = await run(["--not-a-flag"]);

    assert.notEqual(result.exitCode, 0);
  });
});
