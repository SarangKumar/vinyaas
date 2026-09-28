import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const docsRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

describe("docs theme", () => {
  it("maps semantic OKLCH colors through the Tailwind v4 theme", async () => {
    const css = await fs.readFile(
      path.join(docsRoot, "app/globals.css"),
      "utf8",
    );

    expect(css).toContain('@import "tailwindcss"');
    expect(css).toContain("@custom-variant dark (&:where(.dark, .dark *))");
    expect(css).toContain("@theme inline");
    expect(css).toContain("--radius: 0.5rem");
    expect(css).toContain("--radius-lg: var(--radius)");
    expect(css).toContain("--color-background: var(--background)");
    expect(css).toContain("--color-foreground: var(--foreground)");
    expect(css).toContain("--color-primary: var(--primary)");
    expect(css).toContain("--color-card: var(--card)");
    expect(css).toContain("--color-sidebar: var(--sidebar)");
    expect(css).toContain("--color-sidebar-primary: var(--sidebar-primary)");
    expect(css).toContain("--color-chart-1: var(--chart-1)");
    expect(css).toContain("--color-chart-5: var(--chart-5)");
    expect(css).toContain("--background: oklch(1 0 0)");
    expect(css).toContain("--foreground: oklch(0.141 0.005 285.823)");
    expect(css).toContain("--primary: oklch(0.21 0.006 285.885)");
    expect(css).toContain("--primary-foreground: oklch(0.985 0 0)");
    expect(css).toContain("--ring: oklch(0.705 0.015 286.067)");
    expect(css).toContain("--card: oklch(1 0 0)");
    expect(css).toContain("--background: oklch(0.141 0.005 285.823)");
    expect(css).toContain("--card: oklch(0.21 0.006 285.885)");
    expect(css).toContain("--primary: oklch(0.92 0.004 286.32)");
    expect(css).toContain("--ring: oklch(0.552 0.016 285.938)");
    expect(css).toContain("--sidebar-primary: oklch(0.488 0.243 264.376)");
    expect(css).toContain("--border: oklch(1 0 0 / 10%)");
    expect(css).toContain("--body: var(--foreground)");
    expect(css).toContain("--subtle-foreground: var(--muted-foreground)");
    expect(css).toContain("--new: var(--primary)");
    expect(css).toContain("--color-body: var(--body)");
    expect(css).toContain("--color-new: var(--new)");
    expect(css).toContain("--playground-gap: 1rem");
    expect(css).toContain("--playground-gap-2xl: 2.5rem");
    expect(css).toContain("--spacing-playground-gap: var(--playground-gap)");
    expect(css).toContain(
      "--font-mono: var(--font-geist-mono), ui-monospace, monospace",
    );
    expect(css).toContain("color-scheme: light");
    expect(css).toContain("color-scheme: dark");
    expect(css).toContain(":root");
    expect(css).toContain(".dark");
    expect(css).not.toContain("--palette-");
    await expect(
      fs.access(path.join(docsRoot, "tailwind.config.ts")),
    ).rejects.toThrow();
    await expect(
      fs.access(path.join(docsRoot, "tailwind.config.js")),
    ).rejects.toThrow();
  });
});
