import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";

import { runAdd } from "../src/commands/add.ts";

const cssContent = '@import "tailwindcss";\n';

const componentsConfig = {
  $schema: "http://localhost:3000/schema/components.json",
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

function registryItem(name, extra = {}) {
  return {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name,
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: `ui/${name}/index.tsx`,
        content: `export function ${name}() { return null; }\n`,
      },
    ],
    ...extra,
  };
}

function fetchCatalog(catalog) {
  const counts = {};
  const fetchImpl = async (url) => {
    const itemName = decodeURIComponent(
      String(url)
        .split("/")
        .pop()
        .replace(/\.json$/, ""),
    );
    counts[itemName] = (counts[itemName] ?? 0) + 1;
    const item = catalog[itemName];

    if (!item) {
      return {
        ok: false,
        status: 404,
        async json() {
          return {};
        },
      };
    }

    return {
      ok: true,
      status: 200,
      async json() {
        return item;
      },
    };
  };

  return { fetch: fetchImpl, counts };
}

async function writeProject(extra = {}) {
  const cwd = await mkdtemp(join(tmpdir(), "vinyaas-multi-add-"));
  const files = {
    "components.json": `${JSON.stringify(componentsConfig, null, 2)}\n`,
    "tsconfig.json": `{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
`,
    "package.json": `${JSON.stringify({ name: "consumer", dependencies: {} }, null, 2)}\n`,
    "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    "app/globals.css": cssContent,
    ...extra,
  };

  await Promise.all(
    Object.entries(files).map(async ([relativePath, contents]) => {
      const filePath = join(cwd, relativePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, contents);
    }),
  );

  return cwd;
}

async function add(cwd, names, { fetch, force = false, runPackageManager }) {
  const logs = [];
  const original = console.log;
  const calls = [];
  console.log = (...args) => {
    logs.push(args.join(" "));
  };

  try {
    const plan = await runAdd({
      cwd,
      name: names[0],
      names,
      force,
      yes: true,
      env: { REGISTRY_BASE_URL: "http://localhost:3000" },
      fetch,
      runPackageManager:
        runPackageManager ??
        (async (command) => {
          calls.push(command);
        }),
    });

    return { plan, stdout: logs.join("\n"), calls };
  } finally {
    console.log = original;
  }
}

const catalog = {
  button: registryItem("button", {
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    registryDependencies: ["card"],
  }),
  card: registryItem("card"),
  badge: registryItem("badge"),
};

