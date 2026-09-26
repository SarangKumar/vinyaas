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
    tailwindcss: "4.0.0",
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

function run(cwd, env = {}) {
  return execFileAsync(process.execPath, [entrypoint, "init"], {
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

    assert.equal(result.exitCode, 0);
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
    assert.equal(raw.endsWith("\n"), true);
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

    assert.equal(result.exitCode, 0);
    assert.equal(config.tailwind.css, "src/app/globals.css");
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

    assert.equal(result.exitCode, 0);
    assert.equal(config.tsx, false);
    assert.equal(config.aliases.utils, "@/lib/utils");
    assert.equal(config.aliases.lib, undefined);
    assert.equal(config.aliases.hooks, undefined);
  });

  it("fails when no supported global CSS file exists", async () => {
    const files = nextProject();
    delete files["app/globals.css"];

    const cwd = await writeProject(files);
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /Could not find a supported global CSS file/);
    assert.match(result.stderr, /app\/globals\.css/);
    assert.match(result.stderr, /src\/app\/globals\.css/);
    await assert.rejects(readFile(join(cwd, "components.json"), "utf8"));
  });

  it("fails when Tailwind is not installed", async () => {
    const cwd = await writeProject(
      nextProject({
        "package.json": `${JSON.stringify(
          {
            dependencies: {
              next: "16.0.0",
              react: "19.0.0",
              "react-dom": "19.0.0",
            },
          },
          null,
          2,
        )}\n`,
      }),
    );
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /Vinyaas requires Tailwind CSS/);
    await assert.rejects(readFile(join(cwd, "components.json"), "utf8"));
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

    assert.equal(result.exitCode, 0);
    assert.equal(config.tailwind.css, "app/globals.css");
    assert.deepEqual(config.aliases, {
      components: "@/components",
      ui: "@/components/ui",
      utils: "@/lib/utils",
    });
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

    assert.equal(result.exitCode, 0);
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
    assert.doesNotMatch(result.stderr, /at /);
    await assert.rejects(readFile(join(cwd, "components.json"), "utf8"));
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
    assert.doesNotMatch(result.stderr, /SyntaxError/);
    await assert.rejects(readFile(join(cwd, "components.json"), "utf8"));
  });

  it("fails when the project has no supported import alias", async () => {
    const cwd = await writeProject(
      nextProject({
        "tsconfig.json": `${JSON.stringify({ compilerOptions: { paths: {} } })}\n`,
      }),
    );
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /Could not find a supported import alias/);
    assert.doesNotMatch(result.stderr, /at /);
    await assert.rejects(readFile(join(cwd, "components.json"), "utf8"));
  });

  it("fails when the project is not Next.js", async () => {
    const cwd = await writeProject({
      "package.json": `${JSON.stringify({ dependencies: { react: "19.0.0" } })}\n`,
      "app/globals.css": '@import "tailwindcss";\n',
    });
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /Vinyaas currently supports Next\.js projects/);
    assert.match(result.stderr, /No Next\.js dependency was found/);
    await assert.rejects(readFile(join(cwd, "components.json"), "utf8"));
  });

  it("does not overwrite an existing components.json", async () => {
    const cwd = await writeProject({
      ...nextProject(),
      "components.json": '{"keep":true}\n',
    });
    const result = await run(cwd);

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /components\.json already exists/);
    assert.match(result.stderr, /will not overwrite it/);
    assert.equal(
      await readFile(join(cwd, "components.json"), "utf8"),
      '{"keep":true}\n',
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
      [entrypoint, "init", "--cwd", "./my-app"],
      {
        cwd: parent,
        env: {
          ...process.env,
          REGISTRY_BASE_URL: "https://vinyaas.vercel.app",
        },
      },
    );

    assert.match(result.stdout, /Created components\.json/);
    const config = JSON.parse(
      await readFile(join(project, "components.json"), "utf8"),
    );

    assert.equal(config.tailwind.css, "app/globals.css");
    await assert.rejects(readFile(join(parent, "components.json"), "utf8"));
  });

  it("does not overwrite components.json in the directory given by --cwd", async () => {
    const parent = await mkdtemp(join(tmpdir(), "vinyaas-init-cwd-"));
    const project = join(parent, "project-a");

    await Promise.all(
      Object.entries({
        ...nextProject(),
        "components.json": '{"keep":true}\n',
      }).map(async ([relativePath, contents]) => {
        const filePath = join(project, relativePath);
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, contents);
      }),
    );

    const result = await execFileAsync(
      process.execPath,
      [entrypoint, "init", "--cwd", "project-a"],
      { cwd: parent, env: process.env },
    ).then(
      (output) => ({ exitCode: 0, stderr: output.stderr }),
      (error) => ({
        exitCode: typeof error.code === "number" ? error.code : 1,
        stderr: typeof error.stderr === "string" ? error.stderr : "",
      }),
    );

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /components\.json already exists/);
    assert.match(result.stderr, /will not overwrite it/);
    assert.equal(
      await readFile(join(project, "components.json"), "utf8"),
      '{"keep":true}\n',
    );
  });
});
