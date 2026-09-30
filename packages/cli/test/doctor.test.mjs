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
      layout.cssContents ?? '@import "tailwindcss";\n',
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

describe("vinyaas doctor", () => {
  it("passes a valid project", async () => {
    const root = await createProject();
    const report = await runDoctorChecks(root);

    assert.equal(report.ok, true);
    assert.deepEqual(
      report.checks.map((check) => check.id),
      [
        "components-json",
        "tailwind-v4",
        "css-file",
        "aliases",
        "utils-file",
      ],
    );
    assert.match(formatDoctorReport(report), /Your project is ready\./);

    const { stdout, value } = await captureLogs(() =>
      executeDoctor({ cwd: root, json: true }),
    );
    const parsed = JSON.parse(stdout);

    assert.equal(value.ok, true);
    assert.equal(parsed.ok, true);
    assert.equal(parsed.checks.length, 5);
  });

  it("fails when components.json is missing", async () => {
    const root = await createProject({ skipComponentsJson: true });
    const report = await runDoctorChecks(root);

    assert.equal(report.ok, false);
    assert.equal(
      report.checks.find((check) => check.id === "components-json")?.ok,
      false,
    );
    assert.match(formatDoctorReport(report), /components\.json found/);
  });

  it("fails for an invalid Tailwind setup", async () => {
    const root = await createProject({
      tailwindVersion: "^3.4.0",
      cssContents: "body {}\n",
    });
    const report = await runDoctorChecks(root);

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
    const report = await runDoctorChecks(root);

    assert.equal(report.ok, false);
    assert.equal(
      report.checks.find((check) => check.id === "aliases")?.ok,
      false,
    );
  });
});
