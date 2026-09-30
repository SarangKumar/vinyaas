import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("root layout theme", () => {
  it("applies the theme from the cookie without a script tag", async () => {
    const source = await readFile(
      path.join(process.cwd(), "app/layout.tsx"),
      "utf8",
    );

    expect(source).toContain("cookies()");
    expect(source).toContain("ThemeSync");
    expect(source).not.toContain("ThemeBoot");
    expect(source).not.toContain("themeInitScript");
    expect(source).not.toContain("<script");
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("suppressHydrationWarning");
    expect(source).not.toContain("next/script");
    expect(source).not.toContain("beforeInteractive");
    expect(source).toContain('import "./globals.css"');
    expect(source).toContain('import "./docs.css"');
  });
});
