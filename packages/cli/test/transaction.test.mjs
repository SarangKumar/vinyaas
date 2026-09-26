import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";

import { runAdd } from "../src/commands/add.ts";
import { CliError } from "../src/lib/cli-error.ts";
import { writeInstallPlan } from "../src/lib/install-plan.ts";
import { restoreFiles, snapshotFiles } from "../src/lib/transaction/files.ts";

const buttonContent = "export function Button() { return null; }\n";
const cssContent = ":root{--foo:bar}\n";
const packageJson = `${JSON.stringify(
  { name: "consumer", dependencies: { clsx: "^2.1.0" } },
  null,
  2,
)}\n`;
const lockfile = "lockfileVersion: '9.0'\n";

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

function item(name, extra = {}) {
  return {
    $schema: "https://example.com/schema/registry-item.json",
    name,
    type: "registry:ui",
    dependencies: [],
    files: [{ path: "ui/button/button.tsx", content: buttonContent }],
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
  const cwd = await mkdtemp(join(tmpdir(), "vinyaas-tx-"));

  await writeFiles(cwd, {
    "components.json": `${JSON.stringify(config, null, 2)}\n`,
    "tsconfig.json": `{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }\n`,
    "package.json": packageJson,
    "pnpm-lock.yaml": lockfile,
    "app/globals.css": cssContent,
    ".env": "OPENAI_API_KEY=secret-value\n",
    ...extra,
  });

  return cwd;
}

function fetchItem(payload) {
  return async () => ({
    ok: true,
    status: 200,
    json: async () => payload,
  });
}

async function add(cwd, payload, options = {}) {
  const calls = [];
  const logs = [];
  const original = console.log;
  console.log = (...args) => {
    logs.push(args.join(" "));
  };

  try {
    await runAdd({
      cwd,
      name: "button",
      force: options.force ?? false,
      env: { REGISTRY_BASE_URL: "http://localhost:3000" },
      fetch: fetchItem(payload),
      runPackageManager:
        options.runPackageManager ??
        (async (command) => {
          calls.push(command);
        }),
      ...(options.mutations ? { mutations: options.mutations } : {}),
    });
  } finally {
    console.log = original;
  }

  return { calls, stdout: logs.join("\n") };
}

describe("file snapshots", () => {
  it("restores an existing file byte for byte and removes a created file", async () => {
    const cwd = await project();
    const original = Buffer.from(":root{--foo:bar}\n");
    const snapshot = await snapshotFiles(cwd, [
      "app/globals.css",
      "components/ui/button/button.tsx",
    ]);

    await writeFile(
      join(cwd, "app/globals.css"),
      ":root { --foo: changed; }\n",
    );
    await mkdir(join(cwd, "components/ui/button"), { recursive: true });
    await writeFile(
      join(cwd, "components/ui/button/button.tsx"),
      buttonContent,
    );
    await restoreFiles(cwd, snapshot);

    assert.deepEqual(await readFile(join(cwd, "app/globals.css")), original);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx")),
    );
  });

  it("rejects a snapshot path outside the project", async () => {
    const cwd = await project();

    await assert.rejects(
      () => snapshotFiles(cwd, ["../outside.txt"]),
      /Cannot snapshot a path outside the project/,
    );
  });
});

