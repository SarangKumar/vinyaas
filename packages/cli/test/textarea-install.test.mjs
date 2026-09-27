import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { resolveRegistryItems } from "../src/lib/registry/resolve.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const publicRoot = join(repoRoot, "apps/docs/public");
const cli = join(repoRoot, "packages/cli/dist/index.js");
const tsc = join(repoRoot, "node_modules/typescript/bin/tsc");

function serveRegistry() {
  const requested = [];
  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    requested.push(relative);

    if (relative.split("/").includes("..")) {
      response.writeHead(404);
      response.end();
      return;
    }

    try {
      const body = await readFile(join(publicRoot, relative));
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
        requested,
        baseUrl: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

function run(command, args, cwd, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
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

describe("installable textarea registry", () => {
  it(
    "installs textarea into an initialized project and the result typechecks",
    { timeout: 120_000 },
    async () => {
      const { server, requested, baseUrl } = await serveRegistry();
      const cwd = await mkdtemp(join(tmpdir(), "vinyaas-textarea-install-"));

      try {
        const items = await resolveRegistryItems({
          style: "new-york",
          name: "textarea",
          baseUrl,
        });

        assert.deepEqual(
          items.map((item) => item.name),
          ["textarea"],
        );
        assert.equal(items[0].registryDependencies, undefined);
        assert.deepEqual(items[0].dependencies, ["clsx", "tailwind-merge"]);

        await writeFile(
          join(cwd, "package.json"),
          `${JSON.stringify(
            {
              name: "vinyaas-textarea-consumer",
              private: true,
              dependencies: {
                next: "16.3.6",
                react: "19.2.8",
                "react-dom": "19.2.8",
                tailwindcss: "4.1.13",
              },
              devDependencies: {
                typescript: "5.9.3",
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
        await mkdir(join(cwd, "app"));
        await writeFile(
          join(cwd, "app/globals.css"),
          '@import "tailwindcss";\n',
        );
        await run("pnpm", ["install"], cwd);
        await run(process.execPath, [cli, "init"], cwd, {
          REGISTRY_BASE_URL: baseUrl,
        });
        const requestedBeforeAdd = requested.length;
        await run(process.execPath, [cli, "add", "textarea"], cwd, {
          REGISTRY_BASE_URL: baseUrl,
        });
        assert.deepEqual(requested.slice(requestedBeforeAdd), [
          "r/new-york/textarea.json",
        ]);
        await writeFile(
          join(cwd, "components/ui/textarea/example.tsx"),
          [
            'import { Textarea } from "@/components/ui/textarea/textarea";',
            "",
            "export function MessageField() {",
            "  return (",
            "    <Textarea",
            '      id="message"',
            '      name="message"',
            "      rows={4}",
            '      placeholder="Write a message"',
            "      required",
            '      defaultValue="Hello"',
            '      aria-label="Message"',
            '      className="max-w-sm"',
            "      onChange={() => {}}",
            "    />",
            "  );",
            "}",
            "",
          ].join("\n"),
        );

        const textarea = await readFile(
          join(cwd, "components/ui/textarea/textarea.tsx"),
          "utf8",
        );
        const utils = await readFile(join(cwd, "lib/utils.ts"), "utf8");
        const config = await readFile(join(cwd, "components.json"), "utf8");

        assert.match(textarea, /from "@\/lib\/utils"/);
        assert.match(utils, /export function cn/);
        assert.match(config, /"style": "new-york"/);
        assert.equal(
          requested.some((path) => path.endsWith("utils.json")),
          false,
        );
        await run(
          process.execPath,
          [tsc, "--noEmit", "-p", "tsconfig.json"],
          cwd,
        );
      } finally {
        server.close();
        await rm(cwd, { recursive: true, force: true });
      }
    },
  );
});
