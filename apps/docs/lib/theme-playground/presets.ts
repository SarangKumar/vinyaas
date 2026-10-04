import {
  createDefaultTheme,
  type ThemeConfig,
  type ThemeModeColors,
} from "./theme";

export type ThemePresetId =
  | "default"
  | "yellow"
  | "rose"
  | "orange"
  | "red"
  | "green"
  | "violet"
  | "blue";

export type ThemePreset = {
  id: ThemePresetId;
  label: string;
  /** Compact swatch shown in the preset strip. */
  swatch: string;
  theme: ThemeConfig;
};

export const radiusOptions = [
  { label: "0", value: "0" },
  { label: "0.3", value: "0.3rem" },
  { label: "0.5", value: "0.5rem" },
  { label: "0.75", value: "0.75rem" },
  { label: "1.0", value: "1rem" },
] as const;

export type RadiusOptionValue = (typeof radiusOptions)[number]["value"];

function withMode(
  base: ThemeModeColors,
  patch: Partial<ThemeModeColors>,
): ThemeModeColors {
  return { ...base, ...patch };
}

function buildPreset(
  id: ThemePresetId,
  label: string,
  swatch: string,
  light: Partial<ThemeModeColors>,
  dark: Partial<ThemeModeColors>,
): ThemePreset {
  const base = createDefaultTheme();

  return {
    id,
    label,
    swatch,
    theme: {
      ...base,
      light: withMode(base.light, light),
      dark: withMode(base.dark, dark),
    },
  };
}

/**
 * Theme philosophy (matches Default / Yellow / Violet):
 * - Dark background: deep + very low chroma tint of primary hue
 * - Card: a step lighter, still low chroma
 * - Primary: bright accent that pops — not muddying surfaces
 * - Destructive: always semantic red, never equal to primary
 */

const defaultPreset: ThemePreset = {
  id: "default",
  label: "Default",
  /** Matches consumer `--primary` so the Default chip reads as the primary swatch. */
  swatch: createDefaultTheme().light.primary,
  theme: createDefaultTheme(),
};

const yellow = buildPreset(
  "yellow",
  "Yellow",
  "oklch(0.795 0.184 86)",
  {
    primary: "oklch(0.795 0.184 86)",
    primaryForeground: "oklch(0.28 0.066 88)",
    secondary: "oklch(0.96 0.03 95)",
    secondaryForeground: "oklch(0.32 0.05 88)",
    muted: "oklch(0.96 0.02 95)",
    mutedForeground: "oklch(0.5 0.04 88)",
    accent: "oklch(0.95 0.05 95)",
    accentForeground: "oklch(0.32 0.05 88)",
    ring: "oklch(0.795 0.184 86)",
    border: "oklch(0.9 0.04 95)",
    input: "oklch(0.9 0.04 95)",
    chart1: "oklch(0.795 0.184 86)",
    chart2: "oklch(0.7 0.15 70)",
    chart3: "oklch(0.65 0.12 50)",
    chart4: "oklch(0.55 0.1 100)",
    chart5: "oklch(0.45 0.08 120)",
  },
  {
    background: "oklch(0.145 0.006 90)",
    foreground: "oklch(0.985 0.01 95)",
    card: "oklch(0.21 0.01 90)",
    cardForeground: "oklch(0.985 0.01 95)",
    popover: "oklch(0.21 0.01 90)",
    popoverForeground: "oklch(0.985 0.01 95)",
    primary: "oklch(0.86 0.17 90)",
    primaryForeground: "oklch(0.25 0.05 88)",
    secondary: "oklch(0.274 0.015 90)",
    secondaryForeground: "oklch(0.95 0.03 95)",
    muted: "oklch(0.274 0.012 90)",
    mutedForeground: "oklch(0.75 0.05 90)",
    accent: "oklch(0.3 0.018 90)",
    accentForeground: "oklch(0.95 0.03 95)",
    ring: "oklch(0.86 0.17 90)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    chart1: "oklch(0.86 0.17 90)",
    chart2: "oklch(0.75 0.14 70)",
    chart3: "oklch(0.68 0.12 50)",
    chart4: "oklch(0.6 0.1 100)",
    chart5: "oklch(0.52 0.08 120)",
  },
);

