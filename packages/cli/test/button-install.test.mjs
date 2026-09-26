import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { runAdd } from "../src/commands/add.ts";
import { resolveRegistryItems } from "../src/lib/registry/resolve.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const publicRoot = join(repoRoot, "apps/docs/public");
const tsc = join(repoRoot, "node_modules/typescript/bin/tsc");

function serveRegistry() {
  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");

    if (relative.split("/").includes("..")) {
      response.writeHead(404);
      response.end();
      return;
    }

    const file = join(publicRoot, relative);

    try {
      const body = await readFile(file);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end();
    }
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with ${code}`));
    });
  });
}

describe("installable button registry", () => {
  it(
    "installs utils before button and the result typechecks",
    { timeout: 120_000 },
    async () => {
      const { server, baseUrl } = await serveRegistry();
      const cwd = await mkdtemp(join(tmpdir(), "vinyas-button-install-"));
      const css = '@import "tailwindcss";\n';
      const logs = [];
      const originalLog = console.log;

      try {
        const items = await resolveRegistryItems({
          style: "new-york",
          name: "button",
          baseUrl,
        });

        assert.deepEqual(
          items.map((item) => item.name),
          ["utils", "button"],
        );
        assert.deepEqual(items[1].registryDependencies, ["utils"]);
        assert.equal(items[0].files[0]?.path, "lib/utils.ts");
        assert.match(items[0].files[0]?.content ?? "", /export function cn/);
        assert.equal(items[0].docs, undefined);
        assert.equal(items[0].envVars, undefined);
        assert.equal(items[1].docs, undefined);
        assert.equal(items[1].envVars, undefined);
        assert.equal(items[1].css, undefined);
        assert.equal(items[1].cssVars, undefined);

        await writeFile(
          join(cwd, "package.json"),
          `${JSON.stringify(
            {
              name: "vinyas-button-consumer",
              private: true,
              dependencies: {
                react: "19.2.8",
                "react-dom": "19.2.8",
              },
              devDependencies: {
                "@types/react": "^19.2.2",
                "@types/react-dom": "^19.2.2",
              },
            },
            null,
            2,
          )}\n`,
        );
        await writeFile(
          join(cwd, "tsconfig.json"),
          `${JSON.stringify(
            {
              compilerOptions: {
                target: "ES2022",
                module: "ESNext",
                moduleResolution: "bundler",
                jsx: "react-jsx",
                strict: true,
                skipLibCheck: true,
                noEmit: true,
                baseUrl: ".",
                paths: { "@/*": ["./*"] },
              },
              include: ["components/**/*.tsx", "lib/**/*.ts"],
            },
            null,
            2,
          )}\n`,
        );
        await writeFile(
          join(cwd, "components.json"),
          `${JSON.stringify(
            {
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
        await mkdir(join(cwd, "app"));
        await writeFile(join(cwd, "app/globals.css"), css);
        await run("pnpm", ["install"], cwd);

        console.log = (...args) => {
          logs.push(args.join(" "));
        };
        await runAdd({
          cwd,
          name: "button",
          env: { ...process.env, REGISTRY_BASE_URL: baseUrl },
        });
        console.log = originalLog;

        const output = logs.join("\n");
        const button = await readFile(
          join(cwd, "components/ui/button/button.tsx"),
          "utf8",
        );
        const utils = await readFile(join(cwd, "lib/utils.ts"), "utf8");
        const packageJson = JSON.parse(
          await readFile(join(cwd, "package.json"), "utf8"),
        );

        assert.match(output, /Added button/);
        assert.match(button, /from "@\/lib\/utils"/);
        assert.match(utils, /export function cn/);
        assert.equal(await readFile(join(cwd, "app/globals.css"), "utf8"), css);
        assert.doesNotMatch(output, /Documentation:/);
        assert.doesNotMatch(output, /Environment variables required:/);
        assert.deepEqual(packageJson.dependencies, {
          react: "19.2.8",
          "react-dom": "19.2.8",
          clsx: packageJson.dependencies.clsx,
          "tailwind-merge": packageJson.dependencies["tailwind-merge"],
          "class-variance-authority":
            packageJson.dependencies["class-variance-authority"],
        });
        assert.equal(Object.keys(packageJson.dependencies).length, 5);
        assert.ok(packageJson.dependencies.clsx);
        assert.ok(packageJson.dependencies["tailwind-merge"]);
        assert.ok(packageJson.dependencies["class-variance-authority"]);
        assert.equal(packageJson.devDependencies["@types/react"], "^19.2.2");
        await run(
          process.execPath,
          [tsc, "--noEmit", "-p", "tsconfig.json"],
          cwd,
        );
      } finally {
        console.log = originalLog;
        server.close();
        await rm(cwd, { recursive: true, force: true });
      }
    },
  );
});
