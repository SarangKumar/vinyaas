import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";

import { CliError } from "../src/lib/cli-error.ts";
import { applyCss } from "../src/lib/css/apply.ts";
import {
  collectCss,
  createCssUpdate,
  resolveCssPath,
} from "../src/lib/css/plan.ts";

const source = '@import "tailwindcss";\n';

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

describe("css target", () => {
  it("resolves a project-relative stylesheet", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "vinyas-css-"));

    assert.equal(
      resolveCssPath(cwd, "app/globals.css"),
      join(cwd, "app/globals.css"),
    );
  });

  it("rejects absolute css paths", () => {
    assert.throws(
      () => resolveCssPath("/tmp/project", "/etc/passwd"),
      /Configured CSS path must stay inside the project/,
    );
  });

  it("rejects css paths that leave the project", () => {
    assert.throws(
      () => resolveCssPath("/tmp/project", "../outside.css"),
      /Configured CSS path must stay inside the project/,
    );
    assert.throws(
      () => resolveCssPath("/tmp/project", "app/../../outside.css"),
      /Configured CSS path must stay inside the project/,
    );
  });

  it("fails when the configured css file does not exist", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "vinyas-css-"));

    await assert.rejects(
      () =>
        createCssUpdate({
          cwd,
          cssPath: "app/globals.css",
          items: [registryItem("button")],
        }),
      /Configured CSS file does not exist:\napp\/globals\.css/,
    );
  });
});

describe("css variables", () => {
  it("adds a light variable", () => {
    const next = applyCss(
      source,
      [{ scope: "light", name: "--primary", value: "222.2 47.4% 11.2%" }],
      [],
    );

    assert.match(next, /:root\s*\{[^}]*--primary:\s*222\.2 47\.4% 11\.2%;/);
    assert.doesNotMatch(next, /prefers-color-scheme/);
  });

  it("adds a dark variable", () => {
    const next = applyCss(
      source,
      [{ scope: "dark", name: "--primary", value: "210 40% 98%" }],
      [],
    );

    assert.match(next, /@media \(prefers-color-scheme: dark\)/);
    assert.match(next, /--primary:\s*210 40% 98%;/);
  });

  it("does not duplicate an identical variable", () => {
    const existing = `${source}\n:root {\n  --primary: 222.2 47.4% 11.2%;\n}\n`;

    assert.equal(
      applyCss(
        existing,
        [{ scope: "light", name: "--primary", value: "222.2 47.4% 11.2%" }],
        [],
      ),
      existing,
    );
  });

  it("fails when an existing variable has a different value", () => {
    const existing = `${source}\n:root {\n  --primary: existing-value;\n}\n`;

    assert.throws(
      () =>
        applyCss(
          existing,
          [{ scope: "light", name: "--primary", value: "registry-value" }],
          [],
        ),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.equal(
          error.message,
          "CSS variable conflict:\n--primary already exists with a different value.",
        );
        return true;
      },
    );
  });

  it("deduplicates identical variables from multiple items", () => {
    const collected = collectCss([
      registryItem("utils", {
        cssVars: { light: { "--foo": "bar" } },
      }),
      registryItem("button", {
        cssVars: { light: { "--foo": "bar" } },
      }),
    ]);

    assert.deepEqual(collected.variables, [
      { scope: "light", name: "--foo", value: "bar" },
    ]);
  });

  it("fails when registry items disagree on a variable", () => {
    assert.throws(
      () =>
        collectCss([
          registryItem("utils", { cssVars: { light: { "--foo": "bar" } } }),
          registryItem("button", { cssVars: { light: { "--foo": "baz" } } }),
        ]),
      /Registry CSS variable conflict:\n--foo is declared with different values/,
    );
  });

  it("omits a mode that the registry item does not declare", () => {
    const collected = collectCss([
      registryItem("button", {
        cssVars: { dark: { "--primary": "210 40% 98%" } },
      }),
    ]);

    assert.deepEqual(collected.variables, [
      { scope: "dark", name: "--primary", value: "210 40% 98%" },
    ]);
  });
});

describe("css rules", () => {
  it("generates a rule from the registry selector and declaration", () => {
    const next = applyCss(
      source,
      [],
      [{ selector: ".button", body: "color: red" }],
    );

    assert.match(next, /\.button \{\n {2}color: red;\n\}/);
  });

  it("does not duplicate an identical rule", () => {
    const existing = `${source}\n.button {\n  color: red;\n}\n`;

    assert.equal(
      applyCss(existing, [], [{ selector: ".button", body: "color: red;" }]),
      existing,
    );
  });

  it("fails when an existing rule has a different body", () => {
    const existing = `${source}\n.button {\n  color: blue;\n}\n`;

    assert.throws(
      () =>
        applyCss(existing, [], [{ selector: ".button", body: "color: red;" }]),
      /CSS rule conflict:\n\.button already exists with a different value/,
    );
  });

  it("collects rules from the registry graph in order", () => {
    const collected = collectCss([
      registryItem("utils", { css: { ".utils": "color: black;" } }),
      registryItem("button", {
        css: { ".button": "color: red;", ".utils": "color: black;" },
      }),
    ]);

    assert.deepEqual(collected.rules, [
      { selector: ".utils", body: "color: black" },
      { selector: ".button", body: "color: red" },
    ]);
  });
});

describe("css update", () => {
  it("keeps an identical stylesheet unchanged", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "vinyas-css-"));
    await mkdir(dirname(join(cwd, "app/globals.css")), { recursive: true });
    await writeFile(
      join(cwd, "app/globals.css"),
      `${source}\n:root {\n  --primary: 222.2 47.4% 11.2%;\n}\n`,
    );

    const update = await createCssUpdate({
      cwd,
      cssPath: "app/globals.css",
      items: [
        registryItem("button", {
          cssVars: { light: { "--primary": "222.2 47.4% 11.2%" } },
        }),
      ],
    });

    assert.equal(update.changed, false);
    assert.equal(update.next, update.previous);
  });
});
