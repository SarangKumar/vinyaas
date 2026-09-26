import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { ComponentsConfigError } from "../../../config/components.ts";
import { runAdd } from "../src/commands/add.ts";
import { CliError } from "../src/lib/cli-error.ts";

const execFileAsync = promisify(execFile);
const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const entrypoint = join(packageRoot, "dist/index.js");

const buttonContent = "export function Button() { return null; }\n";
const cssContent = '@import "tailwindcss";\n';
const packageJson = `${JSON.stringify({ name: "consumer", dependencies: {} }, null, 2)}\n`;

const aliasConfig = `{
  "compilerOptions": {
    // Consumer import alias.
    "paths": {
      "@/*": ["./*"],
    },
  },
}
`;

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

function buttonItem(
  files = [{ path: "ui/button/button.tsx", content: buttonContent }],
  extra = {},
) {
  return {
    $schema: "https://vinyas.vercel.app/schema/registry-item.json",
    name: "button",
    type: "registry:ui",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    files,
    ...extra,
  };
}

function fetchItem(item) {
  return async () => ({
    ok: true,
    status: 200,
    async json() {
      return item;
    },
  });
}

async function writeProject(files) {
  const cwd = await mkdtemp(join(tmpdir(), "vinyas-add-"));

  await Promise.all(
    Object.entries(files).map(async ([relativePath, contents]) => {
      const filePath = join(cwd, relativePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, contents);
    }),
  );

  return cwd;
}

function consumerProject(extra = {}) {
  return {
    "components.json": `${JSON.stringify(componentsConfig, null, 2)}\n`,
    "tsconfig.json": aliasConfig,
    "package.json": packageJson,
    "app/globals.css": cssContent,
    ...extra,
  };
}

function runCli(cwd, args, env) {
  return execFileAsync(process.execPath, [entrypoint, ...args], {
    cwd,
    env: { ...process.env, ...env },
  }).then(
    (output) => ({
      stdout: output.stdout,
      stderr: output.stderr,
      exitCode: 0,
    }),
    (error) => ({
      stdout: typeof error.stdout === "string" ? error.stdout : "",
      stderr: typeof error.stderr === "string" ? error.stderr : "",
      exitCode: typeof error.code === "number" ? error.code : 1,
    }),
  );
}

async function add(cwd, item, name = "button") {
  const logs = [];
  const original = console.log;
  console.log = (...args) => {
    logs.push(args.join(" "));
  };

  try {
    const plan = await runAdd({
      cwd,
      name,
      env: { REGISTRY_BASE_URL: "http://localhost:3000" },
      fetch: fetchItem(item),
    });

    return { plan, stdout: logs.join("\n") };
  } finally {
    console.log = original;
  }
}

