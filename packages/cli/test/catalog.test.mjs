import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";

import { executeAdd } from "../src/commands/add.ts";
import {
  executeCatalogInfo,
  executeCatalogList,
} from "../src/commands/catalog.ts";
import {
  formatCatalogInfo,
  formatUnknownCatalogMessage,
} from "../src/lib/registry/catalogs.ts";
import { parseComponentCatalogIndex } from "../src/lib/registry/client.ts";
import { CliError } from "../src/lib/cli-error.ts";
import { RegistryError } from "../src/lib/registry/client.ts";

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

const catalogIndex = {
  type: "catalogs",
  items: [
    {
      id: "form",
      name: "Form",
      description: "Core form controls for building inputs and actions.",
      components: ["button", "input", "label"],
    },
    {
      id: "dashboard",
      name: "Dashboard",
      description: "Primitives commonly used in dashboards.",
      components: ["card", "badge"],
    },
  ],
};

const registryItems = {
  button: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "button",
    type: "registry:ui",
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
  label: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "label",
    type: "registry:ui",
    description: "A label for form controls with accessible association.",
    dependencies: [],
    files: [
      {
        path: "ui/label/index.tsx",
        content: "export function Label() { return null; }\n",
        type: "registry:ui",
      },
    ],
    docs: "https://vinyaas.vercel.app/components/label",
  },
  card: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "card",
    type: "registry:ui",
    description: "A bordered container for related content blocks.",
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
  form: {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
    name: "form",
    type: "registry:ui",
    description: "A form wrapper used to test component/catalog name collisions.",
    dependencies: [],
    files: [
      {
        path: "ui/form/index.tsx",
        content: "export function Form() { return null; }\n",
        type: "registry:ui",
      },
    ],
    docs: "https://vinyaas.vercel.app/components/form",
  },
};