const rose = buildPreset(
  "rose",
  "Rose",
  "oklch(0.645 0.246 16.439)",
  {
    primary: "oklch(0.645 0.246 16.439)",
    primaryForeground: "oklch(0.985 0.01 12)",
    secondary: "oklch(0.96 0.02 12)",
    secondaryForeground: "oklch(0.35 0.1 16)",
    muted: "oklch(0.96 0.015 12)",
    mutedForeground: "oklch(0.52 0.06 16)",
    accent: "oklch(0.95 0.04 12)",
    accentForeground: "oklch(0.35 0.1 16)",
    ring: "oklch(0.645 0.246 16.439)",
    border: "oklch(0.91 0.03 12)",
    input: "oklch(0.91 0.03 12)",
    chart1: "oklch(0.645 0.246 16.439)",
    chart2: "oklch(0.7 0.18 350)",
    chart3: "oklch(0.6 0.16 30)",
    chart4: "oklch(0.55 0.14 340)",
    chart5: "oklch(0.5 0.12 20)",
  },
  {
    background: "oklch(0.145 0.006 16)",
    foreground: "oklch(0.985 0.01 12)",
    card: "oklch(0.21 0.01 16)",
    cardForeground: "oklch(0.985 0.01 12)",
    popover: "oklch(0.21 0.01 16)",
    popoverForeground: "oklch(0.985 0.01 12)",
    primary: "oklch(0.72 0.2 16)",
    primaryForeground: "oklch(0.2 0.04 16)",
    secondary: "oklch(0.274 0.015 16)",
    secondaryForeground: "oklch(0.96 0.02 12)",
    muted: "oklch(0.274 0.012 16)",
    mutedForeground: "oklch(0.75 0.05 16)",
    accent: "oklch(0.3 0.018 16)",
    accentForeground: "oklch(0.96 0.02 12)",
    ring: "oklch(0.72 0.2 16)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    chart1: "oklch(0.72 0.2 16)",
    chart2: "oklch(0.68 0.16 350)",
    chart3: "oklch(0.62 0.14 30)",
    chart4: "oklch(0.56 0.12 340)",
    chart5: "oklch(0.5 0.1 20)",
  },
);

const orange = buildPreset(
  "orange",
  "Orange",
  "oklch(0.7 0.19 50)",
  {
    primary: "oklch(0.7 0.19 50)",
    primaryForeground: "oklch(0.99 0.01 55)",
    secondary: "oklch(0.96 0.03 55)",
    secondaryForeground: "oklch(0.35 0.08 45)",
    muted: "oklch(0.96 0.02 55)",
    mutedForeground: "oklch(0.5 0.05 45)",
    accent: "oklch(0.95 0.045 55)",
    accentForeground: "oklch(0.35 0.08 45)",
    destructive: "oklch(0.577 0.245 27.325)",
    ring: "oklch(0.7 0.19 50)",
    border: "oklch(0.91 0.03 55)",
    input: "oklch(0.91 0.03 55)",
    chart1: "oklch(0.7 0.19 50)",
    chart2: "oklch(0.65 0.16 30)",
    chart3: "oklch(0.75 0.15 80)",
    chart4: "oklch(0.55 0.12 20)",
    chart5: "oklch(0.6 0.12 200)",
  },
  {
    background: "oklch(0.145 0.006 50)",
    foreground: "oklch(0.985 0.01 60)",
    card: "oklch(0.21 0.01 50)",
    cardForeground: "oklch(0.985 0.01 60)",
    popover: "oklch(0.21 0.01 50)",
    popoverForeground: "oklch(0.985 0.01 60)",
    primary: "oklch(0.78 0.17 55)",
    primaryForeground: "oklch(0.22 0.05 45)",
    secondary: "oklch(0.274 0.015 50)",
    secondaryForeground: "oklch(0.97 0.02 55)",
    muted: "oklch(0.274 0.012 50)",
    mutedForeground: "oklch(0.76 0.04 55)",
    accent: "oklch(0.3 0.018 50)",
    accentForeground: "oklch(0.97 0.02 55)",
    destructive: "oklch(0.704 0.191 22.216)",
    ring: "oklch(0.78 0.17 55)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    chart1: "oklch(0.78 0.17 55)",
    chart2: "oklch(0.7 0.14 30)",
    chart3: "oklch(0.72 0.14 80)",
    chart4: "oklch(0.62 0.12 20)",
    chart5: "oklch(0.65 0.12 200)",
  },
);

/**
 * Red — unmistakably red primary (hue ~27), not brick/orange.
 * Distinct from Rose (pinker) and destructive (error semantic).
 */
