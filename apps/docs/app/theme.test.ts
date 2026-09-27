import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const docsRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

describe("docs theme", () => {
  it("maps semantic colors through the Tailwind v4 theme", async () => {
    const css = await fs.readFile(
      path.join(docsRoot, "app/globals.css"),
      "utf8",
    );

    expect(css).toContain('@import "tailwindcss"');
    expect(css).toContain("@theme inline");
    expect(css).toContain("--color-background: var(--background)");
    expect(css).toContain("--color-foreground: var(--foreground)");
    expect(css).toContain("--color-sidebar: var(--sidebar)");
    expect(css).toContain("--foreground: var(--palette-white)");
    expect(css).toContain("--body: var(--palette-neutral-200)");
    expect(css).toContain("--muted-foreground: var(--palette-neutral-300)");
    expect(css).toContain("--sidebar-foreground: var(--palette-neutral-200)");
    expect(css).toContain("--subtle-foreground: var(--palette-neutral-500)");
    expect(css).toContain("--new: var(--palette-new)");
    expect(css).toContain("--color-body: var(--body)");
    expect(css).toContain("--color-new: var(--new)");
    expect(css).toContain("--background: var(--palette-black)");
    expect(css).toContain(
      "--font-mono: var(--font-geist-mono), ui-monospace, monospace",
    );
    expect(css).toContain(":root");
    expect(css).toContain(".dark");
    expect(css).not.toMatch(/--foreground:\s*var\(--palette-mist\)/);
    expect(css).not.toMatch(/--background:\s*var\(--palette-ink\)/);
    await expect(
      fs.access(path.join(docsRoot, "tailwind.config.ts")),
    ).rejects.toThrow();
    await expect(
      fs.access(path.join(docsRoot, "tailwind.config.js")),
    ).rejects.toThrow();
  });
});