describe("installation rollback", () => {
  it("restores package.json and the lockfile when installation fails", async () => {
    const cwd = await project();

    await assert.rejects(
      () =>
        add(cwd, item("button", { dependencies: ["tailwind-merge"] }), {
          runPackageManager: async () => {
            await writeFile(join(cwd, "package.json"), '{"name":"changed"}\n');
            await writeFile(join(cwd, "pnpm-lock.yaml"), "changed\n");
            throw new CliError("Dependency installation failed.");
          },
        }),
      /Installation failed.\nChanges were rolled back.\nDependency installation failed/,
    );
    assert.equal(
      await readFile(join(cwd, "package.json"), "utf8"),
      packageJson,
    );
    assert.equal(await readFile(join(cwd, "pnpm-lock.yaml"), "utf8"), lockfile);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx")),
    );
    assert.equal(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      cssContent,
    );
  });

  it("removes component files created before a later write fails", async () => {
    const cwd = await project();

    await assert.rejects(
      () =>
        add(
          cwd,
          item("button", {
            files: [
              { path: "ui/utils.ts", content: "export const cn = true;\n" },
              { path: "ui/button/button.tsx", content: buttonContent },
            ],
          }),
          {
            mutations: {
              writeComponents: async (projectRoot, plan) => {
                await writeInstallPlan(projectRoot, {
                  ...plan,
                  entries: [plan.entries[0]],
                });
                throw new Error("component write failed");
              },
            },
          },
        ),
      /component write failed/,
    );
    await assert.rejects(readFile(join(cwd, "components/ui/utils.ts")));
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx")),
    );
  });

  it("restores a file replaced with --force", async () => {
    const cwd = await project({
      "components/ui/button/button.tsx": "// local modification\n",
    });

    await assert.rejects(
      () =>
        add(cwd, item("button", { css: { ".button": "color: red" } }), {
          force: true,
          mutations: {
            writeCss: async () => {
              throw new Error("css write failed");
            },
          },
        }),
      /css write failed/,
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
      "// local modification\n",
    );
    assert.equal(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      cssContent,
    );
  });

  it("restores css bytes when the stylesheet write fails after it changes", async () => {
    const cwd = await project();

    await assert.rejects(
      () =>
        add(cwd, item("button", { css: { ".button": "color: red" } }), {
          mutations: {
            writeCss: async (projectRoot, update) => {
              await writeFile(
                join(projectRoot, update.relativePath),
                update.next,
              );
              throw new Error("css write failed");
            },
          },
        }),
      /Changes were rolled back/,
    );
    assert.equal(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      cssContent,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx")),
    );
  });

  it("does not run the package manager when the snapshot fails", async () => {
    const cwd = await project();
    const calls = [];

    await assert.rejects(
      () =>
        add(cwd, item("button", { dependencies: ["tailwind-merge"] }), {
          runPackageManager: async () => {
            calls.push(true);
          },
          mutations: {
            snapshotFiles: async () => {
              throw new Error("snapshot failed");
            },
          },
        }),
      /snapshot failed/,
    );
    assert.equal(calls.length, 0);
    assert.equal(
      await readFile(join(cwd, "package.json"), "utf8"),
      packageJson,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx")),
    );
  });

  it("reports the original error and the rollback error", async () => {
    const cwd = await project();

    await assert.rejects(
      () =>
        add(cwd, item("button"), {
          mutations: {
            writeComponents: async () => {
              throw new Error("component write failed");
            },
            restoreFiles: async () => {
              throw new Error("disk full");
            },
          },
        }),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /Installation failed/);
        assert.match(error.message, /component write failed/);
        assert.match(error.message, /Rollback failed:/);
        assert.match(error.message, /disk full/);
        assert.doesNotMatch(error.message, /secret-value/);
        return true;
      },
    );
  });

  it("leaves a successful install in place", async () => {
    const cwd = await project();
    const { stdout } = await add(
      cwd,
      item("button", { css: { ".button": "color: red" } }),
    );

    assert.doesNotMatch(stdout, /rolled back/);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
      buttonContent,
    );
    assert.match(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      /\.button/,
    );
    assert.equal(
      await readFile(join(cwd, "package.json"), "utf8"),
      packageJson,
    );
  });

  it("does not change .env during rollback", async () => {
    const cwd = await project();
    const envFile = "OPENAI_API_KEY=secret-value\n";

    await assert.rejects(
      () =>
        add(cwd, item("button"), {
          mutations: {
            writeComponents: async (projectRoot, plan) => {
              await writeInstallPlan(projectRoot, plan);
              throw new Error("component write failed");
            },
          },
        }),
      /Changes were rolled back/,
    );
    assert.equal(await readFile(join(cwd, ".env"), "utf8"), envFile);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx")),
    );
  });

  it("does not create package.json when none is needed", async () => {
    const cwd = await project();
    await writeFile(join(cwd, "package.json"), "");
    const { rm } = await import("node:fs/promises");
    await rm(join(cwd, "package.json"));

    await assert.rejects(
      () =>
        add(cwd, item("button"), {
          mutations: {
            writeComponents: async () => {
              throw new Error("component write failed");
            },
          },
        }),
      /component write failed/,
    );
    await assert.rejects(readFile(join(cwd, "package.json")));
  });
});