describe("vinyas add", { concurrency: false }, () => {
  it("installs button at the path mapped from the ui alias", async () => {
    const cwd = await writeProject(consumerProject());
    const { stdout } = await add(cwd, buttonItem());
    const written = await readFile(
      join(cwd, "components/ui/button/button.tsx"),
      "utf8",
    );

    assert.equal(written, buttonContent);
    assert.match(stdout, /^Added button\./);
    assert.match(stdout, /components\/ui\/button\/button\.tsx/);
    assert.match(stdout, /class-variance-authority/);
    assert.match(stdout, /clsx/);
    assert.match(stdout, /tailwind-merge/);
    assert.equal(
      await readFile(join(cwd, "package.json"), "utf8"),
      packageJson,
    );
    assert.equal(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      cssContent,
    );
  });

  it("maps the ui alias from the project paths instead of a fixed directory", async () => {
    const config = {
      ...componentsConfig,
      aliases: { ...componentsConfig.aliases, ui: "@/lib/ui" },
    };
    const cwd = await writeProject(
      consumerProject({
        "components.json": `${JSON.stringify(config, null, 2)}\n`,
        "tsconfig.json": `{
          "compilerOptions": {
            "paths": { "@/*": ["./src/*"] }
          }
        }
        `,
      }),
    );

    await add(cwd, buttonItem());

    assert.equal(
      await readFile(join(cwd, "src/lib/ui/button/button.tsx"), "utf8"),
      buttonContent,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
    );
  });

  it("does not overwrite an existing file or create later files", async () => {
    const existing = "export const existing = true;\n";
    const cwd = await writeProject(
      consumerProject({
        "components/ui/button/button.tsx": existing,
      }),
    );
    const item = buttonItem([
      { path: "ui/card/card.tsx", content: "export function Card() {}\n" },
      { path: "ui/button/button.tsx", content: buttonContent },
    ]);

    await assert.rejects(
      () => add(cwd, item),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /File already exists:/);
        assert.match(error.message, /components\/ui\/button\/button\.tsx/);
        return true;
      },
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
      existing,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/card/card.tsx"), "utf8"),
    );
  });

  it("resolves every file before writing", async () => {
    const cwd = await writeProject(consumerProject());
    const item = buttonItem([
      { path: "ui/button/button.tsx", content: buttonContent },
      { path: "../outside.ts", content: "export {};\n" },
    ]);

    await assert.rejects(() => add(cwd, item), /stay inside the project/);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
    );
  });

  it("installs every file in a registry item", async () => {
    const cwd = await writeProject(consumerProject());
    const item = buttonItem([
      { path: "ui/button/button.tsx", content: buttonContent },
      { path: "components/card.tsx", content: "export function Card() {}\n" },
    ]);
    const { plan } = await add(cwd, item);

    assert.deepEqual(
      plan.entries.map((entry) => entry.destinationPath),
      ["components/ui/button/button.tsx", "components/card.tsx"],
    );
    assert.equal(
      await readFile(join(cwd, "components/card.tsx"), "utf8"),
      "export function Card() {}\n",
    );
  });

  it("fails when components.json is missing", async () => {
    const cwd = await writeProject({ "tsconfig.json": aliasConfig });

    await assert.rejects(
      () => add(cwd, buttonItem()),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.equal(
          error.message,
          "components.json was not found.\nRun `vinyas init` first.",
        );
        return true;
      },
    );
  });

  it("fails when the ui alias is missing", async () => {
    const config = {
      ...componentsConfig,
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
      },
    };
    const cwd = await writeProject(
      consumerProject({
        "components.json": `${JSON.stringify(config, null, 2)}\n`,
      }),
    );

    await assert.rejects(
      () => add(cwd, buttonItem()),
      (error) => {
        assert.ok(error instanceof ComponentsConfigError);
        assert.match(error.message, /aliases is missing ui/);
        return true;
      },
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
    );
  });

  it("reports an invalid components.json through the config parser", async () => {
    const cwd = await writeProject(
      consumerProject({
        "components.json": `${JSON.stringify({ style: "nope" })}\n`,
      }),
    );

    await assert.rejects(() => add(cwd, buttonItem()), ComponentsConfigError);
  });

  it("rejects an unsupported registry namespace", async () => {
    const cwd = await writeProject(consumerProject());

    await assert.rejects(
      () =>
        add(
          cwd,
          buttonItem([{ path: "unknown/button.tsx", content: buttonContent }]),
        ),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /unsupported namespace/);
        assert.match(error.message, /unknown\/button\.tsx/);
        return true;
      },
    );
  });

  it("rejects registry paths that escape the project", async () => {
    const cwd = await writeProject(consumerProject());

    for (const registryPath of [
      "../outside.ts",
      "../../outside.ts",
      "/etc/passwd",
    ]) {
      await assert.rejects(
        () => add(cwd, buttonItem([{ path: registryPath, content: "nope\n" }])),
        /stay inside the project/,
      );
    }

    await assert.rejects(
      () =>
        add(
          cwd,
          buttonItem([
            { path: "ui/foo/../../../outside.ts", content: "nope\n" },
          ]),
        ),
      /stay inside the project/,
    );
  });

  it("rejects an alias that normalizes outside the project", async () => {
    const cwd = await writeProject(
      consumerProject({
        "tsconfig.json": `{
          "compilerOptions": {
            "paths": { "@/*": ["../outside/*"] }
          }
        }
        `,
      }),
    );

    await assert.rejects(
      () => add(cwd, buttonItem()),
      /Could not safely map "@\/components\/ui"/,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
    );
  });

  it("leaves css unchanged when the registry item includes css metadata", async () => {
    const cwd = await writeProject(consumerProject());

    await add(
      cwd,
      buttonItem([{ path: "ui/button/button.tsx", content: buttonContent }], {
        cssVars: { light: { background: "0 0% 100%" } },
        css: { ".button": "color: red;" },
      }),
    );

    assert.equal(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      cssContent,
    );
  });

  it("reports registry dependencies without installing them", async () => {
    const cwd = await writeProject(consumerProject());
    const { stdout, plan } = await add(
      cwd,
      buttonItem([{ path: "ui/button/button.tsx", content: buttonContent }], {
        registryDependencies: ["dialog"],
      }),
    );

    assert.deepEqual(plan.registryDependencies, ["dialog"]);
    assert.match(
      stdout,
      /Registry dependencies were not installed:\n {2}dialog/,
    );
    assert.equal(
      await readFile(join(cwd, "package.json"), "utf8"),
      packageJson,
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("installs button through the built CLI", async () => {
    const item = buttonItem();
    const server = createServer((request, response) => {
      if (request.url === "/r/new-york/button.json") {
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify(item));
        return;
      }

      response.writeHead(404);
      response.end();
    });

    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();
    const cwd = await writeProject(consumerProject());

    try {
      const result = await runCli(cwd, ["add", "button"], {
        REGISTRY_BASE_URL: `http://127.0.0.1:${address.port}`,
      });

      assert.equal(result.exitCode, 0);
      assert.match(result.stdout, /Added button\./);
      assert.equal(
        await readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
        buttonContent,
      );
      assert.equal(
        await readFile(join(cwd, "package.json"), "utf8"),
        packageJson,
      );
      assert.equal(
        await readFile(join(cwd, "app/globals.css"), "utf8"),
        cssContent,
      );

      const again = await runCli(cwd, ["add", "button"], {
        REGISTRY_BASE_URL: `http://127.0.0.1:${address.port}`,
      });

      assert.notEqual(again.exitCode, 0);
      assert.match(again.stderr, /File already exists:/);
      assert.match(again.stderr, /components\/ui\/button\/button\.tsx/);
      assert.equal(
        await readFile(join(cwd, "components/ui/button/button.tsx"), "utf8"),
        buttonContent,
      );
    } finally {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  it("prints a clean error when the built command has no components.json", async () => {
    const cwd = await writeProject({});
    const result = await runCli(cwd, ["add", "button"], {
      REGISTRY_BASE_URL: "http://localhost:3000",
    });

    assert.notEqual(result.exitCode, 0);
    assert.match(result.stderr, /components\.json was not found/);
    assert.match(result.stderr, /vinyas init/);
    assert.doesNotMatch(result.stderr, /at /);
  });
});
