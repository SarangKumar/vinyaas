import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { executeAdd } from "../src/commands/add.ts";
import { executeStatus } from "../src/commands/status.ts";
import { formatAddInstallPrompt } from "../src/lib/add/format.ts";
import {
  MANIFEST_RELATIVE_PATH,
  readManifest,
} from "../src/lib/manifest/store.ts";

function captureLogs(run) {
  const logs = [];
  const originalLog = console.log;

  console.log = (...args) => {
    logs.push(args.join(" "));
  };

  return Promise.resolve()
    .then(run)
    .then((value) => ({
      value,
      stdout: logs.join("\n"),
    }))
    .finally(() => {
      console.log = originalLog;
    });
}

const registryItems = {
  button: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "button",
    type: "registry:ui",
    category: "forms",
    dependencies: ["clsx"],
    files: [
      {
        path: "ui/button/index.tsx",
        content: "export function Button() { return null; }\n",
        type: "registry:ui",
      },
    ],
  },
  card: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "card",
    type: "registry:ui",
    category: "layout",
    dependencies: ["clsx"],
    files: [
      {
        path: "ui/card/index.tsx",
        content: "export function Card() { return null; }\n",
        type: "registry:ui",
      },
    ],
  },
  badge: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "badge",
    type: "registry:ui",
    category: "data-display",
    dependencies: ["clsx"],
    files: [
      {
        path: "ui/badge/index.tsx",
        content: "export function Badge() { return null; }\n",
        type: "registry:ui",
      },
    ],
  },
  input: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "input",
    type: "registry:ui",
    category: "forms",
    dependencies: ["clsx"],
    files: [
      {
        path: "ui/input/index.tsx",
        content: "export function Input() { return null; }\n",
        type: "registry:ui",
      },
    ],
  },
};

const catalogItems = Object.values(registryItems).map((item) => ({
  name: item.name,
  type: item.type,
  category: item.category,
  description: `${item.name} description`,
  docs: `https://vinyaas.vercel.app/components/${item.name}`,
}));

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
  const root = await mkdtemp(join(tmpdir(), "vinyaas-install-state-"));
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

describe("add confirmation", () => {
  it("formats a multi-component confirmation summary", () => {
    const output = formatAddInstallPrompt({
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
        dependencies: ["clsx"],
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

    assert.match(output, /^Add components/);
    assert.match(output, /Components:\n ✓ button\n ✓ card/);
    assert.match(output, /Files:\n 2 files/);
    assert.match(output, /Dependencies:\n clsx\n tailwind-merge/);
  });

  it("prompts for multi-component installs and cancels without writing", async () => {
    const cwd = await writeProject();
    let asked = 0;
    const { stdout, value } = await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button", "card"],
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        confirm: async () => {
          asked += 1;
          return false;
        },
      }),
    );

    assert.equal(asked, 1);
    assert.match(stdout, /Add components/);
    assert.match(stdout, /Cancelled\. No changes made\./);
    assert.equal(value.entries.length, 0);
    await assert.rejects(() => access(join(cwd, "components/ui/button/index.tsx")));
    await assert.rejects(() => access(join(cwd, MANIFEST_RELATIVE_PATH)));
  });

  it("prompts for category installs", async () => {
    const cwd = await writeProject();
    const { stdout } = await captureLogs(() =>
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
  });

  it("skips confirmation with --yes", async () => {
    const cwd = await writeProject();
    let asked = 0;
    const { stdout } = await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button", "card"],
        yes: true,
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        confirm: async () => {
          asked += 1;
          return false;
        },
      }),
    );

    assert.equal(asked, 0);
    assert.doesNotMatch(stdout, /Add components/);
    assert.doesNotMatch(stdout, /Continue\?/);
    await access(join(cwd, "components/ui/button/index.tsx"));
    await access(join(cwd, "components/ui/card/index.tsx"));
  });

  it("skips confirmation for dry-run", async () => {
    const cwd = await writeProject();
    let asked = 0;
    const { stdout } = await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button", "card"],
        dryRun: true,
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        confirm: async () => {
          asked += 1;
          return true;
        },
      }),
    );

    assert.equal(asked, 0);
    assert.match(stdout, /Vinyaas dry run/);
    assert.doesNotMatch(stdout, /Add components/);
    await assert.rejects(() => access(join(cwd, MANIFEST_RELATIVE_PATH)));
  });

  it("does not prompt for a single-component install", async () => {
    const cwd = await writeProject();
    let asked = 0;
    await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button"],
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        confirm: async () => {
          asked += 1;
          return false;
        },
      }),
    );

    assert.equal(asked, 0);
    await access(join(cwd, "components/ui/button/index.tsx"));
  });
});

