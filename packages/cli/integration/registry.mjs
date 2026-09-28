import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { runAdd } from "../src/commands/add.ts";
import {
  RegistryError,
  fetchRegistryItem,
} from "../src/lib/registry/client.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const buttonPath = join(repoRoot, "apps/docs/public/r/new-york/button.json");
const baseUrl = process.env.REGISTRY_BASE_URL?.trim().replace(/\/$/, "");

if (!baseUrl) {
  console.error(
    "REGISTRY_BASE_URL is not defined.\nExample: REGISTRY_BASE_URL=http://localhost:3000 pnpm registry:integration",
  );
  process.exit(1);
}

const base = new URL(baseUrl);

if (base.hostname !== "localhost" && base.hostname !== "127.0.0.1") {
  console.error(
    "registry:integration only talks to a local docs server.\nStart it with: pnpm --filter docs dev",
  );
  process.exit(1);
}

let generated;

try {
  generated = JSON.parse(await readFile(buttonPath, "utf8"));
} catch (error) {
  if (error && error.code === "ENOENT") {
    console.error(
      "apps/docs/public/r/new-york/button.json is missing.\nBuild it with: REGISTRY_BASE_URL=http://localhost:3000 pnpm registry:build",
    );
    process.exit(1);
  }

  throw error;
}

let item;

try {
  item = await fetchRegistryItem({
    baseUrl,
    style: "new-york",
    name: "button",
  });
} catch (error) {
  if (error instanceof RegistryError) {
    console.error(error.message);
    console.error("Start the docs app with: pnpm --filter docs dev");
    process.exit(1);
  }

  throw error;
}

assert.equal(item.name, "button");
assert.equal(item.type, "registry:ui");
assert.ok(item.dependencies.includes("class-variance-authority"));
assert.ok(item.dependencies.includes("clsx"));
assert.ok(item.dependencies.includes("tailwind-merge"));
assert.ok(
  item.files.some(
    (file) =>
      file.path === "ui/button/button.tsx" &&
      file.content.includes("export function Button"),
  ),
);
assert.equal(item.registryDependencies, undefined);
assert.deepEqual(item, generated);

await assert.rejects(
  () =>
    fetchRegistryItem({
      baseUrl,
      style: "new-york",
      name: "does-not-exist",
    }),
  (error) => {
    assert.ok(error instanceof RegistryError);
    assert.equal(
      error.message,
      `Registry item not found:\n${baseUrl}/r/new-york/does-not-exist.json`,
    );
    return true;
  },
);

const fixture = await mkdtemp(join(tmpdir(), "vinyaas-add-integration-"));
const css = '@import "tailwindcss";\n';

try {
  await writeFile(
    join(fixture, "components.json"),
    `${JSON.stringify(
      {
        $schema: `${baseUrl}/schema/components.json`,
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
  await writeFile(
    join(fixture, "tsconfig.json"),
    `${JSON.stringify(
      { compilerOptions: { paths: { "@/*": ["./*"] } } },
      null,
      2,
    )}\n`,
  );
  await mkdir(join(fixture, "app"));
  await writeFile(join(fixture, "app/globals.css"), css);
  await writeFile(
    join(fixture, "package.json"),
    `${JSON.stringify({ name: "vinyaas-add-fixture", private: true }, null, 2)}\n`,
  );
  await writeFile(join(fixture, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
  await mkdir(join(fixture, "lib"));
  await writeFile(
    join(fixture, "lib/utils.ts"),
    "export function cn(...inputs) { return inputs; }\n",
  );

  await runAdd({
    cwd: fixture,
    name: "button",
    env: { REGISTRY_BASE_URL: baseUrl },
  });

  const installed = await readFile(
    join(fixture, "components/ui/button/button.tsx"),
    "utf8",
  );
  const buttonFile = generated.files.find(
    (file) => file.path === "ui/button/button.tsx",
  );

  assert.equal(installed, buttonFile.content);
  assert.match(installed, /from "@\/lib\/utils"/);
  assert.match(
    await readFile(join(fixture, "lib/utils.ts"), "utf8"),
    /export function cn/,
  );
  assert.equal(await readFile(join(fixture, "app/globals.css"), "utf8"), css);
} finally {
  await rm(fixture, { recursive: true, force: true });
}

console.log(
  `Fetched ${baseUrl}/r/new-york/button.json and validated it against the generated registry item.`,
);
console.log(
  "Installed button into a temporary project and removed that project.",
);
