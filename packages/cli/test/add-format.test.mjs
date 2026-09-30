import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { executeAdd } from "../src/commands/add.ts";
import {
  formatAddSummary,
  formatDryRunSummary,
} from "../src/lib/add/format.ts";

function captureLogs(run) {
  const logs = [];
  const originalLog = console.log;

  console.log = (...args) => {
    logs.push(args.join(" "));
  };

  return Promise.resolve()
    .then(run)
    .then((value) => ({ value, stdout: logs.join("\n") }))
    .finally(() => {
      console.log = originalLog;
    });
}

const buttonItem = {
  $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
  name: "button",
  type: "registry:ui",
  category: "forms",
  description: "A button.",
  dependencies: ["clsx", "tailwind-merge"],
  files: [
    {
      path: "ui/button/index.tsx",
      content: "export function Button() { return null; }\n",
      type: "registry:ui",
    },
  ],
  docs: "https://vinyaas.vercel.app/components/button",
};

const cardItem = {
  $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
  name: "card",
  type: "registry:ui",
  category: "layout",
  description: "A card.",
  dependencies: ["clsx"],
  files: [
    {
      path: "ui/card/index.tsx",
      content: "export function Card() { return null; }\n",
      type: "registry:ui",
    },
  ],
  docs: "https://vinyaas.vercel.app/components/card",
};

function catalogFetch(items = { button: buttonItem, card: cardItem }) {
  return async (url) => {
    const href = String(url);

    if (href.endsWith("/index.json")) {
      return new Response(
        JSON.stringify({
          style: "new-york",
          items: Object.values(items).map((item) => ({
            name: item.name,
            type: item.type,
            category: item.category,
            description: item.description,
            docs: item.docs,
          })),
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }

    for (const item of Object.values(items)) {
      if (href.endsWith(`/${item.name}.json`)) {
        return new Response(JSON.stringify(item), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
    }

    return new Response("not found", { status: 404 });
  };
}

async function writeProject(extra = {}) {
  const root = await mkdtemp(join(tmpdir(), "vinyaas-add-format-"));
  await writeFile(
    join(root, "package.json"),
    JSON.stringify(
      {
        name: "fixture",
        dependencies: { react: "^19.0.0", "react-dom": "^19.0.0" },
        devDependencies: { tailwindcss: "^4.0.0" },
      },
      null,
      2,
    ),
  );
  await writeFile(join(root, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
  await writeFile(
    join(root, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          baseUrl: ".",
          paths: { "@/*": ["./*"] },
        },
      },
      null,
      2,
    ),
  );
  await writeFile(
    join(root, "components.json"),
    JSON.stringify(
      {
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
      },
      null,
      2,
    ),
  );
  await mkdir(join(root, "app"), { recursive: true });
  await writeFile(join(root, "app/globals.css"), '@import "tailwindcss";\n');
  await mkdir(join(root, "lib"), { recursive: true });
  await writeFile(join(root, "lib/utils.ts"), "export function cn() {}\n");

  for (const [relative, content] of Object.entries(extra)) {
    const absolute = join(root, relative);
    await mkdir(join(absolute, ".."), { recursive: true });
    await writeFile(absolute, content);
  }

  return root;
}

describe("add output formatting", () => {
  it("summarizes a single install", () => {
    const output = formatAddSummary({
      plan: {
        name: "button",
        entries: [
          {
            itemName: "button",
            registryPath: "ui/button/index.tsx",
            destinationPath: "components/ui/button/index.tsx",
            content: "",
            overwrite: false,
          },
        ],
        dependencies: ["clsx"],
        devDependencies: [],
        items: ["button"],
        skipped: [],
        failed: [],
      },
      dependencyInstall: {
        installDependencies: ["clsx"],
        installDevDependencies: [],
        present: [],
      },
      requested: ["button"],
      registryDependencies: [],
    });

    assert.match(output, /^✓ Added components/);
    assert.match(output, /Installed\n✓ button/);
    assert.match(output, /Files\n✓ components\/ui\/button\/index\.tsx/);
    assert.match(output, /Dependencies\n✓ clsx/);
    assert.match(output, /Registry dependencies\nnone/);
    assert.match(output, /Import components from:\n@\/components\/ui\/\*/);
  });

  it("formats skipped components with a force hint", () => {
    const output = formatAddSummary({
      plan: {
        name: "button",
        entries: [],
        dependencies: [],
        devDependencies: [],
        items: [],
        skipped: ["button"],
        failed: [],
      },
      dependencyInstall: {
        installDependencies: [],
        installDevDependencies: [],
        present: [],
      },
      requested: ["button"],
      registryDependencies: [],
    });

    assert.match(output, /Skipped\n• button \(already exists\)/);
    assert.match(output, /Use --force to overwrite\./);
    assert.doesNotMatch(output, /✓ Added components/);
  });

  it("formats a dry-run plan", () => {
    const output = formatDryRunSummary({
      plan: {
        name: "button",
        entries: [
          {
            itemName: "button",
            registryPath: "ui/button/index.tsx",
            destinationPath: "components/ui/button/index.tsx",
            content: "",
            overwrite: false,
          },
          {
            itemName: "card",
            registryPath: "ui/card/index.tsx",
            destinationPath: "components/ui/card/index.tsx",
            content: "",
            overwrite: false,
          },
        ],
        dependencies: ["clsx", "tailwind-merge"],
        devDependencies: [],
        items: ["button", "card"],
        skipped: [],
        failed: [],
      },
      dependencyInstall: {
        installDependencies: ["clsx", "tailwind-merge"],
        installDevDependencies: [],
        present: [],
      },
      requested: ["button", "card"],
      registryDependencies: [],
    });

    assert.match(output, /^Vinyaas dry run/);
    assert.match(output, /Would install:/);
    assert.match(output, /Components\n✓ button\n✓ card/);
    assert.match(output, /Files\ncomponents\/ui\/button\/index\.tsx/);
    assert.match(output, /No changes made\./);
  });
});

describe("vinyaas add --dry-run", () => {
  it("resolves the plan without writing files or installing packages", async () => {
    const cwd = await writeProject();
    const packageBefore = await readFile(join(cwd, "package.json"), "utf8");
    const cssBefore = await readFile(join(cwd, "app/globals.css"), "utf8");
    const calls = [];

    const { stdout, value } = await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button", "card"],
        cwd,
        dryRun: true,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        runPackageManager: async (options) => {
          calls.push(options);
        },
      }),
    );

    assert.match(stdout, /Vinyaas dry run/);
    assert.match(stdout, /✓ button/);
    assert.match(stdout, /✓ card/);
    assert.match(stdout, /No changes made\./);
    assert.deepEqual(value.items.sort(), ["button", "card"]);
    assert.equal(calls.length, 0);
    assert.equal(await readFile(join(cwd, "package.json"), "utf8"), packageBefore);
    assert.equal(await readFile(join(cwd, "app/globals.css"), "utf8"), cssBefore);
    await assert.rejects(() => access(join(cwd, "components/ui/button/index.tsx")));
    await assert.rejects(() => access(join(cwd, "components/ui/card/index.tsx")));
  });

  it("reports already-installed components without mutating them", async () => {
    const cwd = await writeProject({
      "components/ui/button/index.tsx": "export const existing = true;\n",
    });

    const { stdout, value } = await captureLogs(() =>
      executeAdd({
        name: "button",
        cwd,
        dryRun: true,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(stdout, /Skipped\n• button \(already exists\)/);
    assert.match(stdout, /No changes made\./);
    assert.deepEqual(value.skipped, ["button"]);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      "export const existing = true;\n",
    );
  });
});
