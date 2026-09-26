import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CliError } from "../src/lib/cli-error.ts";
import { createDocsPlan, formatDocsPlan } from "../src/lib/docs/plan.ts";

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

describe("documentation planning", () => {
  it("omits an item without docs", () => {
    const plan = createDocsPlan([registryItem("button")]);

    assert.deepEqual(plan.entries, []);
    assert.equal(formatDocsPlan(plan), undefined);
  });

  it("reports one documentation url", () => {
    const plan = createDocsPlan([
      registryItem("button", {
        docs: "https://vinyas.vercel.app/docs/components/button",
      }),
    ]);

    assert.deepEqual(plan.entries, [
      {
        name: "button",
        url: "https://vinyas.vercel.app/docs/components/button",
      },
    ]);
    assert.equal(
      formatDocsPlan(plan),
      [
        "Documentation:",
        "",
        "  button — https://vinyas.vercel.app/docs/components/button",
      ].join("\n"),
    );
  });

  it("preserves dependency-first order and skips undocumented items", () => {
    const plan = createDocsPlan([
      registryItem("shared", {
        docs: "https://example.com/shared",
      }),
      registryItem("utils", {
        docs: "https://example.com/utils",
      }),
      registryItem("icon"),
      registryItem("button", {
        docs: "https://example.com/button",
      }),
    ]);

    assert.deepEqual(
      plan.entries.map((entry) => entry.name),
      ["shared", "utils", "button"],
    );
  });

  it("reports a shared dependency once", () => {
    const plan = createDocsPlan([
      registryItem("utils", { docs: "https://example.com/utils" }),
      registryItem("icon", { docs: "https://example.com/icon" }),
      registryItem("utils", { docs: "https://example.com/utils" }),
      registryItem("button", { docs: "https://example.com/button" }),
    ]);

    assert.deepEqual(
      plan.entries.map((entry) => entry.name),
      ["utils", "icon", "button"],
    );
  });

  it("reports different items that share one url", () => {
    const plan = createDocsPlan([
      registryItem("button", { docs: "https://example.com/shared" }),
      registryItem("icon", { docs: "https://example.com/shared" }),
    ]);

    assert.deepEqual(plan.entries, [
      { name: "button", url: "https://example.com/shared" },
      { name: "icon", url: "https://example.com/shared" },
    ]);
  });

  it("accepts https and http urls", () => {
    const plan = createDocsPlan([
      registryItem("button", {
        docs: "https://vinyas.vercel.app/docs/button",
      }),
      registryItem("card", {
        docs: "http://localhost:3000/docs/button",
      }),
    ]);

    assert.deepEqual(
      plan.entries.map((entry) => entry.url),
      [
        "https://vinyas.vercel.app/docs/button",
        "http://localhost:3000/docs/button",
      ],
    );
  });

  for (const docs of [
    "/docs/button",
    "button.md",
    "@/docs/button",
    "javascript:alert(1)",
    "ftp://example.com/docs",
  ]) {
    it(`rejects ${docs}`, () => {
      assert.throws(
        () => createDocsPlan([registryItem("button", { docs })]),
        (error) => {
          assert.ok(error instanceof CliError);
          assert.match(error.message, /Invalid documentation URL:/);
          assert.match(
            error.message,
            /Documentation URLs must be absolute http or https URLs/,
          );
          return true;
        },
      );
    });
  }
});