const red = buildPreset(
  "red",
  "Red",
  "oklch(0.55 0.24 29)",
  {
    primary: "oklch(0.55 0.24 29)",
    primaryForeground: "oklch(0.985 0.01 30)",
    secondary: "oklch(0.96 0.012 30)",
    secondaryForeground: "oklch(0.35 0.08 29)",
    muted: "oklch(0.965 0.008 30)",
    mutedForeground: "oklch(0.5 0.04 29)",
    accent: "oklch(0.95 0.025 30)",
    accentForeground: "oklch(0.35 0.08 29)",
    // More orange-red / error so primary ≠ destructive.
    destructive: "oklch(0.5 0.2 18)",
    ring: "oklch(0.55 0.24 29)",
    border: "oklch(0.91 0.015 30)",
    input: "oklch(0.91 0.015 30)",
    chart1: "oklch(0.55 0.24 29)",
    chart2: "oklch(0.65 0.16 45)",
    chart3: "oklch(0.5 0.14 10)",
    chart4: "oklch(0.7 0.12 70)",
    chart5: "oklch(0.45 0.1 200)",
  },
  {
    background: "oklch(0.145 0.006 29)",
    foreground: "oklch(0.985 0.005 30)",
    card: "oklch(0.21 0.01 29)",
    cardForeground: "oklch(0.985 0.005 30)",
    popover: "oklch(0.21 0.01 29)",
    popoverForeground: "oklch(0.985 0.005 30)",
    // Saturated mid-red — avoid pale coral that reads pink.
    primary: "oklch(0.62 0.24 29)",
    primaryForeground: "oklch(0.985 0.01 30)",
    secondary: "oklch(0.274 0.015 29)",
    secondaryForeground: "oklch(0.97 0.01 30)",
    muted: "oklch(0.274 0.012 29)",
    mutedForeground: "oklch(0.76 0.035 30)",
    accent: "oklch(0.3 0.018 29)",
    accentForeground: "oklch(0.97 0.01 30)",
    destructive: "oklch(0.65 0.2 18)",
    ring: "oklch(0.62 0.24 29)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    chart1: "oklch(0.62 0.24 29)",
    chart2: "oklch(0.7 0.14 45)",
    chart3: "oklch(0.55 0.16 15)",
    chart4: "oklch(0.72 0.12 70)",
    chart5: "oklch(0.55 0.1 200)",
  },
);

const green = buildPreset(
  "green",
  "Green",
  "oklch(0.55 0.17 150)",
  {
    primary: "oklch(0.55 0.17 150)",
    primaryForeground: "oklch(0.99 0.01 150)",
    secondary: "oklch(0.96 0.02 145)",
    secondaryForeground: "oklch(0.3 0.07 150)",
    muted: "oklch(0.96 0.015 145)",
    mutedForeground: "oklch(0.48 0.04 150)",
    accent: "oklch(0.94 0.04 145)",
    accentForeground: "oklch(0.3 0.07 150)",
    destructive: "oklch(0.577 0.245 27.325)",
    ring: "oklch(0.55 0.17 150)",
    border: "oklch(0.91 0.025 145)",
    input: "oklch(0.91 0.025 145)",
    chart1: "oklch(0.55 0.17 150)",
    chart2: "oklch(0.62 0.14 180)",
    chart3: "oklch(0.7 0.14 110)",
    chart4: "oklch(0.5 0.12 200)",
    chart5: "oklch(0.65 0.12 80)",
  },
  {
    background: "oklch(0.145 0.006 150)",
    foreground: "oklch(0.985 0.01 145)",
    card: "oklch(0.21 0.01 150)",
    cardForeground: "oklch(0.985 0.01 145)",
    popover: "oklch(0.21 0.01 150)",
    popoverForeground: "oklch(0.985 0.01 145)",
    primary: "oklch(0.76 0.16 150)",
    primaryForeground: "oklch(0.18 0.05 150)",
    secondary: "oklch(0.274 0.015 150)",
    secondaryForeground: "oklch(0.97 0.02 145)",
    muted: "oklch(0.274 0.012 150)",
    mutedForeground: "oklch(0.76 0.04 150)",
    accent: "oklch(0.3 0.018 150)",
    accentForeground: "oklch(0.97 0.02 145)",
    destructive: "oklch(0.704 0.191 22.216)",
    ring: "oklch(0.76 0.16 150)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    chart1: "oklch(0.76 0.16 150)",
    chart2: "oklch(0.7 0.13 180)",
    chart3: "oklch(0.72 0.13 110)",
    chart4: "oklch(0.62 0.11 200)",
    chart5: "oklch(0.68 0.12 80)",
  },
);

/**
 * Violet — source palette (semantic fields only).
 */
