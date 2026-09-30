import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";

import { runInit } from "../src/commands/init.ts";

async function writeProject(files) {
  const cwd = await mkdtemp(join(tmpdir(), "vinyaas-init-deps-"));

  await Promise.all(
    Object.entries(files).map(async ([relativePath, contents]) => {
      const filePath = join(cwd, relativePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, contents);
    }),
  );

  return cwd;
}

describe("vinyaas init dependency install", () => {
  it("installs missing Tailwind and styling packages once", async () => {
    const cwd = await writeProject({
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
      "tsconfig.json": `${JSON.stringify(
        {
          compilerOptions: {
            paths: { "@/*": ["./*"] },
          },
        },
        null,
        2,
      )}\n`,
      "app/globals.css": '@import "tailwindcss";\n',
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    });

    const calls = [];
    const run = async (command) => {
      calls.push(command);
    };

    await runInit({
      cwd,
      env: { REGISTRY_BASE_URL: "https://vinyaas.vercel.app" },
      run,
    });

    assert.equal(calls.length, 2);
    assert.deepEqual(calls[0].args.slice(0, 1), ["add"]);
    assert.ok(calls[0].args.includes("clsx"));
    assert.ok(calls[0].args.includes("tailwind-merge"));
    assert.ok(calls[1].args.includes("-D"));
    assert.ok(
      calls[1].args.some((arg) => String(arg).startsWith("tailwindcss@")),
    );
    assert.ok(
      calls[1].args.some((arg) =>
        String(arg).startsWith("@tailwindcss/postcss@"),
      ),
    );

    const config = JSON.parse(
      await readFile(join(cwd, "components.json"), "utf8"),
    );
    assert.equal(config.tailwind.css, "app/globals.css");
  });

  it("does not reinstall packages that are already declared", async () => {
    const cwd = await writeProject({
      "package.json": `${JSON.stringify(
        {
          dependencies: {
            next: "16.0.0",
            react: "19.0.0",
            "react-dom": "19.0.0",
            clsx: "2.0.0",
            "tailwind-merge": "2.0.0",
          },
          devDependencies: {
            tailwindcss: "4.1.0",
            "@tailwindcss/postcss": "4.1.0",
          },
        },
        null,
        2,
      )}\n`,
      "tsconfig.json": `${JSON.stringify(
        {
          compilerOptions: {
            paths: { "@/*": ["./*"] },
          },
        },
        null,
        2,
      )}\n`,
      "app/globals.css": '@import "tailwindcss";\n',
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    });

    const calls = [];
    await runInit({
      cwd,
      env: { REGISTRY_BASE_URL: "https://vinyaas.vercel.app" },
      run: async (command) => {
        calls.push(command);
      },
    });

    assert.deepEqual(calls, []);
  });
});
