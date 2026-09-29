import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const docsRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

describe("docs theme", () => {
  it("keeps consumer globals.css to Tailwind setup and theme tokens", async () => {
    const css = await fs.readFile(
      path.join(docsRoot, "app/globals.css"),
      "utf8",
    );

    expect(css).toContain('@import "tailwindcss"');
    expect(css).toContain("@custom-variant dark (&:where(.dark, .dark *))");
    expect(css).toContain("@theme inline");
    expect(css).toContain("/* Theme */");
    expect(css).toContain("color-scheme: light");
    expect(css).toContain("color-scheme: dark");
    expect(css).toContain(":root");
    expect(css).toContain(".dark");

    expect(css).toContain("--radius: 0.75rem");
    expect(css).toContain("--radius-lg: var(--radius)");
    expect(css).toContain("--background: oklch(1 0 0)");
    expect(css).toContain("--foreground: oklch(0.141 0.005 285.823)");
    expect(css).toContain("--primary: oklch(0.21 0.006 285.885)");
    expect(css).toContain("--primary-foreground: oklch(0.985 0 0)");
    expect(css).toContain("--secondary: oklch(0.967 0.001 286.375)");
    expect(css).toContain("--secondary-foreground: oklch(0.21 0.006 285.885)");
    expect(css).toContain("--muted: oklch(0.967 0.001 286.375)");
    expect(css).toContain("--muted-foreground: oklch(0.552 0.016 285.938)");
    expect(css).toContain("--accent: oklch(0.967 0.001 286.375)");
    expect(css).toContain("--accent-foreground: oklch(0.21 0.006 285.885)");
    expect(css).toContain("--destructive: oklch(0.577 0.245 27.325)");
    expect(css).not.toContain("--destructive-foreground");
    expect(css).toContain("--card: oklch(1 0 0)");
    expect(css).toContain("--card-foreground: oklch(0.141 0.005 285.823)");
    expect(css).toContain("--popover: oklch(1 0 0)");
    expect(css).toContain("--popover-foreground: oklch(0.141 0.005 285.823)");
    expect(css).toContain("--border: oklch(0.92 0.004 286.32)");
    expect(css).toContain("--input: oklch(0.92 0.004 286.32)");
    expect(css).toContain("--ring: oklch(0.705 0.015 286.067)");
    expect(css).toContain("--chart-1: oklch(0.32 0.012 285.885)");
    expect(css).toContain("--chart-5: oklch(0.72 0.004 285.885)");
    expect(css).not.toContain("--body:");
    expect(css).not.toContain("color-mix(");

    expect(css).toContain("--background: oklch(0.141 0.005 285.823)");
    expect(css).toContain("--card: oklch(0.21 0.006 285.885)");
    expect(css).toContain("--primary: oklch(0.92 0.004 286.32)");
    expect(css).toContain("--primary-foreground: oklch(0.21 0.006 285.885)");
    expect(css).toContain("--destructive: oklch(0.704 0.191 22.216)");
    expect(css).toContain("--ring: oklch(0.552 0.016 285.938)");
    expect(css).toContain("--chart-1: oklch(0.88 0.01 286.32)");
    expect(css).toContain("--chart-5: oklch(0.56 0.004 286.32)");
    expect(css).toContain("--border: oklch(1 0 0 / 10%)");

    expect(css).toContain("--color-background: var(--background)");
    expect(css).toContain("--color-foreground: var(--foreground)");
    expect(css).toContain("--color-primary: var(--primary)");
    expect(css).toContain("--color-secondary: var(--secondary)");
    expect(css).toContain("--color-muted: var(--muted)");
    expect(css).toContain("--color-accent: var(--accent)");
    expect(css).toContain("--color-destructive: var(--destructive)");
    expect(css).toContain("--color-card: var(--card)");
    expect(css).toContain("--color-popover: var(--popover)");
    expect(css).toContain("--color-border: var(--border)");
    expect(css).toContain("--color-input: var(--input)");
    expect(css).toContain("--color-ring: var(--ring)");
    expect(css).toContain("--color-chart-1: var(--chart-1)");
    expect(css).toContain("--color-chart-5: var(--chart-5)");
    expect(css).not.toContain("--color-body");
    expect(css).not.toContain("--color-destructive-foreground");
    expect(css).toContain(
      "--font-mono: var(--font-geist-mono), ui-monospace, monospace",
    );

    // No docs chrome or component/prose styling in the consumer theme.
    expect(css).not.toContain("--sidebar-primary");
    expect(css).not.toContain("--color-sidebar:");
    expect(css).not.toContain("--subtle-foreground");
    expect(css).not.toContain("--palette-");
    expect(css).not.toContain("--new:");
    expect(css).not.toContain("--sidebar-foreground");
    expect(css).not.toContain("--playground-");
    expect(css).not.toContain("--syntax-");
    expect(css).not.toContain(".typeset-docs");
    expect(css).not.toContain("code[data-language]");
    expect(css).not.toContain(":not(pre) > code");
    expect(css).not.toContain("font-family: var(--font-geist-mono)");
    expect(css).not.toMatch(/^\s*pre\s*\{/m);
    expect(css).not.toContain("@keyframes vinyaas-toast-");
    expect(css).not.toContain("@keyframes vinyaas-dialog-");
    expect(css).not.toContain("@keyframes vinyaas-tooltip-");
    expect(css).not.toContain(".vinyaas-toast-in");
    expect(css).not.toContain(".vinyaas-dialog-in");
    expect(css).not.toContain(".vinyaas-tooltip-in");

    await expect(
      fs.access(path.join(docsRoot, "tailwind.config.ts")),
    ).rejects.toThrow();
    await expect(
      fs.access(path.join(docsRoot, "tailwind.config.js")),
    ).rejects.toThrow();
  });

  it("keeps docs-only chrome and prose styles out of the consumer theme", async () => {
    const css = await fs.readFile(path.join(docsRoot, "app/docs.css"), "utf8");
    const layout = await fs.readFile(
      path.join(docsRoot, "app/layout.tsx"),
      "utf8",
    );

    expect(layout).toContain('import "./globals.css"');
    expect(layout).toContain('import "./docs.css"');
    expect(css).toContain("Docs site only");
    expect(css).toContain("--new: var(--primary)");
    expect(css).toContain("--sidebar-foreground: var(--muted-foreground)");
    expect(css).toContain("--color-new: var(--new)");
    expect(css).toContain(
      "--color-sidebar-foreground: var(--sidebar-foreground)",
    );
    expect(css).toContain("--playground-gap: 1rem");
    expect(css).toContain("--playground-gap-2xl: 2.5rem");
    expect(css).toContain("--spacing-playground-gap: var(--playground-gap)");
    expect(css).toContain("--syntax-plain:");
    expect(css).toContain("code[data-language]");
    expect(css).toContain(":not(pre) > code:not([data-language])");
    expect(css).toContain(".typeset-docs");
    expect(css).toContain(".typeset-docs :where(:not(pre) > code)");
  });

  it("documents Tailwind v4 at-rules for the CSS language service", async () => {
    const repoRoot = path.resolve(docsRoot, "../..");
    const settings = JSON.parse(
      await fs.readFile(path.join(repoRoot, ".vscode/settings.json"), "utf8"),
    ) as { "css.customData"?: string[] };
    const customData = JSON.parse(
      await fs.readFile(
        path.join(repoRoot, ".vscode/css_custom_data.json"),
        "utf8",
      ),
    ) as { atDirectives?: { name: string }[] };

    expect(settings["css.customData"]).toEqual([
      ".vscode/css_custom_data.json",
    ]);
    expect(customData.atDirectives?.map((entry) => entry.name)).toEqual(
      expect.arrayContaining(["@theme", "@custom-variant"]),
    );
  });
});
