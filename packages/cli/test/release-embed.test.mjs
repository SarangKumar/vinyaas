import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const distPath = path.join(packageRoot, "dist/index.js");
const PRODUCTION = "https://vinyaas.vercel.app/r";
const LOCALHOST = "http://localhost:3000/r";

describe("CLI release bundle embedding", () => {
  it("embeds the production registry path and drops localhost/r", () => {
    const result = spawnSync(
      "pnpm",
      ["exec", "tsx", "./scripts/build.mjs"],
      {
        cwd: packageRoot,
        env: {
          ...process.env,
          VINYAAS_RELEASE: "1",
          REGISTRY_BASE_PATH: PRODUCTION,
          NODE_ENV: "production",
        },
        encoding: "utf8",
        shell: process.platform === "win32",
      },
    );

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.ok(fs.existsSync(distPath), "dist/index.js missing");

    const bundle = fs.readFileSync(distPath, "utf8");
    assert.match(bundle, /https:\/\/vinyaas\.vercel\.app\/r/);
    assert.equal(bundle.includes(LOCALHOST), false);
  });
});
