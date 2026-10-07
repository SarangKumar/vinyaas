import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("root layout theme", () => {
  it("boots theme from cookie or system preference before paint", async () => {
    const source = await readFile(
      path.join(process.cwd(), "app/layout.tsx"),
      "utf8",
    );

    expect(source).toContain("cookies()");
    expect(source).toContain("ThemeSync");
    expect(source).toContain("themeInitScript");
    expect(source).toContain("suppressHydrationWarning");
    expect(source).toContain("prefers-color-scheme");
    expect(source).toContain("dangerouslySetInnerHTML");
    expect(source).toContain("application/ld+json");
    expect(source).toContain('import "./globals.css"');
    expect(source).toContain('import "./docs.css"');
    expect(source).toContain('display: "swap"');
  });
});
