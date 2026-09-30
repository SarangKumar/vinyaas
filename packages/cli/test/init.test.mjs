import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const entrypoint = join(packageRoot, "dist/index.js");

const nextPackage = {
  dependencies: {
    next: "16.0.0",
    react: "19.0.0",
    "react-dom": "19.0.0",
    clsx: "2.0.0",
    "tailwind-merge": "2.0.0",
  },
  devDependencies: {
    tailwindcss: "4.0.0",
    "@tailwindcss/postcss": "4.0.0",
  },
};

const aliasConfig = `{
  "compilerOptions": {
    // Consumer import alias.
    "paths": {
      "@/*": ["./*"],
    },
  },
}
`;

function assertManagedCssOrder(css) {
  const importAt = css.indexOf('@import "tailwindcss"');
  const variantAt = css.indexOf("@custom-variant dark");
  const rootAt = css.search(/(^|\n):root\s*\{/);
  const darkAt = css.search(/(^|\n)\.dark\s*\{/);
  const themeAt = css.indexOf("@theme inline");

  assert.ok(importAt >= 0, "missing @import");
  assert.ok(variantAt > importAt, "dark variant must follow @import");
  assert.ok(rootAt > variantAt, ":root must follow dark variant");
  assert.ok(darkAt > rootAt, ".dark must follow :root");
  assert.ok(themeAt > darkAt, "@theme inline must follow .dark");
}

function run(cwd, env = {}, args = ["init"]) {
  return execFileAsync(process.execPath, [entrypoint, ...args], {
    cwd,
    env: { ...process.env, ...env },
  }).then(
    (result) => ({
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: 0,
    }),
    (error) => ({
      stdout: typeof error.stdout === "string" ? error.stdout : "",
      stderr: typeof error.stderr === "string" ? error.stderr : "",
      exitCode: typeof error.code === "number" ? error.code : 1,
    }),
  );
}

async function writeProject(files) {
  const cwd = await mkdtemp(join(tmpdir(), "vinyaas-init-"));

  await Promise.all(
    Object.entries(files).map(async ([relativePath, contents]) => {
      const filePath = join(cwd, relativePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, contents);
    }),
  );

  return cwd;
}

function nextProject(extra = {}) {
  return {
    "package.json": `${JSON.stringify(nextPackage, null, 2)}\n`,
    "tsconfig.json": aliasConfig,
    "app/globals.css": '@import "tailwindcss";\n',
    "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    ...extra,
  };
}

describe("vinyaas init", () => {
  it("creates components.json for a TypeScript Next.js project", async () => {
    const cwd = await writeProject(nextProject());
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });
    const raw = await readFile(join(cwd, "components.json"), "utf8");

    assert.equal(result.exitCode, 0, result.stderr);
    assert.equal(
      raw,
      `${JSON.stringify(
        {
          $schema: "https://vinyaas.vercel.app/schema/components.json",
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
      )}\n`,
    );
    assert.match(result.stdout, /Created lib\/utils\.ts/);
    assert.match(
      await readFile(join(cwd, "lib/utils.ts"), "utf8"),
      /export function cn/,
    );
    assert.match(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      /@theme inline/,
    );
    assertManagedCssOrder(await readFile(join(cwd, "app/globals.css"), "utf8"));
    assert.match(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      /--color-primary:\s*var\(--primary\)/,
    );
    assert.doesNotMatch(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      /font-geist/,
    );
  });

  it("uses src/app/globals.css when that is the global stylesheet", async () => {
    const files = nextProject();
    delete files["app/globals.css"];
    files["src/app/globals.css"] = '@import "tailwindcss";\n';

    const cwd = await writeProject(files);
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });
    const config = JSON.parse(
      await readFile(join(cwd, "components.json"), "utf8"),
    );

    assert.equal(result.exitCode, 0, result.stderr);
    assert.equal(config.tailwind.css, "src/app/globals.css");
  });

  it("creates app/globals.css when missing for Next.js", async () => {
    const files = nextProject();
    delete files["app/globals.css"];

    const cwd = await writeProject(files);
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });

    assert.equal(result.exitCode, 0, result.stderr);
    const css = await readFile(join(cwd, "app/globals.css"), "utf8");
    assertManagedCssOrder(css);
    assert.match(css, /@import "tailwindcss"/);
    assert.match(css, /color-scheme:\s*light/);
    assert.match(css, /\.dark\s*\{/);
    assert.match(css, /@theme inline/);
    assert.doesNotMatch(css, /--playground-/);
    assert.doesNotMatch(css, /--sidebar-/);
  });

  it("sets tsx to false for a JavaScript project", async () => {
    const files = nextProject();
    delete files["tsconfig.json"];
    files["jsconfig.json"] = aliasConfig;

    const cwd = await writeProject(files);
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });
    const config = JSON.parse(
      await readFile(join(cwd, "components.json"), "utf8"),
    );

    assert.equal(result.exitCode, 0, result.stderr);
    assert.equal(config.tsx, false);
    assert.match(
      await readFile(join(cwd, "lib/utils.js"), "utf8"),
      /export function cn/,
    );
  });

  it("fails clearly when Tailwind v3 is declared", async () => {
    const cwd = await writeProject(
      nextProject({
        "package.json": `${JSON.stringify(
          {
            dependencies: {
              next: "16.0.0",
              react: "19.0.0",
              "react-dom": "19.0.0",
            },
            devDependencies: {
              tailwindcss: "3.4.0",
            },
          },
          null,
          2,
        )}\n`,
      }),
    );
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /requires Tailwind CSS v4/);
    assert.match(result.stderr, /3\.4\.0/);
  });

  it("accepts Next.js, React, and Tailwind declared as peer dependencies", async () => {
    const cwd = await writeProject(
      nextProject({
        "package.json": `${JSON.stringify(
          {
            peerDependencies: {
              next: "16.0.0",
              react: "19.0.0",
              "react-dom": "19.0.0",
              "@tailwindcss/postcss": "4.0.0",
              clsx: "2.0.0",
              "tailwind-merge": "2.0.0",
            },
          },
          null,
          2,
        )}\n`,
      }),
    );
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });
    const config = JSON.parse(
      await readFile(join(cwd, "components.json"), "utf8"),
    );

    assert.equal(result.exitCode, 0, result.stderr);
    assert.equal(config.tailwind.css, "app/globals.css");
  });

  it("prefers app/globals.css when both stylesheets exist", async () => {
    const cwd = await writeProject(
      nextProject({
        "src/app/globals.css": '@import "tailwindcss";\n',
      }),
    );
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });
    const config = JSON.parse(
      await readFile(join(cwd, "components.json"), "utf8"),
    );

    assert.equal(result.exitCode, 0, result.stderr);
    assert.equal(config.tailwind.css, "app/globals.css");
  });

  it("fails when package.json is missing", async () => {
    const cwd = await writeProject({
      "tsconfig.json": aliasConfig,
      "app/globals.css": '@import "tailwindcss";\n',
    });
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /No package\.json was found/);
  });

  it("fails when package.json is invalid", async () => {
    const cwd = await writeProject(
      nextProject({
        "package.json": "{ not json\n",
      }),
    );
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /Could not read package\.json/);
  });

  it("adds a missing @/* alias without destroying other paths", async () => {
    const cwd = await writeProject(
      nextProject({
        "tsconfig.json": `${JSON.stringify(
          {
            compilerOptions: {
              paths: {
                "~/*": ["./*"],
              },
            },
          },
          null,
          2,
        )}\n`,
      }),
    );
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });

    assert.equal(result.exitCode, 0, result.stderr);
    const tsconfig = JSON.parse(
      await readFile(join(cwd, "tsconfig.json"), "utf8"),
    );
    assert.deepEqual(tsconfig.compilerOptions.paths["~/*"], ["./*"]);
    assert.deepEqual(tsconfig.compilerOptions.paths["@/*"], ["./*"]);
  });

  it("fails when React is incomplete", async () => {
    const cwd = await writeProject({
      "package.json": `${JSON.stringify({ dependencies: { react: "19.0.0" } })}\n`,
      "app/globals.css": '@import "tailwindcss";\n',
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    });
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /react and react-dom were not found/);
  });

  it("initializes a Vite React project from src/index.css", async () => {
    const cwd = await writeProject({
      "package.json": `${JSON.stringify(
        {
          dependencies: {
            react: "19.0.0",
            "react-dom": "19.0.0",
            vite: "6.0.0",
            clsx: "2.0.0",
            "tailwind-merge": "2.0.0",
          },
          devDependencies: {
            tailwindcss: "4.0.0",
            "@tailwindcss/postcss": "4.0.0",
          },
        },
        null,
        2,
      )}\n`,
      "tsconfig.json": aliasConfig,
      "src/index.css": '@import "tailwindcss";\n',
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    });
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });

    assert.equal(result.exitCode, 0, result.stderr);
    const config = JSON.parse(
      await readFile(join(cwd, "components.json"), "utf8"),
    );
    assert.equal(config.tailwind.css, "src/index.css");
    assert.match(
      await readFile(join(cwd, "src/index.css"), "utf8"),
      /@theme inline/,
    );
  });

  it("creates src/index.css for Vite when missing", async () => {
    const cwd = await writeProject({
      "package.json": `${JSON.stringify(
        {
          dependencies: {
            react: "19.0.0",
            "react-dom": "19.0.0",
            vite: "6.0.0",
            clsx: "2.0.0",
            "tailwind-merge": "2.0.0",
          },
          devDependencies: {
            tailwindcss: "4.0.0",
            "@tailwindcss/postcss": "4.0.0",
          },
        },
        null,
        2,
      )}\n`,
      "tsconfig.json": `${JSON.stringify(
        {
          compilerOptions: {
            paths: { "@/*": ["./src/*"] },
          },
        },
        null,
        2,
      )}\n`,
      "src/main.tsx": "export {};\n",
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    });
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });

    assert.equal(result.exitCode, 0, result.stderr);
    const config = JSON.parse(
      await readFile(join(cwd, "components.json"), "utf8"),
    );
    assert.equal(config.tailwind.css, "src/index.css");
    assert.match(
      await readFile(join(cwd, "src/index.css"), "utf8"),
      /@import "tailwindcss"/,
    );
    assert.match(
      await readFile(join(cwd, "src/lib/utils.ts"), "utf8"),
      /export function cn/,
    );
  });

  it("is idempotent when run twice", async () => {
    const cwd = await writeProject(nextProject());
    const env = { REGISTRY_BASE_URL: "https://vinyaas.vercel.app" };
    const first = await run(cwd, env);
    const cssAfterFirst = await readFile(join(cwd, "app/globals.css"), "utf8");
    const configAfterFirst = await readFile(
      join(cwd, "components.json"),
      "utf8",
    );
    const second = await run(cwd, env);

    assert.equal(first.exitCode, 0, first.stderr);
    assert.equal(second.exitCode, 0, second.stderr);
    assertManagedCssOrder(cssAfterFirst);
    assert.equal(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      cssAfterFirst,
    );
    assert.equal(
      await readFile(join(cwd, "components.json"), "utf8"),
      configAfterFirst,
    );
    assert.match(second.stdout, /already configured|CSS ready|already exists/i);
  });

  it("preserves custom user CSS while adding missing theme tokens", async () => {
    const existing = `@import "tailwindcss";

.my-widget {
  color: tomato;
}

:root {
  --primary: hotpink;
}
`;
    const cwd = await writeProject(
      nextProject({
        "app/globals.css": existing,
      }),
    );
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });
    const css = await readFile(join(cwd, "app/globals.css"), "utf8");

    assert.equal(result.exitCode, 0, result.stderr);
    assertManagedCssOrder(css);
    assert.match(css, /\.my-widget\s*\{/);
    assert.match(css, /--primary:\s*hotpink/);
    assert.match(css, /--background:/);
    assert.match(css, /@theme inline/);
    assert.equal(css.includes('@import "tailwindcss"'), true);
    assert.equal(
      css.split('@import "tailwindcss"').length - 1,
      1,
      "tailwind import must not duplicate",
    );
  });

  it("does not overwrite an incompatible components.json", async () => {
    const cwd = await writeProject({
      ...nextProject(),
      "components.json": '{"keep":true}\n',
      "lib/utils.ts": "export const kept = true;\n",
    });
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /components\.json already exists/);
    assert.match(result.stderr, /will not overwrite it/);
    assert.equal(
      await readFile(join(cwd, "components.json"), "utf8"),
      '{"keep":true}\n',
    );
    assert.equal(
      await readFile(join(cwd, "lib/utils.ts"), "utf8"),
      "export const kept = true;\n",
    );
  });

  it("does not overwrite an existing lib/utils.ts", async () => {
    const cwd = await writeProject({
      ...nextProject(),
      "lib/utils.ts": "export const kept = true;\n",
    });
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });

    assert.equal(result.exitCode, 0, result.stderr);
    assert.match(result.stdout, /lib\/utils\.ts already exists/);
    assert.equal(
      await readFile(join(cwd, "lib/utils.ts"), "utf8"),
      "export const kept = true;\n",
    );
  });

  it("does not create a Tailwind config file", async () => {
    const cwd = await writeProject(nextProject());
    const result = await run(cwd, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });

    assert.equal(result.exitCode, 0, result.stderr);
    await assert.rejects(readFile(join(cwd, "tailwind.config.ts"), "utf8"));
    await assert.rejects(readFile(join(cwd, "tailwind.config.js"), "utf8"));
    assert.match(
      await readFile(join(cwd, "postcss.config.mjs"), "utf8"),
      /@tailwindcss\/postcss/,
    );
  });

  it("uses REGISTRY_BASE_URL for the schema url", async () => {
    const production = await writeProject(nextProject());
    const local = await writeProject(nextProject());

    await run(production, {
      REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
    });
    await run(local, { REGISTRY_BASE_URL: "http://localhost:3000" });

    const productionConfig = JSON.parse(
      await readFile(join(production, "components.json"), "utf8"),
    );
    const localConfig = JSON.parse(
      await readFile(join(local, "components.json"), "utf8"),
    );

    assert.equal(
      productionConfig.$schema,
      "https://vinyaas.vercel.app/schema/components.json",
    );
    assert.equal(
      localConfig.$schema,
      "http://localhost:3000/schema/components.json",
    );
  });

  it("creates components.json in the directory given by --cwd", async () => {
    const parent = await mkdtemp(join(tmpdir(), "vinyaas-init-cwd-"));
    const project = join(parent, "my-app");

    await Promise.all(
      Object.entries(nextProject()).map(async ([relativePath, contents]) => {
        const filePath = join(project, relativePath);
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, contents);
      }),
    );

    const result = await execFileAsync(
      process.execPath,
      [entrypoint, "init", "--cwd", "./my-app", "--yes"],
      {
        cwd: parent,
        env: {
          ...process.env,
          REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
        },
      },
    );

    assert.match(result.stdout, /Created components\.json|Vinyaas initialized/);
    const config = JSON.parse(
      await readFile(join(project, "components.json"), "utf8"),
    );

    assert.equal(config.tailwind.css, "app/globals.css");
    await assert.rejects(readFile(join(parent, "components.json"), "utf8"));
  });
});
