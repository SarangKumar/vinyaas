import { describe, expect, it } from "vitest";

import {
  createDefaultTheme,
  generateThemeCss,
  parseThemeConfig,
  ThemeConfigError,
  type ThemeConfig,
} from "./index";

describe("theme playground model", () => {
  it("createDefaultTheme returns a fresh object each call", () => {
    const first = createDefaultTheme();
    const second = createDefaultTheme();

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(first.light).not.toBe(second.light);
    expect(first.dark).not.toBe(second.dark);

    first.light.primary = "hotpink";
    expect(second.light.primary).toBe("oklch(0.21 0.006 285.885)");
  });

  it("matches the current Vinyaas consumer baseline", () => {
    const theme = createDefaultTheme();

    expect(theme.radius).toBe("0.5rem");
    expect(theme.fontSans).toBe("ui-sans-serif, system-ui, sans-serif");
    expect(theme.fontMono).toContain("ui-monospace");
    expect(theme.light.background).toBe("oklch(1 0 0)");
    expect(theme.light.foreground).toBe("oklch(0.141 0.005 285.823)");
    expect(theme.light.primary).toBe("oklch(0.21 0.006 285.885)");
    expect(theme.light.chart1).toBe("oklch(0.32 0.012 285.885)");
    expect(theme.light.chart5).toBe("oklch(0.72 0.004 285.885)");
    expect(theme.dark.background).toBe("oklch(0.141 0.005 285.823)");
    expect(theme.dark.primary).toBe("oklch(0.92 0.004 286.32)");
    expect(theme.dark.chart1).toBe("oklch(0.88 0.01 286.32)");
  });

  it("rejects malformed theme config", () => {
    expect(() => parseThemeConfig(null)).toThrow(ThemeConfigError);
    expect(() =>
      parseThemeConfig({ ...createDefaultTheme(), radius: "" }),
    ).toThrow(/radius must be a non-empty string/);
    expect(() =>
      parseThemeConfig({
        ...createDefaultTheme(),
        light: { ...createDefaultTheme().light, primary: "   " },
      }),
    ).toThrow(/light\.primary/);
  });
});

describe("generateThemeCss", () => {
  it("generates deterministic default consumer CSS", () => {
    const theme = createDefaultTheme();
    const first = generateThemeCss(theme);
    const second = generateThemeCss(theme);

    expect(first).toBe(second);
    expect(first.startsWith('@import "tailwindcss";')).toBe(true);
    expect(first).toContain("@custom-variant dark (&:where(.dark, .dark *));");
    expect(first).toContain("/* Theme */");
    expect(first).toContain(":root {");
    expect(first).toContain(".dark {");
    expect(first).toContain("@theme inline {");
    expect(first.endsWith("}\n")).toBe(true);
  });

  it("includes light and dark semantic values", () => {
    const css = generateThemeCss(createDefaultTheme());

    expect(css).toContain("color-scheme: light;");
    expect(css).toContain("color-scheme: dark;");
    expect(css).toContain("--background: oklch(1 0 0);");
    expect(css).toContain("--foreground: oklch(0.141 0.005 285.823);");
    expect(css).toContain("--primary: oklch(0.21 0.006 285.885);");
    expect(css).toContain("--background: oklch(0.141 0.005 285.823);");
    expect(css).toContain("--primary: oklch(0.92 0.004 286.32);");
    expect(css).toContain("--border: oklch(1 0 0 / 10%);");
  });

  it("applies a custom primary color", () => {
    const theme = createDefaultTheme();
    theme.light.primary = "oklch(0.55 0.2 25)";
    theme.dark.primary = "oklch(0.7 0.18 25)";

    const css = generateThemeCss(theme);

    expect(css).toContain("--primary: oklch(0.55 0.2 25);");
    expect(css).toContain("--primary: oklch(0.7 0.18 25);");
  });

  it("applies a custom radius and derives radius tokens", () => {
    const theme = createDefaultTheme();
    theme.radius = "1rem";

    const css = generateThemeCss(theme);

    expect(css).toContain("--radius: 1rem;");
    expect(css).toContain("--radius-sm: calc(var(--radius) - 4px);");
    expect(css).toContain("--radius-md: calc(var(--radius) - 2px);");
    expect(css).toContain("--radius-lg: var(--radius);");
    expect(css).toContain("--radius-xl: calc(var(--radius) + 4px);");
  });

  it("applies custom font families", () => {
    const theme = createDefaultTheme();
    theme.fontSans = '"Inter", ui-sans-serif, sans-serif';
    theme.fontMono = '"JetBrains Mono", ui-monospace, monospace';

    const css = generateThemeCss(theme);

    expect(css).toContain('--font-sans: "Inter", ui-sans-serif, sans-serif;');
    expect(css).toContain(
      '--font-mono: "JetBrains Mono", ui-monospace, monospace;',
    );
  });

  it("includes chart variables and @theme color mappings", () => {
    const css = generateThemeCss(createDefaultTheme());

    expect(css).toContain("--chart-1: oklch(0.32 0.012 285.885);");
    expect(css).toContain("--chart-5: oklch(0.72 0.004 285.885);");
    expect(css).toContain("--chart-1: oklch(0.88 0.01 286.32);");
    expect(css).toContain("--color-chart-1: var(--chart-1);");
    expect(css).toContain("--color-chart-5: var(--chart-5);");
    expect(css).toContain("--color-background: var(--background);");
    expect(css).toContain("--color-primary: var(--primary);");
    expect(css).toContain("--color-destructive: var(--destructive);");
  });

  it("emits sidebar tokens as aliases of core theme colors", () => {
    const css = generateThemeCss(createDefaultTheme());

    expect(css).toContain("--sidebar: var(--background);");
    expect(css).toContain("--sidebar-foreground: var(--foreground);");
    expect(css).toContain("--sidebar-primary: var(--primary);");
    expect(css).toContain("--color-sidebar: var(--sidebar);");
    expect(css).toContain(
      "--color-sidebar-foreground: var(--sidebar-foreground);",
    );
  });

  it("does not emit docs-only or component animation CSS", () => {
    const css = generateThemeCss(createDefaultTheme());

    expect(css).not.toContain("--playground-");
    expect(css).not.toContain("--syntax-");
    expect(css).not.toContain("--new:");
    expect(css).not.toContain("font-geist");
    expect(css).not.toContain("@keyframes vinyaas-");
    expect(css).not.toContain(".vinyaas-");
    expect(css).not.toContain(".typeset-docs");
    expect(css).not.toContain("code[data-language]");
  });

  it("does not mutate the input theme", () => {
    const theme = createDefaultTheme();
    const snapshot = structuredClone(theme) as ThemeConfig;

    generateThemeCss(theme);

    expect(theme).toEqual(snapshot);
  });

  it("formats declarations without blank lines inside selectors", () => {
    const css = generateThemeCss(createDefaultTheme());
    const root = css.match(/:root \{[\s\S]*?\n\}/)?.[0] ?? "";

    expect(root).not.toMatch(/;\n\n\s+--/);
  });
});