const violet = buildPreset(
  "violet",
  "Violet",
  "oklch(0.606 0.25 292.717)",
  {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.141 0.005 285.823)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.141 0.005 285.823)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.141 0.005 285.823)",
    primary: "oklch(0.606 0.25 292.717)",
    primaryForeground: "oklch(0.969 0.016 293.756)",
    secondary: "oklch(0.967 0.001 286.375)",
    secondaryForeground: "oklch(0.21 0.006 285.885)",
    muted: "oklch(0.967 0.001 286.375)",
    mutedForeground: "oklch(0.552 0.016 285.938)",
    accent: "oklch(0.967 0.001 286.375)",
    accentForeground: "oklch(0.21 0.006 285.885)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.92 0.004 286.32)",
    input: "oklch(0.92 0.004 286.32)",
    ring: "oklch(0.606 0.25 292.717)",
    chart1: "oklch(0.646 0.222 41.116)",
    chart2: "oklch(0.6 0.118 184.704)",
    chart3: "oklch(0.398 0.07 227.392)",
    chart4: "oklch(0.828 0.189 84.429)",
    chart5: "oklch(0.769 0.188 70.08)",
  },
  {
    background: "oklch(0.141 0.005 285.823)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.21 0.006 285.885)",
    cardForeground: "oklch(0.985 0 0)",
    popover: "oklch(0.21 0.006 285.885)",
    popoverForeground: "oklch(0.985 0 0)",
    primary: "oklch(0.541 0.281 293.009)",
    primaryForeground: "oklch(0.969 0.016 293.756)",
    secondary: "oklch(0.274 0.006 286.033)",
    secondaryForeground: "oklch(0.985 0 0)",
    muted: "oklch(0.274 0.006 286.033)",
    mutedForeground: "oklch(0.705 0.015 286.067)",
    accent: "oklch(0.274 0.006 286.033)",
    accentForeground: "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.541 0.281 293.009)",
    chart1: "oklch(0.488 0.243 264.376)",
    chart2: "oklch(0.696 0.17 162.48)",
    chart3: "oklch(0.769 0.188 70.08)",
    chart4: "oklch(0.627 0.265 303.9)",
    chart5: "oklch(0.645 0.246 16.439)",
  },
);

const blue = buildPreset(
  "blue",
  "Blue",
  "oklch(0.55 0.2 255)",
  {
    primary: "oklch(0.55 0.2 255)",
    primaryForeground: "oklch(0.99 0.01 250)",
    secondary: "oklch(0.96 0.02 250)",
    secondaryForeground: "oklch(0.3 0.07 255)",
    muted: "oklch(0.96 0.012 250)",
    mutedForeground: "oklch(0.48 0.04 250)",
    accent: "oklch(0.94 0.04 245)",
    accentForeground: "oklch(0.3 0.07 255)",
    destructive: "oklch(0.577 0.245 27.325)",
    ring: "oklch(0.55 0.2 255)",
    border: "oklch(0.91 0.02 250)",
    input: "oklch(0.91 0.02 250)",
    chart1: "oklch(0.55 0.2 255)",
    chart2: "oklch(0.6 0.14 220)",
    chart3: "oklch(0.55 0.16 280)",
    chart4: "oklch(0.7 0.12 200)",
    chart5: "oklch(0.45 0.1 240)",
  },
  {
    background: "oklch(0.145 0.006 255)",
    foreground: "oklch(0.985 0.01 250)",
    card: "oklch(0.21 0.01 255)",
    cardForeground: "oklch(0.985 0.01 250)",
    popover: "oklch(0.21 0.01 255)",
    popoverForeground: "oklch(0.985 0.01 250)",
    primary: "oklch(0.7 0.16 255)",
    primaryForeground: "oklch(0.18 0.04 255)",
    secondary: "oklch(0.274 0.015 255)",
    secondaryForeground: "oklch(0.96 0.015 250)",
    muted: "oklch(0.274 0.012 255)",
    mutedForeground: "oklch(0.76 0.04 250)",
    accent: "oklch(0.3 0.018 250)",
    accentForeground: "oklch(0.96 0.015 250)",
    destructive: "oklch(0.704 0.191 22.216)",
    ring: "oklch(0.7 0.16 255)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    chart1: "oklch(0.7 0.16 255)",
    chart2: "oklch(0.68 0.12 220)",
    chart3: "oklch(0.64 0.14 280)",
    chart4: "oklch(0.6 0.1 200)",
    chart5: "oklch(0.55 0.1 240)",
  },
);

export const themePresets: ThemePreset[] = [
  defaultPreset,
  yellow,
  rose,
  orange,
  red,
  green,
  violet,
  blue,
];

export function getThemePreset(id: ThemePresetId): ThemePreset {
  const preset = themePresets.find((item) => item.id === id);

  if (!preset) {
    return defaultPreset;
  }

  return preset;
}

/** Apply a playground radius without mutating shared preset objects. */
export function themeWithRadius(
  theme: ThemeConfig,
  radius: string,
): ThemeConfig {
  return {
    ...theme,
    light: { ...theme.light },
    dark: { ...theme.dark },
    radius,
  };
}
