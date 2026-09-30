import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { executeAdd } from "../src/commands/add.ts";
import { executeList } from "../src/commands/list.ts";
import { executeSearch } from "../src/commands/search.ts";
import { CliError } from "../src/lib/cli-error.ts";
import {
  filterItemsByCategory,
  formatUnknownCategoryMessage,
  requireRegistryCategory,
} from "../src/lib/registry/categories.ts";

function captureLogs(run) {
  const logs = [];
  const warns = [];
  const originalLog = console.log;
  const originalWarn = console.warn;

  console.log = (...args) => {
    logs.push(args.join(" "));
  };
  console.warn = (...args) => {
    warns.push(args.join(" "));
  };

  return Promise.resolve()
    .then(run)
    .then((value) => ({
      value,
      stdout: logs.join("\n"),
      stderr: warns.join("\n"),
    }))
    .finally(() => {
      console.log = originalLog;
      console.warn = originalWarn;
    });
}

const catalogItems = [
  {
    name: "badge",
    type: "registry:ui",
    category: "data-display",
    description: "A compact label for status or category.",
    docs: "https://vinyaas.vercel.app/components/badge",
  },
  {
    name: "button",
    type: "registry:ui",
    category: "forms",
    description: "A composable button component with variants and sizes.",
    docs: "https://vinyaas.vercel.app/components/button",
  },
  {
    name: "input",
    type: "registry:ui",
    category: "forms",
    description: "A text field that passes through native input attributes.",
    docs: "https://vinyaas.vercel.app/components/input",
  },
  {
    name: "card",
    type: "registry:ui",
    category: "layout",
    description: "A bordered container for related content.",
    docs: "https://vinyaas.vercel.app/components/card",
  },
];

const registryItems = {
  button: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "button",
    type: "registry:ui",
    category: "forms",
    description: "A composable button component with variants and sizes.",
    dependencies: ["clsx"],
    files: [
      {
        path: "ui/button/index.tsx",
        content: "export function Button() { return null; }\n",
        type: "registry:ui",
      },
    ],
    docs: "https://vinyaas.vercel.app/components/button",
  },
  input: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "input",
    type: "registry:ui",
    category: "forms",
    description: "A text field that passes through native input attributes.",
    dependencies: ["clsx"],
    files: [
      {
        path: "ui/input/index.tsx",
        content: "export function Input() { return null; }\n",
        type: "registry:ui",
      },
    ],
    docs: "https://vinyaas.vercel.app/components/input",
  },
  card: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "card",
    type: "registry:ui",
    category: "layout",
    description: "A bordered container for related content.",
    dependencies: ["clsx"],
    files: [
      {
        path: "ui/card/index.tsx",
        content: "export function Card() { return null; }\n",
        type: "registry:ui",
      },
    ],
    docs: "https://vinyaas.vercel.app/components/card",
  },
  badge: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "badge",
    type: "registry:ui",
    category: "data-display",
    description: "A compact label for status or category.",
    dependencies: ["clsx"],
    files: [
      {
        path: "ui/badge/index.tsx",
        content: "export function Badge() { return null; }\n",
        type: "registry:ui",
      },
    ],
    docs: "https://vinyaas.vercel.app/components/badge",
  },
};