describe("vinyaas add multiple components", () => {
  it("still installs a single component", async () => {
    const cwd = await writeProject();
    const registry = fetchCatalog(catalog);
    const { stdout, plan } = await add(cwd, ["button"], registry);

    assert.match(stdout, /✓ Added components/);
    assert.doesNotMatch(stdout, /Installed \d+ components/);
    assert.equal(plan.name, "button");
    assert.deepEqual(plan.items, ["card", "button"]);
    const written = await readFile(
      join(cwd, "components/ui/button/index.tsx"),
      "utf8",
    );
    assert.match(written, /function button/);
  });

  it("installs two components together", async () => {
    const cwd = await writeProject();
    const registry = fetchCatalog(catalog);
    const { stdout, plan } = await add(cwd, ["button", "badge"], registry);

    assert.match(stdout, /Installed/);
    assert.match(stdout, /✓ button/);
    assert.match(stdout, /✓ badge/);
    assert.ok(
      plan.entries.some((entry) => entry.destinationPath.includes("badge")),
    );
    await access(join(cwd, "components/ui/badge/index.tsx"));
    await access(join(cwd, "components/ui/button/index.tsx"));
  });

  it("installs three components and resolves each registry item once", async () => {
    const cwd = await writeProject();
    const registry = fetchCatalog(catalog);
    const { stdout, plan } = await add(
      cwd,
      ["button", "card", "badge", "button"],
      registry,
    );

    assert.match(stdout, /Installed/);
    assert.match(stdout, /✓ button/);
    assert.match(stdout, /✓ card/);
    assert.match(stdout, /✓ badge/);
    assert.deepEqual(
      plan.items
        .filter((name) => ["button", "card", "badge"].includes(name))
        .sort(),
      ["badge", "button", "card"],
    );
    assert.equal(registry.counts.button, 1);
    assert.equal(registry.counts.card, 1);
    assert.equal(registry.counts.badge, 1);
    await access(join(cwd, "components/ui/card/index.tsx"));
  });

  it("installs shared npm dependencies once", async () => {
    const cwd = await writeProject();
    const registry = fetchCatalog(catalog);
    const { plan, calls } = await add(
      cwd,
      ["button", "card", "badge"],
      registry,
    );

    assert.equal(calls.length, 1);
    assert.equal(plan.dependencies.filter((name) => name === "clsx").length, 1);
    assert.equal(
      plan.dependencies.filter((name) => name === "tailwind-merge").length,
      1,
    );
    assert.equal(calls[0].args.filter((arg) => arg === "clsx").length, 1);
    assert.equal(
      calls[0].args.filter((arg) => arg === "tailwind-merge").length,
      1,
    );
    assert.ok(calls[0].args.includes("class-variance-authority"));
  });

  it("installs known components and reports unknown names as failed", async () => {
    const cwd = await writeProject();
    const registry = fetchCatalog(catalog);
    const { stdout, plan } = await add(
      cwd,
      ["button", "does-not-exist", "card"],
      registry,
    );

    assert.match(stdout, /Installed/);
    assert.match(stdout, /✓ button/);
    assert.match(stdout, /✓ card/);
    assert.match(stdout, /Failed/);
    assert.match(stdout, /• does-not-exist \(not found\)/);
    assert.deepEqual(plan.failed, ["does-not-exist"]);
    await access(join(cwd, "components/ui/button/index.tsx"));
    await access(join(cwd, "components/ui/card/index.tsx"));
  });

  it("skips already-installed components and continues with the rest", async () => {
    const cwd = await writeProject({
      "components/ui/button/index.tsx": "export const existing = true;\n",
    });
    const registry = fetchCatalog(catalog);
    const { stdout, plan, calls } = await add(cwd, ["button", "card"], registry);

    assert.match(stdout, /Installed/);
    assert.match(stdout, /✓ card/);
    assert.match(stdout, /Skipped/);
    assert.match(stdout, /• button \(already exists\)/);
    assert.deepEqual(plan.skipped, ["button"]);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      "export const existing = true;\n",
    );
    await access(join(cwd, "components/ui/card/index.tsx"));
    assert.equal(calls.length, 1);
  });

  it("skips button, card, and badge while installing textarea and spinner", async () => {
    const cwd = await writeProject({
      "components/ui/button/index.tsx": "export const existingButton = true;\n",
      "components/ui/card/index.tsx": "export const existingCard = true;\n",
      "components/ui/badge/index.tsx": "export const existingBadge = true;\n",
    });
    const fullCatalog = {
      ...catalog,
      textarea: registryItem("textarea", {
        dependencies: ["clsx"],
        files: [
          {
            path: "ui/textarea/index.tsx",
            content: "export function Textarea() { return null; }\n",
          },
          {
            path: "ui/textarea/textarea.css",
            content: ".textarea { display: block; }\n",
          },
        ],
      }),
      spinner: registryItem("spinner", {
        dependencies: ["clsx"],
      }),
    };
    const registry = fetchCatalog(fullCatalog);
    const { stdout, plan, calls } = await add(
      cwd,
      ["button", "card", "badge", "textarea", "spinner"],
      registry,
    );

    assert.match(stdout, /Skipped/);
    assert.match(stdout, /• button \(already exists\)/);
    assert.match(stdout, /• card \(already exists\)/);
    assert.match(stdout, /• badge \(already exists\)/);
    assert.match(stdout, /Installed/);
    assert.match(stdout, /✓ textarea/);
    assert.match(stdout, /✓ spinner/);
    assert.deepEqual(plan.skipped, ["button", "card", "badge"]);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      "export const existingButton = true;\n",
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/card/index.tsx"), "utf8"),
      "export const existingCard = true;\n",
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/badge/index.tsx"), "utf8"),
      "export const existingBadge = true;\n",
    );
    await access(join(cwd, "components/ui/textarea/index.tsx"));
    await access(join(cwd, "components/ui/textarea/textarea.css"));
    await access(join(cwd, "components/ui/spinner/index.tsx"));
    assert.equal(calls.length, 1);
    assert.ok(calls[0].args.includes("clsx"));
    assert.equal(calls[0].args.filter((arg) => arg === "clsx").length, 1);
  });

  it("overwrites existing files when --force is set", async () => {
    const cwd = await writeProject({
      "components/ui/button/index.tsx": "export const existing = true;\n",
    });
    const registry = fetchCatalog(catalog);
    const { plan } = await add(cwd, ["button", "badge"], {
      ...registry,
      force: true,
    });

    assert.equal(
      plan.entries.find(
        (entry) => entry.destinationPath === "components/ui/button/index.tsx",
      )?.overwrite,
      true,
    );
    assert.match(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      /function button/,
    );
    await access(join(cwd, "components/ui/badge/index.tsx"));
  });
});
