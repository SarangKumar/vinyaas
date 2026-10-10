import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("root layout theme", () => {
  it("stays static (no request cookies) and syncs the theme without inline HTML", async () => {
    const source = await readFile(
      path.join(process.cwd(), "app/layout.tsx"),
      "utf8",
    );

    // Reading cookies() would make every docs route dynamic.
    expect(source).not.toContain("cookies()");
    expect(source).not.toContain("next/headers");
    expect(source).toContain("ThemeSync");
    expect(source).toContain("suppressHydrationWarning");
    expect(source).toContain("application/ld+json");
    expect(source).toContain("websiteJsonLd");
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("themeInitScript");
    expect(source).toContain('import "./globals.css"');
    expect(source).toContain('import "./docs.css"');
    expect(source).toContain('display: "swap"');
  });
});
