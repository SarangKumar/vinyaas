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

describe("vinyaas", () => {
  it("points the vinyaas binary at the built entrypoint", () => {
    const source = readFileSync(entrypoint, "utf8");

    assert.equal(packageJson.name, "vinyaas");
    assert.equal(typeof packageJson.version, "string");
    assert.match(packageJson.version, /^\d+\.\d+\.\d+$/);
    assert.equal(packageJson.bin.vinyaas, "dist/index.js");
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
    assert.match(result.stdout, /Usage: vinyaas/);
    assert.match(result.stdout, /--version/);
    assert.match(result.stdout, /--help/);
    assert.match(result.stdout, /\binit\b/);
    assert.match(result.stdout, /\badd\b/);
    assert.match(result.stdout, /\blist\b/);
    assert.match(result.stdout, /\bsearch\b/);
    assert.match(result.stdout, /\binfo\b/);
    assert.match(result.stdout, /\bstatus\b/);
    assert.match(result.stdout, /\bdoctor\b/);
  });

  it("shows --cwd on init and add", async () => {
    const init = await run(["init", "--help"]);
    const add = await run(["add", "--help"]);
    const list = await run(["list", "--help"]);
    const search = await run(["search", "--help"]);
    const info = await run(["info", "--help"]);
    const status = await run(["status", "--help"]);
    const doctor = await run(["doctor", "--help"]);

    assert.equal(init.exitCode, 0);
    assert.match(init.stdout, /--cwd <path>/);
    assert.equal(add.exitCode, 0);
    assert.match(add.stdout, /--cwd <path>/);
    assert.match(add.stdout, /--force/);
    assert.match(add.stdout, /--dry-run/);
    assert.match(add.stdout, /--category/);
    assert.match(list.stdout, /--category/);
    assert.match(search.stdout, /--category/);
    assert.match(add.stdout, /overwrite existing component files/i);
    assert.match(add.stdout, /\[name\.\.\.\]/);
    assert.match(add.stdout, /vinyaas add button card/);
    assert.match(add.stdout, /vinyaas add button --yes/);
    assert.match(add.stdout, /vinyaas add --category forms/);
    assert.match(add.stdout, /already-installed/i);
    assert.equal(list.exitCode, 0);
    assert.match(list.stdout, /--json/);
    assert.equal(search.exitCode, 0);
    assert.match(search.stdout, /<query>/);
    assert.match(search.stdout, /--json/);
    assert.equal(info.exitCode, 0);
    assert.match(info.stdout, /<component>/);
    assert.match(info.stdout, /--json/);
    assert.equal(status.exitCode, 0);
    assert.match(status.stdout, /--json/);
    assert.match(status.stdout, /--cwd <path>/);
    assert.match(status.stdout, /tracks installed components/i);
    assert.equal(doctor.exitCode, 0);
    assert.match(doctor.stdout, /--json/);
    assert.match(doctor.stdout, /--cwd <path>/);
  });

  it("rejects --force on init", async () => {
    const result = await run(["init", "--force"]);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /unknown option/i);
    assert.match(result.stderr, /--force/);
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
