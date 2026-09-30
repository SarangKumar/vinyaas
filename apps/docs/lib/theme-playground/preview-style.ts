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
    "--radius": theme.radius,
    "--font-sans": theme.fontSans,
    "--font-mono": theme.fontMono,
    colorScheme: mode,
  };
}
