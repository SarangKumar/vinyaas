import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { CliError } from "../src/lib/cli-error.ts";
import {
  collectEnvVars,
  createEnvPlan,
  envNamesIn,
  formatEnvPlan,
} from "../src/lib/env/plan.ts";

function registryItem(name, extra = {}) {
  return {
    $schema: "https://example.com/schema/registry-item.json",
    name,
    type: "registry:ui",
    dependencies: [],
    files: [],
    ...extra,
  };
}

describe("environment variable planning", () => {
  it("collects nothing when registry items declare no env vars", () => {
    assert.deepEqual(collectEnvVars([registryItem("button")]), []);
  });

  it("collects one required environment variable", () => {
    assert.deepEqual(
      collectEnvVars([
        registryItem("button", {
          envVars: { OPENAI_API_KEY: "OpenAI API key" },
        }),
      ]),
      [{ name: "OPENAI_API_KEY", description: "OpenAI API key" }],
    );
  });

  it("treats every declared variable as required", () => {
    const requirements = collectEnvVars([
      registryItem("button", {
        envVars: {
          OPENAI_API_KEY: "OpenAI API key",
          NEXT_PUBLIC_APP_URL: "Public application URL",
        },
      }),
    ]);

    assert.deepEqual(
      requirements.map((requirement) => requirement.name),
      ["OPENAI_API_KEY", "NEXT_PUBLIC_APP_URL"],
    );
    assert.equal(
      formatEnvPlan({
        requirements: requirements.map((requirement) => ({
          ...requirement,
          configured: false,
        })),
      }),
      [
        "Environment variables required:",
        "",
        "  OPENAI_API_KEY — OpenAI API key",
        "  NEXT_PUBLIC_APP_URL — Public application URL",
        "",
        "No environment files were modified.",
      ].join("\n"),
    );
  });

  it("collects env vars from dependencies first", () => {
    assert.deepEqual(
      collectEnvVars([
        registryItem("auth", { envVars: { AUTH_SECRET: "Auth secret" } }),
        registryItem("utils", { envVars: { API_URL: "API origin" } }),
        registryItem("icon"),
        registryItem("button", { envVars: { BUTTON_TOKEN: "Button token" } }),
      ]).map((requirement) => requirement.name),
      ["AUTH_SECRET", "API_URL", "BUTTON_TOKEN"],
    );
  });

  it("deduplicates identical declarations", () => {
    assert.deepEqual(
      collectEnvVars([
        registryItem("utils", { envVars: { API_URL: "API origin" } }),
        registryItem("button", { envVars: { API_URL: "API origin" } }),
      ]),
      [{ name: "API_URL", description: "API origin" }],
    );
  });

  it("fails when registry items declare different metadata", () => {
    assert.throws(
      () =>
        collectEnvVars([
          registryItem("utils", { envVars: { API_URL: "Public API origin" } }),
          registryItem("button", {
            envVars: { API_URL: "Private API origin" },
          }),
        ]),
      (error) => {
        assert.ok(error instanceof CliError);
        assert.equal(
          error.message,
          'Environment variable conflict:\nAPI_URL is declared differently by registry items "utils" and "button".',
        );
        return true;
      },
    );
  });

  it("detects a configured name without returning its value", () => {
    const names = envNamesIn(
      [
        "# OPENAI_API_KEY=ignored",
        "export OPENAI_API_KEY=super-secret-value",
        "DATABASE_URL=postgres://example",
      ].join("\n"),
    );

    assert.deepEqual(names, ["OPENAI_API_KEY", "DATABASE_URL"]);
    assert.equal(names.join("\n").includes("super-secret-value"), false);
  });

  it("reports a missing variable", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "vinyaas-env-"));
    const plan = await createEnvPlan({
      cwd,
      items: [
        registryItem("button", {
          envVars: { OPENAI_API_KEY: "OpenAI API key" },
        }),
      ],
    });

    assert.deepEqual(plan.requirements, [
      {
        name: "OPENAI_API_KEY",
        description: "OpenAI API key",
        configured: false,
      },
    ]);
  });

  it("treats a name in any inspected env file as configured", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "vinyaas-env-"));
    await writeFile(
      join(cwd, ".env.production"),
      "API_URL=https://example.com\n",
    );
    await writeFile(join(cwd, ".env.test"), "ONLY_TEST=1\n");

    const plan = await createEnvPlan({
      cwd,
      items: [
        registryItem("button", {
          envVars: {
            API_URL: "API origin",
            ONLY_TEST: "Not an inspected file",
          },
        }),
      ],
    });

    assert.deepEqual(
      plan.requirements.map((requirement) => [
        requirement.name,
        requirement.configured,
      ]),
      [
        ["API_URL", true],
        ["ONLY_TEST", false],
      ],
    );
    assert.equal(formatEnvPlan(plan).includes("https://example.com"), false);
  });

  it("does not modify environment files", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "vinyaas-env-"));
    const source = "OPENAI_API_KEY=super-secret-value\n";
    await writeFile(join(cwd, ".env"), source);

    const plan = await createEnvPlan({
      cwd,
      items: [
        registryItem("button", {
          envVars: { OPENAI_API_KEY: "OpenAI API key" },
        }),
      ],
    });
    const report = formatEnvPlan(plan);

    assert.equal(await readFile(join(cwd, ".env"), "utf8"), source);
    assert.match(report, /OPENAI_API_KEY already configured/);
    assert.doesNotMatch(report, /super-secret-value/);
  });
});
