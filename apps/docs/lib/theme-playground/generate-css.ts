import {
  parseThemeConfig,
  type ThemeConfig,
  type ThemeModeColors,
} from "./theme";

const TAILWIND_IMPORT = '@import "tailwindcss";';
const DARK_VARIANT = "@custom-variant dark (&:where(.dark, .dark *));";

function formatBlock(
  selector: string,
  declarations: ReadonlyArray<readonly [string, string]>,
): string {
  const lines = declarations.map(([name, value]) => `  ${name}: ${value};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
}

function lightRootDeclarations(
  colors: ThemeModeColors,
  radius: string,
): Array<[string, string]> {
  return [
    ["color-scheme", "light"],
    ["--radius", radius],
    ["--background", colors.background],
    ["--foreground", colors.foreground],
    ["--card", colors.card],
    ["--card-foreground", colors.cardForeground],
    ["--popover", colors.popover],
    ["--popover-foreground", colors.popoverForeground],
    ["--primary", colors.primary],
    ["--primary-foreground", colors.primaryForeground],
    ["--secondary", colors.secondary],
    ["--secondary-foreground", colors.secondaryForeground],
    ["--muted", colors.muted],
    ["--muted-foreground", colors.mutedForeground],
    ["--accent", colors.accent],
    ["--accent-foreground", colors.accentForeground],
    ["--destructive", colors.destructive],
    ["--border", colors.border],
    ["--input", colors.input],
    ["--ring", colors.ring],
    ["--chart-1", colors.chart1],
    ["--chart-2", colors.chart2],
    ["--chart-3", colors.chart3],
    ["--chart-4", colors.chart4],
    ["--chart-5", colors.chart5],
    ["--sidebar", "var(--background)"],
    ["--sidebar-foreground", "var(--foreground)"],
    ["--sidebar-primary", "var(--primary)"],
    ["--sidebar-primary-foreground", "var(--primary-foreground)"],
    ["--sidebar-accent", "var(--accent)"],
    ["--sidebar-accent-foreground", "var(--accent-foreground)"],
    ["--sidebar-border", "var(--border)"],
    ["--sidebar-ring", "var(--ring)"],
  ];
}

function darkDeclarations(colors: ThemeModeColors): Array<[string, string]> {
  return [
    ["color-scheme", "dark"],
    ["--background", colors.background],
    ["--foreground", colors.foreground],
    ["--card", colors.card],
    ["--card-foreground", colors.cardForeground],
    ["--popover", colors.popover],
    ["--popover-foreground", colors.popoverForeground],
    ["--primary", colors.primary],
    ["--primary-foreground", colors.primaryForeground],
    ["--secondary", colors.secondary],
    ["--secondary-foreground", colors.secondaryForeground],
    ["--muted", colors.muted],
    ["--muted-foreground", colors.mutedForeground],
    ["--accent", colors.accent],
    ["--accent-foreground", colors.accentForeground],
    ["--destructive", colors.destructive],
    ["--border", colors.border],
    ["--input", colors.input],
    ["--ring", colors.ring],
    ["--chart-1", colors.chart1],
    ["--chart-2", colors.chart2],
    ["--chart-3", colors.chart3],
    ["--chart-4", colors.chart4],
    ["--chart-5", colors.chart5],
    ["--sidebar", "var(--card)"],
    ["--sidebar-foreground", "var(--foreground)"],
    ["--sidebar-primary", "var(--primary)"],
    ["--sidebar-primary-foreground", "var(--primary-foreground)"],
    ["--sidebar-accent", "var(--accent)"],
    ["--sidebar-accent-foreground", "var(--accent-foreground)"],
    ["--sidebar-border", "var(--border)"],
    ["--sidebar-ring", "var(--ring)"],
  ];
}

function themeInlineDeclarations(
  fontSans: string,
  fontMono: string,
): Array<[string, string]> {
  return [
    ["--font-sans", fontSans],
    ["--font-mono", fontMono],
    ["--radius-sm", "calc(var(--radius) - 4px)"],
    ["--radius-md", "calc(var(--radius) - 2px)"],
    ["--radius-lg", "var(--radius)"],
    ["--radius-xl", "calc(var(--radius) + 4px)"],
    ["--color-background", "var(--background)"],
    ["--color-foreground", "var(--foreground)"],
    ["--color-card", "var(--card)"],
    ["--color-card-foreground", "var(--card-foreground)"],
    ["--color-popover", "var(--popover)"],
    ["--color-popover-foreground", "var(--popover-foreground)"],
    ["--color-primary", "var(--primary)"],
    ["--color-primary-foreground", "var(--primary-foreground)"],
    ["--color-secondary", "var(--secondary)"],
    ["--color-secondary-foreground", "var(--secondary-foreground)"],
    ["--color-muted", "var(--muted)"],
    ["--color-muted-foreground", "var(--muted-foreground)"],
    ["--color-accent", "var(--accent)"],
    ["--color-accent-foreground", "var(--accent-foreground)"],
    ["--color-destructive", "var(--destructive)"],
    ["--color-border", "var(--border)"],
    ["--color-input", "var(--input)"],
    ["--color-ring", "var(--ring)"],
    ["--color-chart-1", "var(--chart-1)"],
    ["--color-chart-2", "var(--chart-2)"],
    ["--color-chart-3", "var(--chart-3)"],
    ["--color-chart-4", "var(--chart-4)"],
    ["--color-chart-5", "var(--chart-5)"],
    ["--color-sidebar", "var(--sidebar)"],
    ["--color-sidebar-foreground", "var(--sidebar-foreground)"],
    ["--color-sidebar-primary", "var(--sidebar-primary)"],
    ["--color-sidebar-primary-foreground", "var(--sidebar-primary-foreground)"],
    ["--color-sidebar-accent", "var(--sidebar-accent)"],
    ["--color-sidebar-accent-foreground", "var(--sidebar-accent-foreground)"],
    ["--color-sidebar-border", "var(--sidebar-border)"],
    ["--color-sidebar-ring", "var(--sidebar-ring)"],
  ];
}

/**
 * Builds consumer-ready `globals.css` from a theme config.
 * Does not mutate `theme`. Throws {@link ThemeConfigError} when invalid.
 */
export function generateThemeCss(theme: ThemeConfig): string {
  const config = parseThemeConfig(theme);

  return [
    TAILWIND_IMPORT,
    "",
    DARK_VARIANT,
    "",
    "/* Theme */",
    formatBlock(":root", lightRootDeclarations(config.light, config.radius)),
    "",
    formatBlock(".dark", darkDeclarations(config.dark)),
    "",
    formatBlock(
      "@theme inline",
      themeInlineDeclarations(config.fontSans, config.fontMono),
    ),
    "",
  ].join("\n");
}
