import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("root layout theme script", () => {
  it("initializes the theme before hydration without a raw script tag", async () => {
    const source = await readFile(
      path.join(process.cwd(), "app/layout.tsx"),
      "utf8",
    );

    expect(source).toContain('strategy="beforeInteractive"');
    expect(source).toContain("themeInitScript");
    expect(source).toContain("suppressHydrationWarning");
    expect(source).not.toContain("<script");
  });
});