function catalogFetch() {
  return async (url) => {
    const href = String(url);

    if (href.endsWith("/index.json")) {
      return new Response(
        JSON.stringify({ style: "new-york", items: catalogItems }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }

    for (const item of Object.values(registryItems)) {
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

async function writeProject() {
  const root = await mkdtemp(join(tmpdir(), "vinyaas-category-"));
  await writeFile(
    join(root, "package.json"),
    JSON.stringify(
      {
        name: "fixture",
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          clsx: "^2.0.0",
        },
        devDependencies: { tailwindcss: "^4.0.0" },
      },
      null,
      2,
    ),
  );
  await writeFile(join(root, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
  await writeFile(
    join(root, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./*"] } },
    }),
  );
  await writeFile(
    join(root, "components.json"),
    JSON.stringify({
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
    }),
  );
  await mkdir(join(root, "app"), { recursive: true });
  await writeFile(join(root, "app/globals.css"), '@import "tailwindcss";\n');
  await mkdir(join(root, "lib"), { recursive: true });
  await writeFile(join(root, "lib/utils.ts"), "export function cn() {}\n");
  return root;
}

describe("category helpers", () => {
  it("validates known categories and filters catalog items", () => {
    assert.equal(requireRegistryCategory("forms"), "forms");
    assert.deepEqual(
      filterItemsByCategory(catalogItems, "forms").map((item) => item.name),
      ["button", "input"],
    );
    assert.throws(
      () => requireRegistryCategory("unknown"),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /Unknown category: unknown/);
        assert.match(error.message, /forms/);
        return true;
      },
    );
    assert.match(formatUnknownCategoryMessage("x"), /Available categories:/);
  });
});

describe("vinyaas list --category", () => {
  it("filters human and JSON output", async () => {
    const human = await captureLogs(() =>
      executeList({
        category: "forms",
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(human.stdout, /^Forms\n/);
    assert.match(human.stdout, /✓ button/);
    assert.match(human.stdout, /✓ input/);
    assert.doesNotMatch(human.stdout, /card/);

    const json = await captureLogs(() =>
      executeList({
        json: true,
        category: "forms",
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );
    const parsed = JSON.parse(json.stdout);

    assert.equal(parsed.length, 2);
    assert.ok(parsed.every((item) => item.category === "forms"));
  });

  it("rejects unknown categories", async () => {
    await assert.rejects(
      () =>
        executeList({
          category: "unknown",
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: catalogFetch(),
        }),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /Unknown category: unknown/);
        return true;
      },
    );
  });
});

describe("vinyaas search --category", () => {
  it("searches within a category", async () => {
    const { stdout } = await captureLogs(() =>
      executeSearch({
        query: "a",
        category: "forms",
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(stdout, /button/);
    assert.doesNotMatch(stdout, /card/);
    assert.doesNotMatch(stdout, /badge/);
  });

  it("returns JSON scoped to the category", async () => {
    const { stdout } = await captureLogs(() =>
      executeSearch({
        query: "input",
        category: "forms",
        json: true,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );
    const parsed = JSON.parse(stdout);

    assert.equal(parsed.length, 1);
    assert.equal(parsed[0].name, "input");
    assert.equal(parsed[0].category, "forms");
  });
});

describe("vinyaas add --category", () => {
  it("expands a category into components and installs with --yes", async () => {
    const cwd = await writeProject();
    const calls = [];
    const { stdout, value } = await captureLogs(() =>
      executeAdd({
        name: "",
        names: [],
        category: "forms",
        yes: true,
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        runPackageManager: async (options) => {
          calls.push(options);
        },
      }),
    );

    assert.match(stdout, /✓ button/);
    assert.match(stdout, /✓ input/);
    assert.deepEqual(value.items.sort(), ["button", "input"]);
    assert.equal(calls.length, 0);
    await access(join(cwd, "components/ui/button/index.tsx"));
    await access(join(cwd, "components/ui/input/index.tsx"));
  });

  it("supports dry-run for category installs", async () => {
    const cwd = await writeProject();
    const packageBefore = await readFile(join(cwd, "package.json"), "utf8");
    const { stdout } = await captureLogs(() =>
      executeAdd({
        name: "",
        names: [],
        category: "forms",
        dryRun: true,
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(stdout, /Vinyaas dry run/);
    assert.match(stdout, /✓ button/);
    assert.match(stdout, /✓ input/);
    assert.match(stdout, /No changes made\./);
    assert.equal(await readFile(join(cwd, "package.json"), "utf8"), packageBefore);
    await assert.rejects(() => access(join(cwd, "components/ui/button/index.tsx")));
  });

  it("ignores --category when explicit components are provided", async () => {
    const cwd = await writeProject();
    const { stdout, stderr, value } = await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button"],
        category: "forms",
        yes: true,
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(stderr, /Ignoring --category/);
    assert.match(stdout, /✓ button/);
    assert.doesNotMatch(stdout, /✓ input/);
    assert.deepEqual(value.items, ["button"]);
  });

  it("fails for an unknown category", async () => {
    const cwd = await writeProject();

    await assert.rejects(
      () =>
        executeAdd({
          name: "",
          names: [],
          category: "unknown",
          yes: true,
          cwd,
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: catalogFetch(),
        }),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /Unknown category: unknown/);
        return true;
      },
    );
  });

  it("cancels category install when confirmation is declined", async () => {
    const cwd = await writeProject();
    const { stdout, value } = await captureLogs(() =>
      executeAdd({
        name: "",
        names: [],
        category: "forms",
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        confirm: async () => false,
      }),
    );

    assert.match(stdout, /Category install/);
    assert.match(stdout, /Cancelled\. No changes made\./);
    assert.equal(value.entries.length, 0);
    await assert.rejects(() => access(join(cwd, "components/ui/button/index.tsx")));
  });
});
