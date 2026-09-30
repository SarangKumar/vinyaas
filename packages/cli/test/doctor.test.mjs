import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import { executeDoctor } from "../src/commands/doctor.ts";
import {
  formatDoctorReport,
  runDoctorChecks,
} from "../src/lib/doctor/checks.ts";

const themeCss = `@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.14 0 0);
  --primary: oklch(0.21 0 0);
}
`;

async function createProject(layout = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "vinyaas-doctor-"));

  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify(
      {
        name: "doctor-fixture",
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          ...(layout.skipUtilityDeps
            ? {}
            : {
                clsx: "^2.0.0",
                "tailwind-merge": "^3.0.0",
              }),
        },
        devDependencies: {
          ...(layout.tailwind === false
            ? {}
            : {
                tailwindcss: layout.tailwindVersion ?? "^4.0.0",
                "@tailwindcss/postcss": "^4.0.0",
              }),
        },
      },
      null,
      2,
    ),
  );

  if (layout.skipComponentsJson) {
    return root;
  }

  await writeFile(
    path.join(root, "components.json"),
    JSON.stringify(
      {
        $schema: "https://vinyaas.vercel.app/r/schema/components.json",
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
    ),
  );

  if (!layout.skipTsconfig) {
    await writeFile(
      path.join(root, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            baseUrl: ".",
            paths: {
              "@/*": ["./*"],
            },
          },
        },
        null,
        2,
      ),
    );
  }

  if (!layout.skipCss) {
    await mkdir(path.join(root, "app"), { recursive: true });
    await writeFile(
      path.join(root, "app/globals.css"),
      layout.cssContents ?? themeCss,
    );
  }

  if (!layout.skipUtils) {
    await mkdir(path.join(root, "lib"), { recursive: true });
    await writeFile(
      path.join(root, "lib/utils.ts"),
      "export function cn() {}\n",
    );
  }

  return root;
}

function captureLogs(run) {
  const logs = [];
  const originalLog = console.log;

  console.log = (...args) => {
    logs.push(args.join(" "));
  };

  return Promise.resolve()
    .then(run)
    .then((value) => ({ value, stdout: logs.join("\n") }))
    .finally(() => {
      console.log = originalLog;
    });
}

function mockRegistryFetch(ok = true) {
  return async () =>
    new Response(ok ? JSON.stringify({ style: "new-york", items: [] }) : null, {
      status: ok ? 200 : 503,
      headers: { "content-type": "application/json" },
    });
}

describe("vinyaas doctor", () => {
  it("passes a valid project", async () => {
    const root = await createProject();
    const report = await runDoctorChecks(root, {
      fetch: mockRegistryFetch(true),
    });

    assert.equal(report.ok, true);
    assert.ok(report.checks.some((check) => check.id === "components-json"));
    assert.ok(report.checks.some((check) => check.id === "theme-tokens"));
    assert.ok(report.checks.some((check) => check.id === "dependency-clsx"));
    assert.ok(report.checks.some((check) => check.id === "registry-reachable"));
    assert.match(formatDoctorReport(report), /No issues found\./);
    assert.match(formatDoctorReport(report), /✓ Vinyaas doctor/);
    assert.match(formatDoctorReport(report), /Project/);
    assert.match(formatDoctorReport(report), /Styling/);
    assert.match(formatDoctorReport(report), /Dependencies/);
    assert.match(formatDoctorReport(report), /Registry/);

    const { stdout, value } = await captureLogs(() =>
      executeDoctor({
        cwd: root,
        json: true,
        fetch: mockRegistryFetch(true),
      }),
    );
    const parsed = JSON.parse(stdout);

    assert.equal(value.ok, true);
    assert.equal(parsed.ok, true);
    assert.ok(parsed.checks.length >= 10);
  });

  it("fails when components.json is missing", async () => {
    const root = await createProject({ skipComponentsJson: true });
    const report = await runDoctorChecks(root, {
      env: { REGISTRY_BASE_PATH: "https://vinyaas.vercel.app/r" },
      fetch: mockRegistryFetch(true),
    });

    assert.equal(report.ok, false);
    assert.equal(
      report.checks.find((check) => check.id === "components-json")?.ok,
      false,
    );
    assert.match(formatDoctorReport(report), /components\.json/);
    assert.match(formatDoctorReport(report), /vinyaas init/);
  });

  it("fails for an invalid Tailwind setup", async () => {
    const root = await createProject({
      tailwindVersion: "^3.4.0",
      cssContents: "body {}\n",
    });
    const report = await runDoctorChecks(root, {
      fetch: mockRegistryFetch(true),
    });

    assert.equal(report.ok, false);
    assert.equal(
      report.checks.find((check) => check.id === "tailwind-v4")?.ok,
      false,
    );
    assert.equal(
      report.checks.find((check) => check.id === "css-file")?.ok,
      false,
    );
  });

  it("fails when aliases cannot resolve", async () => {
    const root = await createProject({ skipTsconfig: true });
    const report = await runDoctorChecks(root, {
      fetch: mockRegistryFetch(true),
    });

    assert.equal(report.ok, false);
    assert.equal(
      report.checks.find((check) => check.id === "aliases")?.ok,
      false,
    );
  });

  it("fails when utility dependencies are missing", async () => {
    const root = await createProject({ skipUtilityDeps: true });
    const report = await runDoctorChecks(root, {
      fetch: mockRegistryFetch(true),
    });

    assert.equal(report.ok, false);
    assert.equal(
      report.checks.find((check) => check.id === "dependency-clsx")?.ok,
      false,
    );
  });
});
