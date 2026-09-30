/**
 * Canonical consumer theme for `vinyaas init`.
 * Light + dark semantic tokens for shipped components. No docs chrome,
 * Geist fonts, playground variables, or component animation CSS.
 */

export const CONSUMER_TAILWIND_IMPORT = '@import "tailwindcss";';

export const CONSUMER_DARK_VARIANT =
  "@custom-variant dark (&:where(.dark, .dark *));";

/** Light-mode semantic tokens written to `:root`. */
export const consumerLightTokens: Readonly<Record<string, string>> = {
  "color-scheme": "light",
  "--radius": "0.5rem",
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.141 0.005 285.823)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.141 0.005 285.823)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.141 0.005 285.823)",
  "--primary": "oklch(0.21 0.006 285.885)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.967 0.001 286.375)",
  "--secondary-foreground": "oklch(0.21 0.006 285.885)",
  "--muted": "oklch(0.967 0.001 286.375)",
  "--muted-foreground": "oklch(0.552 0.016 285.938)",
  "--accent": "oklch(0.967 0.001 286.375)",
  "--accent-foreground": "oklch(0.21 0.006 285.885)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--border": "oklch(0.92 0.004 286.32)",
  "--input": "oklch(0.92 0.004 286.32)",
  "--ring": "oklch(0.705 0.015 286.067)",
  "--chart-1": "oklch(0.32 0.012 285.885)",
  "--chart-2": "oklch(0.42 0.01 285.885)",
  "--chart-3": "oklch(0.52 0.008 285.885)",
  "--chart-4": "oklch(0.62 0.006 285.885)",
  "--chart-5": "oklch(0.72 0.004 285.885)",
};

/** Dark-mode semantic tokens written to `.dark`. */
export const consumerDarkTokens: Readonly<Record<string, string>> = {
  "color-scheme": "dark",
  "--background": "oklch(0.141 0.005 285.823)",
  "--foreground": "oklch(0.985 0 0)",
  "--card": "oklch(0.21 0.006 285.885)",
  "--card-foreground": "oklch(0.985 0 0)",
  "--popover": "oklch(0.21 0.006 285.885)",
  "--popover-foreground": "oklch(0.985 0 0)",
  "--primary": "oklch(0.92 0.004 286.32)",
  "--primary-foreground": "oklch(0.21 0.006 285.885)",
  "--secondary": "oklch(0.274 0.006 286.033)",
  "--secondary-foreground": "oklch(0.985 0 0)",
  "--muted": "oklch(0.274 0.006 286.033)",
  "--muted-foreground": "oklch(0.705 0.015 286.067)",
  "--accent": "oklch(0.274 0.006 286.033)",
  "--accent-foreground": "oklch(0.985 0 0)",
  "--destructive": "oklch(0.704 0.191 22.216)",
  "--border": "oklch(1 0 0 / 10%)",
  "--input": "oklch(1 0 0 / 15%)",
  "--ring": "oklch(0.552 0.016 285.938)",
  "--chart-1": "oklch(0.88 0.01 286.32)",
  "--chart-2": "oklch(0.8 0.008 286.32)",
  "--chart-3": "oklch(0.72 0.006 286.32)",
  "--chart-4": "oklch(0.64 0.005 286.32)",
  "--chart-5": "oklch(0.56 0.004 286.32)",
};

/** Tailwind v4 `@theme inline` mappings. System fonts only. */
export const consumerThemeInline: Readonly<Record<string, string>> = {
  "--font-sans": "ui-sans-serif, system-ui, sans-serif",
  "--font-mono":
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  "--radius-sm": "calc(var(--radius) - 4px)",
  "--radius-md": "calc(var(--radius) - 2px)",
  "--radius-lg": "var(--radius)",
  "--radius-xl": "calc(var(--radius) + 4px)",
  "--color-background": "var(--background)",
  "--color-foreground": "var(--foreground)",
  "--color-card": "var(--card)",
  "--color-card-foreground": "var(--card-foreground)",
  "--color-popover": "var(--popover)",
  "--color-popover-foreground": "var(--popover-foreground)",
  "--color-primary": "var(--primary)",
  "--color-primary-foreground": "var(--primary-foreground)",
  "--color-secondary": "var(--secondary)",
  "--color-secondary-foreground": "var(--secondary-foreground)",
  "--color-muted": "var(--muted)",
  "--color-muted-foreground": "var(--muted-foreground)",
  "--color-accent": "var(--accent)",
  "--color-accent-foreground": "var(--accent-foreground)",
  "--color-destructive": "var(--destructive)",
  "--color-border": "var(--border)",
  "--color-input": "var(--input)",
  "--color-ring": "var(--ring)",
  "--color-chart-1": "var(--chart-1)",
  "--color-chart-2": "var(--chart-2)",
  "--color-chart-3": "var(--chart-3)",
  "--color-chart-4": "var(--chart-4)",
  "--color-chart-5": "var(--chart-5)",
};

export function renderConsumerCssTemplate(): string {
  return [
    CONSUMER_TAILWIND_IMPORT,
    "",
    CONSUMER_DARK_VARIANT,
    "",
    "/* Theme */",
    formatBlock(":root", consumerLightTokens),
    "",
    formatBlock(".dark", consumerDarkTokens),
    "",
    formatBlock("@theme inline", consumerThemeInline),
    "",
  ].join("\n");
}

function formatBlock(
  selector: string,
  declarations: Readonly<Record<string, string>>,
): string {
  const lines = Object.entries(declarations).map(
    ([name, value]) => `  ${name}: ${value};`,
  );
  return `${selector} {\n${lines.join("\n")}\n}`;
}
