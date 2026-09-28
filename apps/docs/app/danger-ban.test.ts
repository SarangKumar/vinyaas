import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("dangerouslySetInnerHTML ban", () => {
  it("is rejected by the docs ESLint config", async () => {
    const source = await readFile(
      path.join(process.cwd(), "eslint.config.mjs"),
      "utf8",
    );

    expect(source).toContain('"react/no-danger": "error"');
    expect(source).toContain("dangerouslySetInnerHTML");
    expect(source).toContain("forbidden");
  });

  it("is absent from docs source", async () => {
    const files = [
      "app/layout.tsx",
      "components/code-block.tsx",
      "components/code-highlight.tsx",
      "components/theme.ts",
      "components/theme-sync.tsx",
      "components/theme-toggle.tsx",
    ];

    for (const file of files) {
      const source = await readFile(path.join(process.cwd(), file), "utf8");

      expect(source).not.toContain("dangerouslySetInnerHTML");
      expect(source).not.toContain("<script");
    }
  });
});
