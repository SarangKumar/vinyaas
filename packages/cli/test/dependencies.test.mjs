import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CliError } from "../src/lib/cli-error.ts";
import { planPackageDependencies } from "../src/lib/install-plan.ts";

function registryItem(name, extra = {}) {
  return {
    $schema: "https://example.com/schema/registry-item.json",
    name,
    type: "registry:ui",
    dependencies: [],
    files: [],
    ...extra,
  };
}

describe("package dependency planning", () => {
  it("plans no development dependencies when none are declared", () => {
    assert.deepEqual(
      planPackageDependencies([
        registryItem("button", { dependencies: ["clsx"] }),
      ]),
      { dependencies: ["clsx"], devDependencies: [] },
    );
  });

  it("plans one development dependency", () => {
    assert.deepEqual(
      planPackageDependencies([
        registryItem("button", { devDependencies: ["prettier"] }),
      ]),
      { dependencies: [], devDependencies: ["prettier"] },
    );
  });

  it("keeps multiple development dependencies in declaration order", () => {
    assert.deepEqual(
      planPackageDependencies([
        registryItem("testing", {
          devDependencies: ["vitest", "prettier"],
        }),
      ]),
      { dependencies: [], devDependencies: ["vitest", "prettier"] },
    );
  });

  it("deduplicates a development dependency declared by several items", () => {
    assert.deepEqual(
      planPackageDependencies([
        registryItem("utils", { devDependencies: ["prettier"] }),
        registryItem("button", { devDependencies: ["prettier"] }),
      ]),
      { dependencies: [], devDependencies: ["prettier"] },
    );
  });

  it("orders packages from the dependency-first graph", () => {
    assert.deepEqual(
      planPackageDependencies([
        registryItem("testing", {
          devDependencies: ["vitest", "prettier"],
        }),
        registryItem("utils", { devDependencies: ["prettier"] }),
        registryItem("icon"),
        registryItem("button", { dependencies: ["clsx"] }),
      ]),
      {
        dependencies: ["clsx"],
        devDependencies: ["vitest", "prettier"],
      },
    );
  });

  it("fails when one package is both a dependency and a devDependency", () => {
    assert.throws(
      () =>
        planPackageDependencies([
          registryItem("utils", { devDependencies: ["foo"] }),
          registryItem("button", { dependencies: ["foo"] }),
        ]),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.equal(
          error.message,
          "Dependency type conflict:\nfoo is declared as both a dependency and a devDependency.",
        );
        return true;
      },
    );
  });
});