function createFetch(options = {}) {
  const includeFormComponent = options.includeFormComponent === true;

  return async (url) => {
    const href = String(url);

    if (href.endsWith("/catalogs/index.json")) {
      return {
        ok: true,
        status: 200,
        async json() {
          return catalogIndex;
        },
      };
    }

    if (href.endsWith("/new-york/index.json")) {
      const items = Object.values(registryItems).filter(
        (item) => includeFormComponent || item.name !== "form",
      );

      return {
        ok: true,
        status: 200,
        async json() {
          return {
            style: "new-york",
            items: items.map((item) => ({
              name: item.name,
              type: item.type,
              description: item.description,
              docs: item.docs,
            })),
          };
        },
      };
    }

    const itemName = decodeURIComponent(
      href.split("/").pop().replace(/\.json$/, ""),
    );
    const item =
      itemName === "form" && !includeFormComponent
        ? undefined
        : registryItems[itemName];

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
}

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

async function writeProject() {
  const cwd = await mkdtemp(join(tmpdir(), "vinyaas-catalog-"));
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
    "app/globals.css": '@import "tailwindcss";\n',
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

describe("parseComponentCatalogIndex", () => {
  it("parses catalog metadata", () => {
    const parsed = parseComponentCatalogIndex(catalogIndex);
    assert.equal(parsed.type, "catalogs");
    assert.equal(parsed.items.length, 2);
    assert.equal(parsed.items[0]?.id, "dashboard");
  });
});

describe("formatUnknownCatalogMessage", () => {
  it("suggests close catalog typos", () => {
    const message = formatUnknownCatalogMessage("fro", ["form", "dashboard"]);
    assert.match(message, /Unknown catalog "fro"/);
    assert.match(message, /Did you mean:/);
    assert.match(message, /form/);
  });
});

describe("formatCatalogInfo", () => {
  it("reports installed membership without installing", () => {
    const message = formatCatalogInfo({
      catalog: catalogIndex.items[0],
      installed: ["button"],
    });

    assert.match(message, /Catalog: form/);
    assert.match(message, /button \(installed\)/);
    assert.match(message, /input \(not installed\)/);
    assert.match(message, /Total: 3/);
    assert.match(message, /Installed: 1/);
  });
});

describe("vinyaas catalog commands", () => {
  it("lists catalogs", async () => {
    const result = await captureLogs(() =>
      executeCatalogList({ fetch: createFetch() }),
    );

    assert.match(result.stdout, /Vinyaas catalogs/);
    assert.match(result.stdout, /\bform\b/);
    assert.match(result.stdout, /\bdashboard\b/);
  });

  it("shows catalog info", async () => {
    const cwd = await writeProject();
    const result = await captureLogs(() =>
      executeCatalogInfo({
        id: "form",
        cwd,
        fetch: createFetch(),
      }),
    );

    assert.match(result.stdout, /Catalog: form/);
    assert.match(result.stdout, /button \(not installed\)/);
    assert.match(result.stdout, /Total: 3/);
  });
});

describe("vinyaas add --catalog", () => {
  it("installs a catalog only with --catalog", async () => {
    const cwd = await writeProject();
    let confirmCalls = 0;

    const result = await captureLogs(() =>
      executeAdd({
        name: "",
        catalog: "form",
        cwd,
        fetch: createFetch(),
        runPackageManager: async () => {},
        confirm: async (message, options) => {
          confirmCalls += 1;
          assert.match(message, /Install these components\? \[Y\/n\]/);
          assert.equal(options?.defaultYes, true);
          return true;
        },
      }),
    );

    assert.equal(confirmCalls, 1);
    assert.match(result.stdout, /Vinyaas catalog: form/);
    assert.match(result.stdout, /Description:/);
    await access(join(cwd, "components/ui/button/index.tsx"));
    await access(join(cwd, "components/ui/input/index.tsx"));
    await access(join(cwd, "components/ui/label/index.tsx"));
  });

  it("defaults catalog confirmation to Yes when confirm returns empty default", async () => {
    const cwd = await writeProject();

    await executeAdd({
      name: "",
      catalog: "form",
      cwd,
      fetch: createFetch(),
      runPackageManager: async () => {},
      confirm: async (_message, options) => options?.defaultYes === true,
    });

    await access(join(cwd, "components/ui/button/index.tsx"));
  });

  it("declining catalog install does not modify files", async () => {
    const cwd = await writeProject();

    const plan = await executeAdd({
      name: "",
      catalog: "form",
      cwd,
      fetch: createFetch(),
      runPackageManager: async () => {
        throw new Error("should not install packages");
      },
      confirm: async () => false,
    });

    assert.deepEqual(plan.entries, []);
    await assert.rejects(() =>
      access(join(cwd, "components/ui/button/index.tsx")),
    );
  });

  it("dry-run with --catalog does not write files", async () => {
    const cwd = await writeProject();

    const result = await captureLogs(() =>
      executeAdd({
        name: "",
        catalog: "dashboard",
        cwd,
        dryRun: true,
        fetch: createFetch(),
        runPackageManager: async () => {
          throw new Error("should not install packages");
        },
        confirm: async () => {
          throw new Error("should not confirm during dry-run");
        },
      }),
    );

    assert.match(result.stdout, /Vinyaas dry run/);
    assert.match(result.stdout, /Catalog/);
    assert.match(result.stdout, /dashboard/);
    assert.match(result.stdout, /card/);
    assert.match(result.stdout, /badge/);
    assert.match(result.stdout, /No changes made\./);
    await assert.rejects(() =>
      access(join(cwd, "components/ui/card/index.tsx")),
    );
  });

  it("rejects an unknown catalog without writing files", async () => {
    const cwd = await writeProject();

    await assert.rejects(
      () =>
        executeAdd({
          name: "",
          catalog: "does-not-exist",
          cwd,
          fetch: createFetch(),
          runPackageManager: async () => {
            throw new Error("should not install packages");
          },
        }),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /Unknown catalog "does-not-exist"/);
        return true;
      },
    );

    await assert.rejects(() =>
      access(join(cwd, "components/ui/button/index.tsx")),
    );
  });

  it("does not treat add form as a catalog install", async () => {
    const cwd = await writeProject();

    await assert.rejects(
      () =>
        executeAdd({
          name: "form",
          cwd,
          fetch: createFetch(),
          runPackageManager: async () => {
            throw new Error("should not install packages");
          },
          confirm: async () => {
            throw new Error("should not confirm");
          },
        }),
      (error) => {
        assert.ok(error instanceof RegistryError);
        assert.match(
          error.message,
          /"form" is not an installable component\./,
        );
        assert.match(
          error.message,
          /Did you mean to install the "form" catalog\?/,
        );
        assert.match(error.message, /vinyaas add --catalog form/);
        return true;
      },
    );

    await assert.rejects(() =>
      access(join(cwd, "components/ui/button/index.tsx")),
    );
  });

  it("installs a component named form when both component and catalog exist", async () => {
    const cwd = await writeProject();

    await executeAdd({
      name: "form",
      cwd,
      fetch: createFetch({ includeFormComponent: true }),
      runPackageManager: async () => {},
      confirm: async () => {
        throw new Error("single component should not confirm");
      },
    });

    await access(join(cwd, "components/ui/form/index.tsx"));
    await assert.rejects(() =>
      access(join(cwd, "components/ui/button/index.tsx")),
    );
  });

  it("rejects component names combined with --catalog", async () => {
    const cwd = await writeProject();

    await assert.rejects(
      () =>
        executeAdd({
          name: "button",
          catalog: "form",
          cwd,
          fetch: createFetch(),
        }),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /Pass either component names or --catalog/);
        return true;
      },
    );
  });
});
