import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import { CliError } from "../src/lib/cli-error.ts";
import { resolveProjectRoot } from "../src/lib/project/cwd.ts";

describe("project root", () => {
  it("uses the process directory when --cwd is omitted", async () => {
    assert.equal(await resolveProjectRoot(), path.resolve(process.cwd()));
  });

  it("resolves --cwd . to the process directory", async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), "vinyas-cwd-"));

    assert.equal(await resolveProjectRoot(".", cwd), cwd);
  });

  it("resolves a relative directory from the process directory", async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), "vinyas-cwd-"));
    const project = path.join(cwd, "my-app");

    await mkdir(project);

    assert.equal(await resolveProjectRoot("./my-app", cwd), project);
    assert.equal(await resolveProjectRoot("nested/../my-app", cwd), project);
  });

  it("keeps an absolute directory absolute", async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), "vinyas-cwd-"));
    const project = await mkdtemp(path.join(tmpdir(), "vinyas-cwd-abs-"));

    assert.equal(await resolveProjectRoot(project, cwd), project);
  });

  it("fails when the directory does not exist", async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), "vinyas-cwd-"));

    await assert.rejects(
      () => resolveProjectRoot("./does-not-exist", cwd),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.equal(
          error.message,
          "Project directory does not exist:\n./does-not-exist",
        );
        return true;
      },
    );
  });

  it("fails when the path is a file", async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), "vinyas-cwd-"));

    await writeFile(path.join(cwd, "package.json"), "{}\n");

    await assert.rejects(
      () => resolveProjectRoot("package.json", cwd),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.equal(
          error.message,
          "Project path is not a directory:\npackage.json",
        );
        return true;
      },
    );
  });
});
