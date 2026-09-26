import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { CliError } from "../src/lib/cli-error.ts";
import { detectPackageManager } from "../src/lib/package-manager/detect.ts";
import {
  installDependencies,
  runPackageManager,
} from "../src/lib/package-manager/install.ts";

async function project(files) {
  const cwd = await mkdtemp(join(tmpdir(), "vinyas-pm-"));

  await Promise.all(
    Object.entries(files).map(([name, contents]) =>
      writeFile(join(cwd, name), contents),
    ),
  );

  return cwd;
}

describe("package manager detection", () => {
  it("detects pnpm from pnpm-lock.yaml", async () => {
    const cwd = await project({ "pnpm-lock.yaml": "lockfileVersion: '9.0'\n" });

    assert.equal(await detectPackageManager(cwd), "pnpm");
  });

  it("detects yarn from yarn.lock", async () => {
    const cwd = await project({ "yarn.lock": "# yarn\n" });

    assert.equal(await detectPackageManager(cwd), "yarn");
  });

  it("detects npm from package-lock.json", async () => {
    const cwd = await project({ "package-lock.json": "{}\n" });

    assert.equal(await detectPackageManager(cwd), "npm");
  });

  it("detects bun from bun.lock", async () => {
    const cwd = await project({ "bun.lock": "{}\n" });

    assert.equal(await detectPackageManager(cwd), "bun");
  });

  it("detects bun from bun.lockb", async () => {
    const cwd = await project({ "bun.lockb": "binary\n" });

    assert.equal(await detectPackageManager(cwd), "bun");
  });

  it("fails when no lockfile exists", async () => {
    const cwd = await project({ "package.json": "{}\n" });

    await assert.rejects(detectPackageManager(cwd), (error) => {
      assert.ok(error instanceof CliError);
      assert.match(error.message, /No package manager lockfile was found/);
      assert.match(error.message, /pnpm-lock\.yaml/);
      return true;
    });
  });

  it("fails when multiple lockfiles exist", async () => {
    const cwd = await project({
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
      "package-lock.json": "{}\n",
    });

    await assert.rejects(detectPackageManager(cwd), (error) => {
      assert.ok(error instanceof CliError);
      assert.equal(
        error.message,
        [
          "Multiple package manager lockfiles were found:",
          "- pnpm-lock.yaml",
          "- package-lock.json",
          "",
          "Please keep only the lockfile for the package manager used by this project.",
        ].join("\n"),
      );
      return true;
    });
  });
});

describe("dependency installation", () => {
  const dependencies = ["class-variance-authority", "clsx", "tailwind-merge"];

  for (const [manager, command, subcommand] of [
    ["pnpm", "pnpm", "add"],
    ["npm", "npm", "install"],
    ["yarn", "yarn", "add"],
    ["bun", "bun", "add"],
  ]) {
    it(`runs ${command} ${subcommand} with separate arguments`, async () => {
      const calls = [];

      await installDependencies({
        cwd: "/tmp/consumer",
        manager,
        dependencies,
        env: { PATH: "/usr/bin" },
        run: async (invocation) => {
          calls.push(invocation);
        },
      });

      assert.deepEqual(calls, [
        {
          command,
          args: [subcommand, ...dependencies],
          cwd: "/tmp/consumer",
          env: { PATH: "/usr/bin" },
        },
      ]);
      assert.equal(calls[0].args[1], "class-variance-authority");
      assert.equal(calls[0].args[2], "clsx");
      assert.equal(calls[0].args[3], "tailwind-merge");
    });
  }

  it("installs development dependencies with a separate dev flag", async () => {
    const calls = [];

    await installDependencies({
      cwd: "/tmp/consumer",
      manager: "pnpm",
      dependencies: ["clsx"],
      devDependencies: ["prettier", "vitest"],
      run: async (invocation) => {
        calls.push(invocation);
      },
    });

    assert.deepEqual(
      calls.map((call) => call.args),
      [
        ["add", "clsx"],
        ["add", "-D", "prettier", "vitest"],
      ],
    );
    assert.equal(calls[1].args.includes("prettier vitest"), false);
  });

  for (const [manager, flag] of [
    ["pnpm", "-D"],
    ["npm", "-D"],
    ["yarn", "-D"],
    ["bun", "-d"],
  ]) {
    it(`passes ${manager} development dependencies as separate arguments`, async () => {
      const calls = [];

      await installDependencies({
        cwd: "/tmp/consumer",
        manager,
        dependencies: [],
        devDependencies: ["prettier"],
        run: async (invocation) => {
          calls.push(invocation);
        },
      });

      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].args.slice(1), [flag, "prettier"]);
      assert.equal(typeof calls[0].command, "string");
      assert.equal(calls[0].command.includes(" "), false);
    });
  }

  it("does not install development dependencies after a runtime install fails", async () => {
    const calls = [];

    await assert.rejects(
      () =>
        installDependencies({
          cwd: "/tmp/consumer",
          manager: "pnpm",
          dependencies: ["clsx"],
          devDependencies: ["prettier"],
          run: async (invocation) => {
            calls.push(invocation.args);
            throw new CliError("Dependency installation failed.");
          },
        }),
      /Dependency installation failed/,
    );
    assert.deepEqual(calls, [["add", "clsx"]]);
  });

  it("does not run a package manager for an empty dependency list", async () => {
    const calls = [];

    await installDependencies({
      cwd: "/tmp/consumer",
      manager: "pnpm",
      dependencies: [],
      run: async (invocation) => {
        calls.push(invocation);
      },
    });

    assert.equal(calls.length, 0);
  });

  it("reports a non-zero package manager exit", async () => {
    const cwd = await project({ "package.json": "{}\n" });

    await assert.rejects(
      () =>
        runPackageManager({
          command: process.execPath,
          args: ["-e", "console.error('pm-failed'); process.exit(2)"],
          cwd,
          env: process.env,
        }),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /Dependency installation failed/);
        assert.match(error.message, /exited with status 2/);
        return true;
      },
    );
  });

  it("surfaces a package manager failure", async () => {
    await assert.rejects(
      () =>
        installDependencies({
          cwd: "/tmp/consumer",
          manager: "pnpm",
          dependencies,
          run: async (invocation) => {
            throw new CliError(
              `Dependency installation failed.\n${invocation.command} ${invocation.args.join(" ")} exited with status 1.`,
            );
          },
        }),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.match(error.message, /Dependency installation failed/);
        assert.match(
          error.message,
          /pnpm add class-variance-authority clsx tailwind-merge exited with status 1/,
        );
        return true;
      },
    );
  });
});
