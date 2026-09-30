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
import { executeAdd, runAdd } from "../src/commands/add.ts";
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
  files = [{ path: "ui/button/index.tsx", content: buttonContent }],
  extra = {},
) {
  return {
    $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
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

async function writeFiles(root, files) {
  await Promise.all(
    Object.entries(files).map(async ([relativePath, contents]) => {
      const filePath = join(root, relativePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, contents);
    }),
  );
}

async function writeProject(files) {
  const cwd = await mkdtemp(join(tmpdir(), "vinyaas-add-"));

  await writeFiles(cwd, files);

  return cwd;
}

function consumerProject(extra = {}) {
  return {
    "components.json": `${JSON.stringify(componentsConfig, null, 2)}\n`,
    "tsconfig.json": aliasConfig,
    "package.json": packageJson,
    "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    "app/globals.css": cssContent,
    ...extra,
  };
}

let packageManagerCalls = [];

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

async function add(
  cwd,
  item,
  name = "button",
  runPackageManager,
  fetchImpl,
  force = false,
) {
  const logs = [];
  const original = console.log;
  packageManagerCalls = [];
  console.log = (...args) => {
    logs.push(args.join(" "));
  };

  try {
    const plan = await runAdd({
      cwd,
      name,
      force,
      env: { REGISTRY_BASE_URL: "http://localhost:3000" },
      fetch: fetchImpl ?? fetchItem(item),
      runPackageManager:
        runPackageManager ??
        (async (command) => {
          packageManagerCalls.push(command);
        }),
    });

    return { plan, stdout: logs.join("\n"), calls: packageManagerCalls };
  } finally {
    console.log = original;
  }
}

describe("vinyaas add", { concurrency: false }, () => {
  it("installs button at the path mapped from the ui alias", async () => {
    const cwd = await writeProject(consumerProject());
    const { stdout } = await add(cwd, buttonItem());
    const written = await readFile(
      join(cwd, "components/ui/button/index.tsx"),
      "utf8",
    );

    assert.equal(written, buttonContent);
    assert.match(stdout, /✓ Added components/);
    assert.match(stdout, /components\/ui\/button\/index\.tsx/);
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
      await readFile(join(cwd, "src/lib/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("skips an already-installed component without overwriting", async () => {
    const existing = "export const existing = true;\n";
    const cwd = await writeProject(
      consumerProject({
        "components/ui/button/index.tsx": existing,
      }),
    );
    const { plan, stdout } = await add(cwd, buttonItem());

    assert.deepEqual(plan.skipped, ["button"]);
    assert.equal(plan.entries.length, 0);
    assert.match(stdout, /Skipped/);
    assert.match(stdout, /• button \(already exists\)/);
    assert.match(stdout, /Use --force to overwrite/);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      existing,
    );
    assert.equal(packageManagerCalls.length, 0);
  });

  it("errors when only some files of a multi-file item already exist", async () => {
    const existing = "export const existing = true;\n";
    const cwd = await writeProject(
      consumerProject({
        "components/ui/button/index.tsx": existing,
      }),
    );
    const item = buttonItem([
      { path: "ui/card/index.tsx", content: "export function Card() {}\n" },
      { path: "ui/button/index.tsx", content: buttonContent },
    ]);

    await assert.rejects(
      () => add(cwd, item),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /File already exists:/);
        assert.match(error.message, /components\/ui\/button\/index\.tsx/);
        return true;
      },
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      existing,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/card/index.tsx"), "utf8"),
    );
    assert.equal(packageManagerCalls.length, 0);
  });

  it("resolves every file before writing", async () => {
    const cwd = await writeProject(consumerProject());
    const item = buttonItem([
      { path: "ui/button/index.tsx", content: buttonContent },
      { path: "../outside.ts", content: "export {};\n" },
    ]);

    await assert.rejects(() => add(cwd, item), /stay inside the project/);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
    assert.equal(packageManagerCalls.length, 0);
  });

  it("installs every file in a registry item", async () => {
    const cwd = await writeProject(consumerProject());
    const item = buttonItem([
      { path: "ui/button/index.tsx", content: buttonContent },
      { path: "components/card.tsx", content: "export function Card() {}\n" },
    ]);
    const { plan } = await add(cwd, item);

    assert.deepEqual(
      plan.entries.map((entry) => entry.destinationPath),
      ["components/ui/button/index.tsx", "components/card.tsx"],
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
          "components.json was not found.\nRun `vinyaas init` first.",
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
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
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

  it("installs lib/utils.ts where the utils alias resolves", async () => {
    const cwd = await writeProject(consumerProject());
    const utilsSource = "export function cn(...inputs) { return inputs; }\n";
    const catalog = fetchCatalog({
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: ["clsx", "tailwind-merge"],
        files: [{ path: "lib/utils.ts", content: utilsSource }],
      },
      button: buttonItem(undefined, { registryDependencies: ["utils"] }),
    });
    const { plan, calls } = await add(
      cwd,
      undefined,
      "button",
      undefined,
      catalog.fetch,
    );

    assert.deepEqual(
      plan.entries.map((entry) => entry.destinationPath),
      ["lib/utils.ts", "components/ui/button/index.tsx"],
    );
    assert.deepEqual(plan.dependencies, [
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
    ]);
    assert.equal(
      await readFile(join(cwd, "lib/utils.ts"), "utf8"),
      utilsSource,
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
    const installed = calls.flatMap((call) => call.args);
    assert.equal(installed.filter((arg) => arg === "clsx").length, 1);
    assert.equal(installed.filter((arg) => arg === "tailwind-merge").length, 1);
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
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("adds css variables and rules to the configured stylesheet", async () => {
    const cwd = await writeProject(consumerProject());

    await add(
      cwd,
      buttonItem([{ path: "ui/button/index.tsx", content: buttonContent }], {
        cssVars: {
          light: { "--primary": "222.2 47.4% 11.2%" },
          dark: { "--primary": "210 40% 98%" },
        },
        css: { ".button": "color: red;" },
      }),
    );

    const css = await readFile(join(cwd, "app/globals.css"), "utf8");

    assert.match(css, /:root\s*\{[^}]*--primary:\s*222\.2 47\.4% 11\.2%;/);
    assert.match(css, /prefers-color-scheme:\s*dark/);
    assert.match(css, /--primary:\s*210 40% 98%;/);
    assert.match(css, /\.button\s*\{[^}]*color:\s*red;/);
    assert.equal(
      (css.match(/--primary:\s*222\.2 47\.4% 11\.2%;/g) ?? []).length,
      1,
    );

    const { stdout } = await add(
      cwd,
      buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        {
          cssVars: {
            light: { "--primary": "222.2 47.4% 11.2%" },
            dark: { "--primary": "210 40% 98%" },
          },
          css: { ".button": "color: red;" },
        },
      ),
    );
    assert.match(stdout, /Skipped/);
    assert.match(stdout, /Use --force to overwrite/);
    assert.equal(await readFile(join(cwd, "app/globals.css"), "utf8"), css);
  });

  it("does not duplicate identical css when the declarations already exist", async () => {
    const existing = `${cssContent}\n:root {\n  --primary: 222.2 47.4% 11.2%;\n}\n\n.button {\n  color: red;\n}\n`;
    const cwd = await writeProject(
      consumerProject({
        "app/globals.css": existing,
      }),
    );

    await add(
      cwd,
      buttonItem([{ path: "ui/button/index.tsx", content: buttonContent }], {
        cssVars: { light: { "--primary": "222.2 47.4% 11.2%" } },
        css: { ".button": "color: red;" },
      }),
    );

    assert.equal(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      existing,
    );
  });

  it("does not install files or dependencies when css variables conflict", async () => {
    const existing = `${cssContent}\n:root {\n  --primary: existing-value;\n}\n`;
    const cwd = await writeProject(
      consumerProject({
        "app/globals.css": existing,
      }),
    );
    const calls = [];

    await assert.rejects(
      () =>
        add(
          cwd,
          buttonItem(
            [{ path: "ui/button/index.tsx", content: buttonContent }],
            {
              cssVars: { light: { "--primary": "registry-value" } },
            },
          ),
          "button",
          async (command) => {
            calls.push(command);
          },
        ),
      /CSS variable conflict:\n--primary already exists with a different value/,
    );
    assert.equal(calls.length, 0);
    assert.equal(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      existing,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("does not install files or dependencies when the css file is missing", async () => {
    const files = consumerProject();
    delete files["app/globals.css"];
    const cwd = await writeProject(files);
    const calls = [];

    await assert.rejects(
      () =>
        add(cwd, buttonItem(), "button", async (command) => {
          calls.push(command);
        }),
      /Configured CSS file does not exist:\napp\/globals\.css/,
    );
    assert.equal(calls.length, 0);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("reports a missing environment variable without changing .env", async () => {
    const envFile = "NEXT_PUBLIC_SITE_URL=https://example.com\n";
    const cwd = await writeProject(
      consumerProject({
        ".env": envFile,
      }),
    );
    const { stdout, calls } = await add(
      cwd,
      buttonItem([{ path: "ui/button/index.tsx", content: buttonContent }], {
        envVars: { OPENAI_API_KEY: "OpenAI API key" },
      }),
    );

    assert.match(stdout, /Environment variables required:/);
    assert.match(stdout, /OPENAI_API_KEY — OpenAI API key/);
    assert.match(stdout, /No environment files were modified/);
    assert.equal(await readFile(join(cwd, ".env"), "utf8"), envFile);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
    assert.equal(calls.length, 1);
  });

  it("reports a configured environment variable without its value", async () => {
    const envFile = "OPENAI_API_KEY=super-secret-value\n";
    const cwd = await writeProject(
      consumerProject({
        ".env": envFile,
      }),
    );
    const { stdout } = await add(
      cwd,
      buttonItem([{ path: "ui/button/index.tsx", content: buttonContent }], {
        dependencies: [],
        envVars: { OPENAI_API_KEY: "OpenAI API key" },
      }),
    );

    assert.match(stdout, /OPENAI_API_KEY already configured/);
    assert.match(stdout, /All required variables are already configured/);
    assert.doesNotMatch(stdout, /super-secret-value/);
    assert.doesNotMatch(stdout, /OPENAI_API_KEY=/);
    assert.equal(await readFile(join(cwd, ".env"), "utf8"), envFile);
  });

  it("does not install files or dependencies when environment variables conflict", async () => {
    const envFile = "UNRELATED=1\n";
    const cwd = await writeProject(consumerProject({ ".env": envFile }));
    const calls = [];
    const catalog = fetchCatalog({
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: ["clsx"],
        files: [{ path: "ui/utils.ts", content: "export const cn = true;\n" }],
        envVars: { API_URL: "Public API origin" },
      },
      button: buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        {
          registryDependencies: ["utils"],
          envVars: { API_URL: "Private API origin" },
        },
      ),
    });

    await assert.rejects(
      () =>
        add(
          cwd,
          undefined,
          "button",
          async (command) => {
            calls.push(command);
          },
          catalog.fetch,
        ),
      /Environment variable conflict:\nAPI_URL is declared differently by registry items "utils" and "button"/,
    );
    assert.equal(calls.length, 0);
    assert.equal(await readFile(join(cwd, ".env"), "utf8"), envFile);
    await assert.rejects(readFile(join(cwd, "components/ui/utils.ts"), "utf8"));
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("reports documentation urls from the registry graph", async () => {
    const cwd = await writeProject(consumerProject());
    const catalog = fetchCatalog({
      shared: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "shared",
        type: "registry:ui",
        dependencies: [],
        files: [
          { path: "ui/shared.ts", content: "export const shared = true;\n" },
        ],
        docs: "https://vinyaas.vercel.app/docs/components/shared",
      },
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: [],
        registryDependencies: ["shared"],
        files: [{ path: "ui/utils.ts", content: "export const cn = true;\n" }],
        docs: "https://vinyaas.vercel.app/docs/components/utils",
      },
      icon: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "icon",
        type: "registry:ui",
        dependencies: [],
        registryDependencies: ["shared"],
        files: [
          { path: "ui/icon.tsx", content: "export function Icon() {}\n" },
        ],
      },
      button: buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        {
          dependencies: [],
          registryDependencies: ["utils", "icon"],
          docs: "https://vinyaas.vercel.app/docs/components/button",
        },
      ),
    });
    const { stdout } = await add(cwd, null, "button", undefined, catalog.fetch);
    const documentation = stdout.split("Documentation:")[1] ?? "";

    assert.equal(catalog.counts.shared, 1);
    assert.match(stdout, /Documentation:/);
    assert.deepEqual(
      documentation
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.includes("—")),
      [
        "shared — https://vinyaas.vercel.app/docs/components/shared",
        "utils — https://vinyaas.vercel.app/docs/components/utils",
        "button — https://vinyaas.vercel.app/docs/components/button",
      ],
    );
    assert.equal((documentation.match(/shared —/g) ?? []).length, 1);
    assert.doesNotMatch(documentation, /icon —/);
  });

  it("does not install when a documentation url is invalid", async () => {
    const css = `${cssContent}`;
    const cwd = await writeProject(consumerProject({ "app/globals.css": css }));
    const calls = [];

    await assert.rejects(
      () =>
        add(
          cwd,
          buttonItem(undefined, {
            dependencies: ["clsx"],
            cssVars: { light: { "--primary": "0 0% 0%" } },
            docs: "javascript:alert(1)",
          }),
          "button",
          async (command) => {
            calls.push(command);
          },
        ),
      /Invalid documentation URL:\nbutton — javascript:alert\(1\)/,
    );
    assert.equal(calls.length, 0);
    assert.equal(await readFile(join(cwd, "app/globals.css"), "utf8"), css);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("does not report documentation when the component is already installed", async () => {
    const cwd = await writeProject(
      consumerProject({
        "components/ui/button/index.tsx": buttonContent,
      }),
    );
    const logs = [];
    const original = console.log;
    console.log = (...args) => {
      logs.push(args.join(" "));
    };

    try {
      const plan = await runAdd({
        cwd,
        name: "button",
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: fetchItem(
          buttonItem(undefined, {
            docs: "https://vinyaas.vercel.app/docs/components/button",
          }),
        ),
        runPackageManager: async () => {
          throw new Error("package manager should not run");
        },
      });

      assert.deepEqual(plan.skipped, ["button"]);
      assert.equal(plan.entries.length, 0);
    } finally {
      console.log = original;
    }

    assert.match(logs.join("\n"), /Skipped/);
    assert.equal(logs.join("\n").includes("Documentation:"), false);
  });

  it("installs a registry dependency before the requested item", async () => {
    const cwd = await writeProject(consumerProject());
    const catalog = fetchCatalog({
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: ["clsx"],
        files: [{ path: "ui/utils.ts", content: "export const cn = true;\n" }],
      },
      button: buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        {
          dependencies: ["clsx", "tailwind-merge"],
          registryDependencies: ["utils"],
        },
      ),
    });
    const { plan, calls } = await add(
      cwd,
      null,
      "button",
      undefined,
      catalog.fetch,
    );

    assert.deepEqual(plan.items, ["utils", "button"]);
    assert.deepEqual(plan.dependencies, ["clsx", "tailwind-merge"]);
    assert.deepEqual(calls[0].args, ["add", "clsx", "tailwind-merge"]);
    assert.equal(catalog.counts.utils, 1);
    assert.equal(
      await readFile(join(cwd, "components/ui/utils.ts"), "utf8"),
      "export const cn = true;\n",
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("fetches a shared registry dependency once and does not write partial files", async () => {
    const cwd = await writeProject(consumerProject());
    const catalog = fetchCatalog({
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: ["clsx"],
        files: [{ path: "ui/utils.ts", content: "export const cn = true;\n" }],
      },
      input: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "input",
        type: "registry:ui",
        dependencies: ["zod"],
        registryDependencies: ["utils"],
        files: [
          { path: "ui/input.tsx", content: "export function Input() {}\n" },
        ],
      },
      button: buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        { registryDependencies: ["utils", "input"] },
      ),
    });
    const { plan } = await add(cwd, null, "button", undefined, catalog.fetch);

    assert.deepEqual(plan.items, ["utils", "input", "button"]);
    assert.equal(catalog.counts.utils, 1);
    assert.equal(catalog.counts.input, 1);
    assert.equal(catalog.counts.button, 1);
    assert.deepEqual(plan.dependencies, [
      "clsx",
      "zod",
      "class-variance-authority",
      "tailwind-merge",
    ]);
  });

  it("fails a registry cycle before installing dependencies or files", async () => {
    const cwd = await writeProject(consumerProject());
    const catalog = fetchCatalog({
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: ["clsx"],
        registryDependencies: ["button"],
        files: [{ path: "ui/utils.ts", content: "export const cn = true;\n" }],
      },
      button: buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        { registryDependencies: ["utils"] },
      ),
    });
    const calls = [];

    await assert.rejects(
      () =>
        add(
          cwd,
          null,
          "button",
          async (command) => {
            calls.push(command);
          },
          catalog.fetch,
        ),
      (error) => {
        assert.match(
          error.message,
          /Registry dependency cycle detected:\nbutton -> utils -> button/,
        );
        return true;
      },
    );
    assert.equal(calls.length, 0);
    await assert.rejects(readFile(join(cwd, "components/ui/utils.ts"), "utf8"));
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("does not install files when a nested registry item is missing", async () => {
    const cwd = await writeProject(consumerProject());
    const catalog = fetchCatalog({
      button: buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        { registryDependencies: ["does-not-exist"] },
      ),
    });

    await assert.rejects(
      () => add(cwd, null, "button", undefined, catalog.fetch),
      /Registry item not found/,
    );
    assert.equal(packageManagerCalls.length, 0);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("skips an already-installed registry dependency and still installs the component", async () => {
    const cwd = await writeProject(
      consumerProject({
        "components/ui/utils.ts": "export const existing = true;\n",
      }),
    );
    const catalog = fetchCatalog({
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: ["clsx"],
        files: [{ path: "ui/utils.ts", content: "export const cn = true;\n" }],
      },
      button: buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        { registryDependencies: ["utils"] },
      ),
    });
    const calls = [];
    const { plan } = await add(
      cwd,
      null,
      "button",
      async (command) => {
        calls.push(command);
      },
      catalog.fetch,
    );

    assert.equal(plan.entries.length, 1);
    assert.equal(plan.entries[0].destinationPath, "components/ui/button/index.tsx");
    assert.equal(
      await readFile(join(cwd, "components/ui/utils.ts"), "utf8"),
      "export const existing = true;\n",
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
    assert.equal(calls.length, 1);
    assert.ok(calls[0].args.includes("clsx") || calls[0].args.includes("tailwind-merge"));
  });

  it("fails when two registry items resolve to the same file", async () => {
    const cwd = await writeProject(consumerProject());
    const catalog = fetchCatalog({
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: [],
        files: [{ path: "ui/shared.tsx", content: "export const a = 1;\n" }],
      },
      button: buttonItem(
        [{ path: "ui/shared.tsx", content: "export const b = 2;\n" }],
        {
          dependencies: [],
          registryDependencies: ["utils"],
        },
      ),
    });

    await assert.rejects(
      () => add(cwd, null, "button", undefined, catalog.fetch),
      /Multiple registry files resolve to the same destination:\ncomponents\/ui\/shared\.tsx/,
    );
    assert.equal(packageManagerCalls.length, 0);
    await assert.rejects(
      readFile(join(cwd, "components/ui/shared.tsx"), "utf8"),
    );
  });

  it("installs development dependencies from the registry graph once", async () => {
    const cwd = await writeProject(consumerProject());
    const catalog = fetchCatalog({
      testing: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "testing",
        type: "registry:ui",
        dependencies: [],
        devDependencies: ["vitest", "prettier"],
        files: [
          { path: "ui/testing.ts", content: "export const test = true;\n" },
        ],
      },
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: [],
        devDependencies: ["prettier"],
        registryDependencies: ["testing"],
        files: [{ path: "ui/utils.ts", content: "export const cn = true;\n" }],
      },
      icon: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "icon",
        type: "registry:ui",
        dependencies: [],
        registryDependencies: ["testing"],
        files: [
          { path: "ui/icon.tsx", content: "export function Icon() {}\n" },
        ],
      },
      button: buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        {
          dependencies: ["clsx"],
          registryDependencies: ["utils", "icon"],
          envVars: { OPENAI_API_KEY: "OpenAI API key" },
        },
      ),
    });
    const { plan, stdout, calls } = await add(
      cwd,
      null,
      "button",
      undefined,
      catalog.fetch,
    );

    assert.deepEqual(plan.items, ["testing", "utils", "icon", "button"]);
    assert.deepEqual(plan.dependencies, ["clsx"]);
    assert.deepEqual(plan.devDependencies, ["vitest", "prettier"]);
    assert.equal(catalog.counts.testing, 1);
    assert.deepEqual(
      calls.map((call) => call.args),
      [
        ["add", "clsx"],
        ["add", "-D", "vitest", "prettier"],
      ],
    );
    assert.match(
      stdout,
      /Dependencies\n✓ clsx\n✓ prettier\n✓ vitest/,
    );
    assert.match(stdout, /OPENAI_API_KEY — OpenAI API key/);
    assert.equal(
      await readFile(join(cwd, "components/ui/testing.ts"), "utf8"),
      "export const test = true;\n",
    );
  });

  it("fails before installing when a package is both a dependency and a devDependency", async () => {
    const css = `${cssContent}\n`;
    const cwd = await writeProject(
      consumerProject({
        "app/globals.css": css,
        ".env": "UNRELATED=1\n",
      }),
    );
    const calls = [];
    const catalog = fetchCatalog({
      utils: {
        $schema: "https://vinyaas.vercel.app/schema/registry-item.json",
        name: "utils",
        type: "registry:ui",
        dependencies: [],
        devDependencies: ["foo"],
        files: [{ path: "ui/utils.ts", content: "export const cn = true;\n" }],
        cssVars: { light: { "--primary": "0 0% 0%" } },
      },
      button: buttonItem(
        [{ path: "ui/button/index.tsx", content: buttonContent }],
        {
          dependencies: ["foo"],
          registryDependencies: ["utils"],
        },
      ),
    });

    await assert.rejects(
      () =>
        add(
          cwd,
          null,
          "button",
          async (command) => {
            calls.push(command);
          },
          catalog.fetch,
        ),
      /Dependency type conflict:\nfoo is declared as both a dependency and a devDependency/,
    );
    assert.equal(calls.length, 0);
    assert.equal(await readFile(join(cwd, "app/globals.css"), "utf8"), css);
    assert.equal(await readFile(join(cwd, ".env"), "utf8"), "UNRELATED=1\n");
    await assert.rejects(readFile(join(cwd, "components/ui/utils.ts"), "utf8"));
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("does not install development dependencies when runtime installation fails", async () => {
    const cwd = await writeProject(consumerProject());
    const calls = [];

    await assert.rejects(
      () =>
        add(
          cwd,
          buttonItem(undefined, {
            dependencies: ["clsx"],
            devDependencies: ["prettier"],
          }),
          "button",
          async (command) => {
            calls.push(command.args);
            throw new CliError("Dependency installation failed.");
          },
        ),
      /Dependency installation failed/,
    );
    assert.deepEqual(calls, [["add", "clsx"]]);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("does not write files when development dependency installation fails", async () => {
    const css = '@import "tailwindcss";\n';
    const cwd = await writeProject(consumerProject({ "app/globals.css": css }));
    const calls = [];

    await assert.rejects(
      () =>
        add(
          cwd,
          buttonItem(
            [{ path: "ui/button/index.tsx", content: buttonContent }],
            {
              dependencies: ["clsx"],
              devDependencies: ["prettier"],
              cssVars: { light: { "--primary": "0 0% 0%" } },
            },
          ),
          "button",
          async (command) => {
            calls.push(command.args);
            if (command.args.includes("-D")) {
              throw new CliError(
                "Dependency installation failed.\npnpm add -D prettier exited with status 1.",
              );
            }
          },
        ),
      /Dependency installation failed/,
    );
    assert.deepEqual(calls, [
      ["add", "clsx"],
      ["add", "-D", "prettier"],
    ]);
    assert.equal(await readFile(join(cwd, "app/globals.css"), "utf8"), css);
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("installs only dependencies that package.json does not already declare", async () => {
    const manifest = `${JSON.stringify(
      {
        name: "consumer",
        dependencies: { clsx: "^2.1.0" },
        devDependencies: { prettier: "^3.0.0" },
      },
      null,
      2,
    )}\n`;
    const cwd = await writeProject(
      consumerProject({
        "package.json": manifest,
      }),
    );
    const { stdout, calls } = await add(
      cwd,
      buttonItem(undefined, {
        dependencies: ["clsx", "tailwind-merge", "class-variance-authority"],
        devDependencies: ["prettier"],
        cssVars: { light: { "--primary": "1 2% 3%" } },
      }),
    );

    assert.deepEqual(
      calls.map((call) => call.args),
      [["add", "tailwind-merge", "class-variance-authority"]],
    );
    assert.match(stdout, /Dependencies/);
    assert.match(stdout, /✓ clsx/);
    assert.match(stdout, /✓ prettier/);
    assert.doesNotMatch(stdout, /\^2\.1\.0/);
    assert.doesNotMatch(stdout, /\^3\.0\.0/);
    assert.equal(await readFile(join(cwd, "package.json"), "utf8"), manifest);
    assert.match(
      await readFile(join(cwd, "app/globals.css"), "utf8"),
      /--primary:\s*1 2% 3%/,
    );
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("does not run the package manager when every dependency is declared", async () => {
    const files = consumerProject();
    delete files["pnpm-lock.yaml"];
    const manifest = `${JSON.stringify(
      {
        name: "consumer",
        dependencies: {
          "class-variance-authority": "^0.7.0",
          clsx: "^2.1.0",
          "tailwind-merge": "^2.0.0",
        },
      },
      null,
      2,
    )}\n`;
    const cwd = await writeProject({
      ...files,
      "package.json": manifest,
    });
    const calls = [];

    await add(cwd, buttonItem(), "button", async (command) => {
      calls.push(command);
    });

    assert.equal(calls.length, 0);
    assert.equal(await readFile(join(cwd, "package.json"), "utf8"), manifest);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("does not install files when package.json is invalid", async () => {
    const cwd = await writeProject(
      consumerProject({
        "package.json": "{\n",
      }),
    );
    const calls = [];

    await assert.rejects(
      () =>
        add(cwd, buttonItem(), "button", async (command) => {
          calls.push(command);
        }),
      /Could not read package\.json/,
    );
    assert.equal(calls.length, 0);
    assert.equal(await readFile(join(cwd, "package.json"), "utf8"), "{\n");
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("reads package.json from the project selected by --cwd", async () => {
    const parent = await mkdtemp(join(tmpdir(), "vinyaas-declared-"));
    const projectA = join(parent, "project-a");
    const projectB = join(parent, "project-b");
    const manifestA = `${JSON.stringify(
      { name: "project-a", dependencies: { clsx: "^2.1.0" } },
      null,
      2,
    )}\n`;

    await writeFiles(
      projectA,
      consumerProject({
        "package.json": manifestA,
      }),
    );
    await writeFiles(projectB, consumerProject());

    const calls = [];
    const original = console.log;
    console.log = () => {};

    try {
      await executeAdd({
        name: "button",
        cwd: "project-a",
        from: parent,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: fetchItem(
          buttonItem(undefined, {
            dependencies: ["clsx", "tailwind-merge"],
          }),
        ),
        runPackageManager: async (command) => {
          calls.push(command);
        },
      });
    } finally {
      console.log = original;
    }

    assert.equal(calls.length, 1);
    assert.equal(calls[0].cwd, projectA);
    assert.deepEqual(calls[0].args, ["add", "tailwind-merge"]);
    assert.equal(calls[0].args.includes("--force"), false);
    assert.equal(
      await readFile(join(projectA, "package.json"), "utf8"),
      manifestA,
    );
  });

  it("does not change dependency skipping when --force replaces a file", async () => {
    const manifest = `${JSON.stringify(
      { name: "consumer", dependencies: { clsx: "^2.1.0" } },
      null,
      2,
    )}\n`;
    const cwd = await writeProject(
      consumerProject({
        "package.json": manifest,
        "components/ui/button/index.tsx": "// local modification\n",
      }),
    );
    const { calls } = await add(
      cwd,
      buttonItem(undefined, { dependencies: ["clsx"] }),
      "button",
      undefined,
      undefined,
      true,
    );

    assert.equal(calls.length, 0);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
    assert.equal(await readFile(join(cwd, "package.json"), "utf8"), manifest);
  });

  it("installs button dependencies with pnpm in the consumer project", async () => {
    const cwd = await writeProject(consumerProject());
    const { calls } = await add(cwd, buttonItem());

    assert.equal(calls.length, 1);
    assert.equal(calls[0].command, "pnpm");
    assert.deepEqual(calls[0].args, [
      "add",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ]);
    assert.equal(calls[0].cwd, cwd);
    assert.equal(
      calls[0].args.join(" ").includes("class-variance-authority clsx"),
      true,
    );
    assert.notEqual(calls[0].args.length, 1);
  });

  it("does not install dependencies when the registry list is empty", async () => {
    const cwd = await writeProject(consumerProject());
    const calls = [];

    await add(
      cwd,
      buttonItem(undefined, { dependencies: [] }),
      "button",
      async (command) => {
        calls.push(command);
      },
    );

    assert.equal(calls.length, 0);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("skips dependency installation when the component is already installed", async () => {
    const cwd = await writeProject(
      consumerProject({
        "components/ui/button/index.tsx": buttonContent,
      }),
    );
    const calls = [];
    const { plan, stdout } = await add(
      cwd,
      buttonItem(),
      "button",
      async (command) => {
        calls.push(command);
      },
    );

    assert.deepEqual(plan.skipped, ["button"]);
    assert.equal(plan.entries.length, 0);
    assert.equal(calls.length, 0);
    assert.match(stdout, /Use --force to overwrite/);
  });

  it("fails when the consumer project has no lockfile", async () => {
    const files = consumerProject();
    delete files["pnpm-lock.yaml"];
    const cwd = await writeProject(files);

    await assert.rejects(
      () => add(cwd, buttonItem()),
      /No package manager lockfile was found/,
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
    assert.equal(packageManagerCalls.length, 0);
  });

  it("fails when the consumer project has multiple lockfiles", async () => {
    const cwd = await writeProject(
      consumerProject({
        "package-lock.json": "{}\n",
      }),
    );

    await assert.rejects(
      () => add(cwd, buttonItem()),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(
          error.message,
          /Multiple package manager lockfiles were found/,
        );
        assert.match(error.message, /pnpm-lock\.yaml/);
        assert.match(error.message, /package-lock\.json/);
        return true;
      },
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("does not install files when dependency installation fails", async () => {
    const cwd = await writeProject(consumerProject());

    await assert.rejects(
      () =>
        add(cwd, buttonItem(), "button", async () => {
          throw new CliError(
            "Dependency installation failed.\npnpm add class-variance-authority clsx tailwind-merge exited with status 1.",
          );
        }),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /Dependency installation failed/);
        assert.match(error.message, /exited with status 1/);
        return true;
      },
    );
    await assert.rejects(
      readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("runs the package manager in the directory given by --cwd", async () => {
    const parent = await mkdtemp(join(tmpdir(), "vinyaas-cwd-"));
    const projectA = join(parent, "project-a");
    const calls = [];

    await writeFiles(projectA, consumerProject());
    const original = console.log;
    console.log = () => {};

    try {
      await executeAdd({
        name: "button",
        cwd: "project-a",
        from: parent,
        env: { REGISTRY_BASE_URL: "http://localhost:3000" },
        fetch: fetchItem(buttonItem()),
        runPackageManager: async (command) => {
          calls.push(command);
        },
      });
    } finally {
      console.log = original;
    }

    assert.equal(calls.length, 1);
    assert.equal(calls[0].cwd, projectA);
    assert.equal(calls[0].command, "pnpm");
    assert.equal(
      await readFile(join(projectA, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
    await assert.rejects(
      readFile(join(parent, "components/ui/button/index.tsx"), "utf8"),
    );
  });

  it("installs into the project selected by --cwd and leaves the other project unchanged", async () => {
    const item = buttonItem(undefined, {
      dependencies: [],
      cssVars: { light: { "--primary": "1 2% 3%" } },
      envVars: { OPENAI_API_KEY: "OpenAI API key" },
      docs: "https://vinyaas.vercel.app/docs/components/button",
    });
    const requests = [];
    const server = createServer((request, response) => {
      requests.push(request.url);
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
    const parent = await mkdtemp(join(tmpdir(), "vinyaas-cwd-"));
    const projectA = join(parent, "project-a");
    const projectB = join(parent, "project-b");
    const envA = "OPENAI_API_KEY=secret-a\n";
    const envB = "OPENAI_API_KEY=secret-b\n";

    await writeFiles(projectA, consumerProject({ ".env": envA }));
    await writeFiles(projectB, consumerProject({ ".env": envB }));
    await writeFile(join(parent, "not-a-directory"), "file\n");

    try {
      const missing = await runCli(
        parent,
        ["add", "button", "--cwd", "missing"],
        {
          REGISTRY_BASE_URL: `http://127.0.0.1:${address.port}`,
        },
      );

      assert.notEqual(missing.exitCode, 0);
      assert.match(
        missing.stderr,
        /Project directory does not exist:\nmissing/,
      );
      assert.deepEqual(requests, []);

      const fileCwd = await runCli(
        parent,
        ["add", "button", "--cwd", "not-a-directory"],
        { REGISTRY_BASE_URL: `http://127.0.0.1:${address.port}` },
      );

      assert.notEqual(fileCwd.exitCode, 0);
      assert.match(
        fileCwd.stderr,
        /Project path is not a directory:\nnot-a-directory/,
      );
      assert.deepEqual(requests, []);

      const first = await runCli(
        parent,
        ["add", "button", "--cwd", "project-a"],
        { REGISTRY_BASE_URL: `http://127.0.0.1:${address.port}` },
      );

      assert.equal(first.exitCode, 0);
      assert.match(first.stdout, /✓ Added components/);
      assert.match(first.stdout, /OPENAI_API_KEY already configured/);
      assert.doesNotMatch(first.stdout, /secret-a/);
      assert.doesNotMatch(first.stdout, /secret-b/);
      assert.match(
        first.stdout,
        /button — https:\/\/vinyaas\.vercel\.app\/docs\/components\/button/,
      );
      assert.match(
        await readFile(join(projectA, "app/globals.css"), "utf8"),
        /--primary:\s*1 2% 3%/,
      );
      assert.equal(
        await readFile(
          join(projectA, "components/ui/button/index.tsx"),
          "utf8",
        ),
        buttonContent,
      );
      assert.equal(await readFile(join(projectA, ".env"), "utf8"), envA);
      assert.equal(
        await readFile(join(projectB, "app/globals.css"), "utf8"),
        cssContent,
      );
      assert.equal(await readFile(join(projectB, ".env"), "utf8"), envB);
      await assert.rejects(
        readFile(join(projectB, "components/ui/button/index.tsx"), "utf8"),
      );

      const second = await runCli(
        parent,
        ["add", "--cwd", "./project-b", "button"],
        { REGISTRY_BASE_URL: `http://127.0.0.1:${address.port}` },
      );

      assert.equal(second.exitCode, 0);
      assert.doesNotMatch(second.stdout, /secret-b/);
      assert.equal(
        await readFile(
          join(projectB, "components/ui/button/index.tsx"),
          "utf8",
        ),
        buttonContent,
      );
      assert.equal(
        await readFile(
          join(projectA, "components/ui/button/index.tsx"),
          "utf8",
        ),
        buttonContent,
      );
      assert.deepEqual(requests, [
        "/r/new-york/button.json",
        "/r/new-york/button.json",
      ]);
    } finally {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  it("does not pass --force to the package manager", async () => {
    const cwd = await writeProject(
      consumerProject({
        "components/ui/button/index.tsx": "// local modification\n",
      }),
    );
    const { calls } = await add(
      cwd,
      buttonItem(),
      "button",
      undefined,
      undefined,
      true,
    );

    assert.equal(calls.length, 1);
    assert.equal(calls[0].args.includes("--force"), false);
    assert.deepEqual(calls[0].args, [
      "add",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ]);
    assert.equal(
      await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
      buttonContent,
    );
  });

  it("replaces a local modification only when --force is set", async () => {
    const item = buttonItem(undefined, { dependencies: [] });
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
    const env = { REGISTRY_BASE_URL: `http://127.0.0.1:${address.port}` };

    try {
      const installed = await runCli(cwd, ["add", "button"], env);

      assert.equal(installed.exitCode, 0);
      await writeFile(
        join(cwd, "components/ui/button/index.tsx"),
        "// local modification\n",
      );

      const blocked = await runCli(cwd, ["add", "button"], env);

      assert.equal(blocked.exitCode, 0);
      assert.match(blocked.stdout, /Skipped/);
      assert.match(blocked.stdout, /Use --force to overwrite/);
      assert.equal(
        await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
        "// local modification\n",
      );

      const replaced = await runCli(cwd, ["add", "--force", "button"], env);

      assert.equal(replaced.exitCode, 0);
      assert.equal(
        await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
        buttonContent,
      );

      const again = await runCli(cwd, ["add", "button", "--force"], env);

      assert.equal(again.exitCode, 0);
      assert.equal(
        await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
        buttonContent,
      );
    } finally {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  it("installs button through the built CLI", async () => {
    const item = buttonItem(undefined, { dependencies: [] });
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
      assert.match(result.stdout, /✓ Added components/);
      assert.equal(
        await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
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

      assert.equal(again.exitCode, 0);
      assert.match(again.stdout, /Skipped/);
      assert.match(again.stdout, /• button \(already exists\)/);
      assert.match(again.stdout, /Use --force to overwrite/);
      assert.equal(
        await readFile(join(cwd, "components/ui/button/index.tsx"), "utf8"),
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
    assert.match(result.stderr, /vinyaas init/);
    assert.doesNotMatch(result.stderr, /at /);
  });
});
