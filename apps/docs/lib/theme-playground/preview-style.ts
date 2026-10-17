import type { CSSProperties } from "react";

import type { ThemeConfig, ThemeModeColors } from "./theme";

export type ThemePreviewMode = "light" | "dark";

type CssVarProperties = CSSProperties & Record<`--${string}`, string>;

function modeVariables(colors: ThemeModeColors): Record<`--${string}`, string> {
  return {
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--card": colors.card,
    "--card-foreground": colors.cardForeground,
    "--popover": colors.popover,
    "--popover-foreground": colors.popoverForeground,
    "--primary": colors.primary,
    "--primary-foreground": colors.primaryForeground,
    "--secondary": colors.secondary,
    "--secondary-foreground": colors.secondaryForeground,
    "--muted": colors.muted,
    "--muted-foreground": colors.mutedForeground,
    "--accent": colors.accent,
    "--accent-foreground": colors.accentForeground,
    "--destructive": colors.destructive,
    "--border": colors.border,
    "--input": colors.input,
    "--ring": colors.ring,
    "--chart-1": colors.chart1,
    "--chart-2": colors.chart2,
    "--chart-3": colors.chart3,
    "--chart-4": colors.chart4,
    "--chart-5": colors.chart5,
  };
}

/**
 * Sidebar tokens are derived from the theme rather than carried in it, so both
 * the scoped preview and the site-wide apply build them the same way — and the
 * same way {@link generateThemeCss} does. Without them a preview would fall
 * back to the stock sidebar palette in `globals.css` while every other token
 * followed the preset.
 */
function sidebarVariables(
  mode: ThemePreviewMode,
): Record<`--${string}`, string> {
  return {
    "--sidebar": mode === "light" ? "var(--background)" : "var(--card)",
    "--sidebar-foreground": "var(--foreground)",
    "--sidebar-primary": "var(--primary)",
    "--sidebar-primary-foreground": "var(--primary-foreground)",
    "--sidebar-accent": "var(--accent)",
    "--sidebar-accent-foreground": "var(--accent-foreground)",
    "--sidebar-border": "var(--border)",
    "--sidebar-ring": "var(--ring)",
  };
}

/**
 * Scoped CSS variables for the live preview wrapper.
 * Sets semantic tokens so Tailwind utilities (`bg-background`, etc.) resolve
 * against this subtree without rewriting global `globals.css`.
 */
export function themePreviewStyle(
  theme: ThemeConfig,
  mode: ThemePreviewMode,
): CssVarProperties {
  const colors = mode === "light" ? theme.light : theme.dark;

  return {
    ...modeVariables(colors),
    ...sidebarVariables(mode),
    "--radius": theme.radius,
    "--font-sans": theme.fontSans,
    "--font-mono": theme.fontMono,
    colorScheme: mode,
  };
}

/**
 * CSS variables for applying a theme to the whole document.
 *
 * Set as inline styles on `<html>`, so they outrank both `globals.css` and the
 * `prefers-color-scheme` fallback in `docs.css` without either file needing to
 * know about this feature. Sidebar tokens are derived the same way
 * {@link generateThemeCss} derives them, so an applied theme matches the CSS
 * the Copy code dialog hands out.
 */
export function siteThemeVariables(
  theme: ThemeConfig,
  mode: ThemePreviewMode,
): Record<string, string> {
  const colors = mode === "light" ? theme.light : theme.dark;

  return {
    ...modeVariables(colors),
    ...sidebarVariables(mode),
    "--radius": theme.radius,
    "color-scheme": mode,
  };
}
