import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";

import { runAdd } from "../src/commands/add.ts";
import {
  assertDestinationsAvailable,
  createInstallPlan,
  writeInstallPlan,
} from "../src/lib/install-plan.ts";

const buttonContent = "export function Button() { return null; }\n";
const cssContent = '@import "tailwindcss";\n';

const config = {
  $schema: "https://example.com/schema/components.json",
  style: "new-york",
  tsx: true,
  tailwind: {
    css: "app/globals.css",
    baseColor: "neutral",
    cssVariables: true,
  },
  aliases: {
    components: "@/components",
    ui: "@/components/ui",
    utils: "@/lib/utils",
  },
};

const aliasConfig = `{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
`;

function item(name, extra = {}) {
  return {
    $schema: "https://example.com/schema/registry-item.json",
    name,
    type: "registry:ui",
    dependencies: [],
    files: [{ path: "ui/button/index.tsx", content: buttonContent }],
    ...extra,
  };
}

async function writeFiles(root, files) {
  await Promise.all(
    Object.entries(files).map(async ([relativePath, contents]) => {
      const filePath = join(root, relativePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, contents);
    }),
  );
}

async function project(extra = {}) {
  const cwd = await mkdtemp(join(tmpdir(), "vinyaas-force-"));

  await writeFiles(cwd, {
    "components.json": `${JSON.stringify(config, null, 2)}\n`,
    "tsconfig.json": aliasConfig,
    "package.json": `${JSON.stringify({ name: "consumer" })}\n`,
    "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    "app/globals.css": cssContent,
    ...extra,
  });

  return cwd;
}

async function planFor(cwd, files) {
  return createInstallPlan({
    cwd,
    config,
    name: "button",
    items: [item("button", { files })],
  });
}

