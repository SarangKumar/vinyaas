import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { CliError } from "../src/lib/cli-error.ts";
import {
  classifyDependencies,
  readDeclaredDependencies,
} from "../src/lib/dependencies/classify.ts";
import { planPackageDependencies } from "../src/lib/install-plan.ts";

function declared(sections = {}) {
  return {
    dependencies: new Set(sections.dependencies ?? []),
    devDependencies: new Set(sections.devDependencies ?? []),
    peerDependencies: new Set(sections.peerDependencies ?? []),
    optionalDependencies: new Set(sections.optionalDependencies ?? []),
  };
}

function classify(packages, sections) {
  return classifyDependencies(
    {
      dependencies: packages.dependencies ?? [],
      devDependencies: packages.devDependencies ?? [],
    },
    declared(sections),
  );
}

describe("declared dependency classification", () => {
  it("installs a missing runtime dependency", () => {
    const plan = classify({ dependencies: ["clsx"] }, {});

    assert.deepEqual(plan.installDependencies, ["clsx"]);
    assert.deepEqual(plan.present, []);
  });

  it("skips a runtime dependency already in dependencies", () => {
    const plan = classify(
      { dependencies: ["clsx"] },
      { dependencies: ["clsx"] },
    );

    assert.deepEqual(plan.installDependencies, []);
    assert.equal(plan.present[0].declared, "dependencies");
  });

  it("skips a runtime dependency already in devDependencies", () => {
    const plan = classify(
      { dependencies: ["clsx"] },
      { devDependencies: ["clsx"] },
    );

    assert.deepEqual(plan.installDependencies, []);
    assert.equal(plan.present[0].declared, "devDependencies");
  });

  it("skips a runtime dependency already in peerDependencies", () => {
    const plan = classify(
      { dependencies: ["clsx"] },
      { peerDependencies: ["clsx"] },
    );

    assert.deepEqual(plan.installDependencies, []);
    assert.equal(plan.present[0].declared, "peerDependencies");
  });

  it("skips a runtime dependency already in optionalDependencies", () => {
    const plan = classify(
      { dependencies: ["clsx"] },
      { optionalDependencies: ["clsx"] },
    );

    assert.deepEqual(plan.installDependencies, []);
    assert.equal(plan.present[0].declared, "optionalDependencies");
  });

  it("installs a missing dev dependency", () => {
    const plan = classify({ devDependencies: ["prettier"] }, {});

    assert.deepEqual(plan.installDevDependencies, ["prettier"]);
    assert.deepEqual(plan.present, []);
  });

  it("skips a dev dependency already in dependencies", () => {
    const plan = classify(
      { devDependencies: ["prettier"] },
      { dependencies: ["prettier"] },
    );

    assert.deepEqual(plan.installDevDependencies, []);
    assert.equal(plan.present[0].declared, "dependencies");
  });

  it("skips a dev dependency already in devDependencies", () => {
    const plan = classify(
      { devDependencies: ["prettier"] },
      { devDependencies: ["prettier"] },
    );

    assert.deepEqual(plan.installDevDependencies, []);
    assert.equal(plan.present[0].declared, "devDependencies");
  });

  it("skips a dev dependency already in peerDependencies", () => {
    const plan = classify(
      { devDependencies: ["prettier"] },
      { peerDependencies: ["prettier"] },
    );

    assert.deepEqual(plan.installDevDependencies, []);
    assert.equal(plan.present[0].declared, "peerDependencies");
  });

  it("skips a dev dependency already in optionalDependencies", () => {
    const plan = classify(
      { devDependencies: ["prettier"] },
      { optionalDependencies: ["prettier"] },
    );

    assert.deepEqual(plan.installDevDependencies, []);
    assert.equal(plan.present[0].declared, "optionalDependencies");
  });

  it("installs only the packages that are not declared", () => {
    const plan = classify(
      {
        dependencies: ["clsx", "tailwind-merge", "class-variance-authority"],
        devDependencies: ["prettier"],
      },
      {
        dependencies: ["clsx"],
        devDependencies: ["prettier"],
      },
    );

    assert.deepEqual(plan.installDependencies, [
      "tailwind-merge",
      "class-variance-authority",
    ]);
    assert.deepEqual(plan.installDevDependencies, []);
    assert.deepEqual(
      plan.present.map((pkg) => pkg.name),
      ["clsx", "prettier"],
    );
  });

  it("keeps duplicate registry packages deduplicated before classification", () => {
    const planned = planPackageDependencies([
      {
        name: "utils",
        dependencies: ["clsx"],
        devDependencies: ["prettier"],
      },
      {
        name: "button",
        dependencies: ["clsx", "tailwind-merge"],
        devDependencies: ["prettier"],
      },
    ]);
    const plan = classifyDependencies(planned, declared());

    assert.deepEqual(plan.installDependencies, ["clsx", "tailwind-merge"]);
    assert.deepEqual(plan.installDevDependencies, ["prettier"]);
  });
});

describe("package.json dependency declarations", () => {
  it("fails before use when package.json is invalid", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "vinyas-declared-"));

    await writeFile(join(cwd, "package.json"), "{");

    await assert.rejects(
      () => readDeclaredDependencies(cwd),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.equal(error.message, "Could not read package.json.");
        return true;
      },
    );
  });

  it("treats a missing package.json as having no declarations", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "vinyas-declared-"));
    const manifest = await readDeclaredDependencies(cwd);

    assert.equal(manifest.dependencies.size, 0);
  });
});
