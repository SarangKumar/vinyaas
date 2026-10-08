import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { executeAdd } from "../src/commands/add.ts";
import { executeUpdate } from "../src/commands/update.ts";
import {
  formatUpdateConfirmQuestion,
  formatUpdatePrompt,
} from "../src/lib/update/format.ts";
import { MANIFEST_RELATIVE_PATH } from "../src/lib/manifest/store.ts";

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
        content: "export function Button() { return <button />; }\n",
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
        content: "export function Card() { return <div />; }\n",
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
  const root = await mkdtemp(join(tmpdir(), "vinyaas-update-"));
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
    JSON.stringify(
      {
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
      },
      null,
      2,
    ),
  );
  await mkdir(join(root, "app"), { recursive: true });
  await writeFile(join(root, "app/globals.css"), '@import "tailwindcss";\n');
  await mkdir(join(root, "lib"), { recursive: true });
  await writeFile(
    join(root, "lib/utils.ts"),
    "export function cn(...inputs) { return inputs.filter(Boolean).join(' '); }\n",
  );
  return root;
}

async function installComponents(cwd, names) {
  await executeAdd({
    name: names[0],
    names,
    yes: true,
    cwd,
    env: { REGISTRY_BASE_URL: "http://localhost:3000" },
    fetch: catalogFetch(),
  });
}

describe("update format", () => {
  it("warns that local edits will be overwritten", () => {
    const prompt = formatUpdatePrompt({
      targets: ["button", "card"],
      updateAll: true,
    });

    assert.match(prompt, /Update all installed components/);
    assert.match(prompt, / ✓ button/);
    assert.match(prompt, / ✓ card/);
    assert.match(prompt, /overwrites local component files/i);
    assert.equal(
      formatUpdateConfirmQuestion({
        targets: ["button", "card"],
        updateAll: true,
      }),
      "Update all installed components and overwrite local changes? (y/N)",
    );
    assert.equal(
      formatUpdateConfirmQuestion({
        targets: ["button"],
        updateAll: false,
      }),
      "Overwrite local changes for button? (y/N)",
    );
  });
});

describe("vinyaas update", () => {
  it("fails when nothing is installed", async () => {
    const cwd = await writeProject();

    await assert.rejects(
      () =>
        executeUpdate({
          names: [],
          cwd,
          yes: true,
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: catalogFetch(),
        }),
      /No components are installed/,
    );
  });

  it("fails when a named component is not installed", async () => {
    const cwd = await writeProject();
    await installComponents(cwd, ["button"]);

    await assert.rejects(
      () =>
        executeUpdate({
          names: ["card"],
          cwd,
          yes: true,
          env: { REGISTRY_BASE_URL: "http://localhost:3000" },
          fetch: catalogFetch(),
        }),
      /card is not installed/,
    );
  });

  it("cancels all-update without writing when confirmation is declined", async () => {
    const cwd = await writeProject();
    await installComponents(cwd, ["button"]);
    await writeFile(
      join(cwd, "components/ui/button/index.tsx"),
      "// local edit\n",
    );

    let asked = 0;
    const { stdout, value } = await captureLogs(() =>
      executeUpdate({
        names: [],
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
    assert.match(stdout, /Update all installed components/);
    assert.match(stdout, /Cancelled\. No changes made\./);
    assert.equal(value.entries.length, 0);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      "// local edit\n",
    );
  });

  it("updates a named component and overwrites local edits with --yes", async () => {
    const cwd = await writeProject();
    await installComponents(cwd, ["button"]);
    await writeFile(
      join(cwd, "components/ui/button/index.tsx"),
      "// local edit\n",
    );

    let asked = 0;
    const { stdout } = await captureLogs(() =>
      executeUpdate({
        names: ["button"],
        cwd,
        yes: true,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        confirm: async () => {
          asked += 1;
          return false;
        },
      }),
    );

    assert.equal(asked, 0);
    assert.match(stdout, /✓ Updated components/);
    assert.match(stdout, /Updated/);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      registryItems.button.files[0].content,
    );
    await access(join(cwd, MANIFEST_RELATIVE_PATH));
  });

  it("updates every installed component when no names are given", async () => {
    const cwd = await writeProject();
    await installComponents(cwd, ["button", "card"]);
    await writeFile(
      join(cwd, "components/ui/button/index.tsx"),
      "// button edit\n",
    );
    await writeFile(
      join(cwd, "components/ui/card/index.tsx"),
      "// card edit\n",
    );

    const { stdout } = await captureLogs(() =>
      executeUpdate({
        names: [],
        cwd,
        yes: true,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
      }),
    );

    assert.match(stdout, /✓ Updated components/);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      registryItems.button.files[0].content,
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/card/index.tsx"), "utf8"),
      registryItems.card.files[0].content,
    );
  });

  it("prompts before updating a single component without --yes", async () => {
    const cwd = await writeProject();
    await installComponents(cwd, ["button"]);
    await writeFile(
      join(cwd, "components/ui/button/index.tsx"),
      "// local edit\n",
    );

    let question = "";
    const { stdout } = await captureLogs(() =>
      executeUpdate({
        names: ["button"],
        cwd,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        confirm: async (message) => {
          question = message;
          return true;
        },
      }),
    );

    assert.match(stdout, /Update components/);
    assert.equal(question, "Overwrite local changes for button? (y/N)");
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      registryItems.button.files[0].content,
    );
  });

  it("skips confirmation for dry-run", async () => {
    const cwd = await writeProject();
    await installComponents(cwd, ["button"]);
    await writeFile(
      join(cwd, "components/ui/button/index.tsx"),
      "// local edit\n",
    );

    let asked = 0;
    const { stdout } = await captureLogs(() =>
      executeUpdate({
        names: ["button"],
        cwd,
        dryRun: true,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: catalogFetch(),
        confirm: async () => {
          asked += 1;
          return false;
        },
      }),
    );

    assert.equal(asked, 0);
    assert.match(stdout, /dry run/i);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      "// local edit\n",
    );
  });
});