describe("installation manifest", () => {
  it("creates the manifest after a successful install", async () => {
    const cwd = await writeProject();
    await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button"],
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    const manifest = await readManifest(cwd);
    assert.ok(manifest);
    assert.equal(typeof manifest.version, "string");
    assert.deepEqual(Object.keys(manifest.components), ["button"]);
    assert.deepEqual(manifest.components.button.files, [
      "components/ui/button/index.tsx",
    ]);
    assert.match(manifest.components.button.installedAt, /^\d{4}-\d{2}-\d{2}$/);
  });

  it("merges multiple installs without overwriting previous entries", async () => {
    const cwd = await writeProject();
    await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button"],
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );
    await captureLogs(() =>
      executeAdd({
        name: "card",
        names: ["card"],
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    const manifest = await readManifest(cwd);
    assert.deepEqual(Object.keys(manifest.components).sort(), ["button", "card"]);
  });

  it("rolls back manifest changes when installation fails", async () => {
    const cwd = await writeProject();
    await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button"],
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );
    const before = await readFile(join(cwd, MANIFEST_RELATIVE_PATH), "utf8");

    await assert.rejects(
      () =>
        executeAdd({
          name: "card",
          names: ["card"],
          cwd,
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: catalogFetch(),
          mutations: {
            writeManifest: async (project, plan) => {
              const { updateManifestFromPlan } = await import(
                "../src/lib/manifest/store.ts"
              );
              await updateManifestFromPlan(project, plan);
              throw new Error("simulated failure");
            },
          },
        }),
      /Installation failed/,
    );

    assert.equal(await readFile(join(cwd, MANIFEST_RELATIVE_PATH), "utf8"), before);
    await assert.rejects(() => access(join(cwd, "components/ui/card/index.tsx")));
  });

  it("does not write a manifest during dry-run", async () => {
    const cwd = await writeProject();
    await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button"],
        dryRun: true,
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.equal(await readManifest(cwd), null);
  });
});

describe("vinyaas status", () => {
  it("shows the empty state when no manifest exists", async () => {
    const cwd = await writeProject();
    const { stdout, value } = await captureLogs(() =>
      executeStatus({ cwd }),
    );

    assert.match(stdout, /No Vinyaas components installed\./);
    assert.match(stdout, /vinyaas add <component>/);
    assert.deepEqual(value.components, []);
    assert.equal(value.version, null);
  });

  it("reads installed components from the manifest", async () => {
    const cwd = await writeProject();
    await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button", "badge"],
        yes: true,
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    const { stdout, value } = await captureLogs(() => executeStatus({ cwd }));

    assert.match(stdout, /^Vinyaas/);
    assert.match(stdout, /✓ badge/);
    assert.match(stdout, /✓ button/);
    assert.match(stdout, new RegExp(MANIFEST_RELATIVE_PATH.replace(".", "\\.")));
    assert.deepEqual(value.components, ["badge", "button"]);
  });

  it("prints JSON status", async () => {
    const cwd = await writeProject();
    await captureLogs(() =>
      executeAdd({
        name: "button",
        names: ["button"],
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    const { stdout } = await captureLogs(() =>
      executeStatus({ cwd, json: true }),
    );
    const parsed = JSON.parse(stdout);
    assert.equal(typeof parsed.version, "string");
    assert.deepEqual(parsed.components, ["button"]);
  });
});