describe("force file replacement", () => {
  it("fails when a destination exists and force is omitted", async () => {
    const cwd = await project({
      "components/ui/button/index.tsx": "// local modification\n",
    });
    const plan = await planFor(cwd, [
      { path: "ui/button/index.tsx", content: buttonContent },
    ]);

    await assert.rejects(
      () => assertDestinationsAvailable(cwd, plan, false),
      /File already exists:\ncomponents\/ui\/button\/index\.tsx/,
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      "// local modification\n",
    );
  });

  it("replaces an existing file when force is set", async () => {
    const cwd = await project({
      "components/ui/button/index.tsx": "// local modification\n",
    });
    const plan = await planFor(cwd, [
      { path: "ui/button/index.tsx", content: buttonContent },
    ]);

    await assertDestinationsAvailable(cwd, plan, true);
    await writeInstallPlan(cwd, plan);

    assert.equal(plan.entries[0].overwrite, true);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("creates a new file when force is set", async () => {
    const cwd = await project();
    const plan = await planFor(cwd, [
      { path: "ui/button/index.tsx", content: buttonContent },
    ]);

    await assertDestinationsAvailable(cwd, plan, true);
    await writeInstallPlan(cwd, plan);

    assert.equal(plan.entries[0].overwrite, false);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("replaces every existing file in the graph when force is set", async () => {
    const cwd = await project({
      "components/ui/utils.ts": "// utils local\n",
      "components/ui/button/index.tsx": "// button local\n",
    });
    const plan = await createInstallPlan({
      cwd,
      config,
      name: "button",
      items: [
        item("utils", {
          files: [
            { path: "ui/utils.ts", content: "export const cn = true;\n" },
          ],
        }),
        item("button", {
          files: [{ path: "ui/button/index.tsx", content: buttonContent }],
        }),
      ],
    });

    await assertDestinationsAvailable(cwd, plan, true);
    await writeInstallPlan(cwd, plan);

    assert.equal(
      await readFile(join(cwd, "components/ui/utils.ts"), "utf8"),
      "export const cn = true;\n",
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("replaces an existing file and creates a missing file", async () => {
    const cwd = await project({
      "components/ui/utils.ts": "// utils local\n",
    });
    const plan = await createInstallPlan({
      cwd,
      config,
      name: "button",
      items: [
        item("utils", {
          files: [
            { path: "ui/utils.ts", content: "export const cn = true;\n" },
          ],
        }),
        item("button", {
          files: [{ path: "ui/button/index.tsx", content: buttonContent }],
        }),
      ],
    });

    await assertDestinationsAvailable(cwd, plan, true);
    await writeInstallPlan(cwd, plan);

    assert.equal(
      await readFile(join(cwd, "components/ui/utils.ts"), "utf8"),
      "export const cn = true;\n",
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("still rejects paths that leave the project when force is set", async () => {
    const cwd = await project();

    for (const registryPath of [
      "/tmp/evil.tsx",
      "ui/../../outside.ts",
      "ui/foo/../../../outside.ts",
    ]) {
      await assert.rejects(
        () =>
          runAdd({
            cwd,
            name: "button",
            force: true,
            env: { REGISTRY_BASE_URL: "http://localhost:3000" },
            fetch: async () => ({
              ok: true,
              status: 200,
              json: async () =>
                item("button", {
                  files: [{ path: registryPath, content: "nope\n" }],
                }),
            }),
            runPackageManager: async () => {
              throw new Error("package manager should not run");
            },
          }),
        /stay inside the project/,
      );
    }

    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("still rejects an alias outside the project when force is set", async () => {
    const cwd = await project({
      "tsconfig.json": `{
        "compilerOptions": {
          "paths": { "@/*": ["../outside/*"] }
        }
      }
      `,
    });

    await assert.rejects(
      () =>
        runAdd({
          cwd,
          name: "button",
          force: true,
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: async () => ({
            ok: true,
            status: 200,
            json: async () => item("button"),
          }),
        }),
      /Could not safely map/,
    );
  });

  it("still rejects a css conflict when force is set", async () => {
    const existing = `${cssContent}\n:root {\n  --primary: existing-value;\n}\n`;
    const cwd = await project({ "app/globals.css": existing });
    const calls = [];

    await assert.rejects(
      () =>
        runAdd({
          cwd,
          name: "button",
          force: true,
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: async () => ({
            ok: true,
            status: 200,
            json: async () =>
              item("button", {
                dependencies: ["clsx"],
                cssVars: { light: { "--primary": "registry-value" } },
              }),
          }),
          runPackageManager: async () => {
            calls.push(true);
          },
        }),
      /CSS variable conflict:\n--primary already exists with a different value/,
    );
    assert.equal(calls.length, 0);
    assert.equal(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      existing,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("still rejects a dependency type conflict when force is set", async () => {
    const cwd = await project();
    const calls = [];

    await assert.rejects(
      () =>
        runAdd({
          cwd,
          name: "button",
          force: true,
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: async (url) => {
            const name = String(url)
              .split("/")
              .pop()
              .replace(/\.json$/, "");
            const payload =
              name === "utils"
                ? item("utils", {
                    files: [{ path: "ui/utils.ts", content: "export {};\n" }],
                    devDependencies: ["foo"],
                  })
                : item("button", {
                    dependencies: ["foo"],
                    registryDependencies: ["utils"],
                  });

            return { ok: true, status: 200, json: async () => payload };
          },
          runPackageManager: async () => {
            calls.push(true);
          },
        }),
      /Dependency type conflict:\nfoo is declared as both a dependency and a devDependency/,
    );
    assert.equal(calls.length, 0);
    await assert.rejects(readFile(join(cwd, "components/ui/utils.ts"), "utf8"));
  });

  it("still rejects an invalid documentation url when force is set", async () => {
    const cwd = await project();

    await assert.rejects(
      () =>
        runAdd({
          cwd,
          name: "button",
          force: true,
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: async () => ({
            ok: true,
            status: 200,
            json: async () => item("button", { docs: "javascript:alert(1)" }),
          }),
        }),
      /Invalid documentation URL:/,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("still rejects a registry cycle when force is set", async () => {
    const cwd = await project();

    await assert.rejects(
      () =>
        runAdd({
          cwd,
          name: "button",
          force: true,
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: async (url) => {
            const name = String(url)
              .split("/")
              .pop()
              .replace(/\.json$/, "");
            const payload =
              name === "utils"
                ? item("utils", {
                    files: [{ path: "ui/utils.ts", content: "export {};\n" }],
                    registryDependencies: ["button"],
                  })
                : item("button", { registryDependencies: ["utils"] });

            return { ok: true, status: 200, json: async () => payload };
          },
        }),
      /Registry dependency cycle detected:\nbutton -> utils -> button/,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });
});
