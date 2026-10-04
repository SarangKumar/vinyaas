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
    primary: "oklch(0.86 0.17 90)",
    primaryForeground: "oklch(0.25 0.05 88)",
    secondary: "oklch(0.3 0.04 90)",
    secondaryForeground: "oklch(0.95 0.03 95)",
    muted: "oklch(0.28 0.03 90)",
    mutedForeground: "oklch(0.75 0.05 90)",
    accent: "oklch(0.32 0.05 90)",
    accentForeground: "oklch(0.95 0.03 95)",
    ring: "oklch(0.86 0.17 90)",
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
    primary: "oklch(0.72 0.2 16)",
    primaryForeground: "oklch(0.2 0.04 16)",
    secondary: "oklch(0.3 0.05 16)",
    secondaryForeground: "oklch(0.96 0.02 12)",
    muted: "oklch(0.28 0.04 16)",
    mutedForeground: "oklch(0.75 0.06 16)",
    accent: "oklch(0.34 0.06 16)",
    accentForeground: "oklch(0.96 0.02 12)",
    ring: "oklch(0.72 0.2 16)",
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
  "oklch(0.705 0.213 47.604)",
  {
    primary: "oklch(0.705 0.213 47.604)",
    primaryForeground: "oklch(0.985 0.01 50)",
    secondary: "oklch(0.96 0.03 55)",
    secondaryForeground: "oklch(0.35 0.08 45)",
    muted: "oklch(0.96 0.02 55)",
    mutedForeground: "oklch(0.52 0.05 45)",
    accent: "oklch(0.95 0.05 55)",
    accentForeground: "oklch(0.35 0.08 45)",
    ring: "oklch(0.705 0.213 47.604)",
    border: "oklch(0.9 0.04 55)",
    input: "oklch(0.9 0.04 55)",
    chart1: "oklch(0.705 0.213 47.604)",
    chart2: "oklch(0.75 0.18 70)",
    chart3: "oklch(0.65 0.16 30)",
    chart4: "oklch(0.58 0.14 20)",
    chart5: "oklch(0.5 0.12 80)",
  },
  {
    primary: "oklch(0.78 0.18 55)",
    primaryForeground: "oklch(0.25 0.05 45)",
    secondary: "oklch(0.3 0.05 50)",
    secondaryForeground: "oklch(0.96 0.03 55)",
    muted: "oklch(0.28 0.04 50)",
    mutedForeground: "oklch(0.75 0.06 50)",
    accent: "oklch(0.34 0.06 50)",
    accentForeground: "oklch(0.96 0.03 55)",
    ring: "oklch(0.78 0.18 55)",
    chart1: "oklch(0.78 0.18 55)",
    chart2: "oklch(0.72 0.16 70)",
    chart3: "oklch(0.65 0.14 30)",
    chart4: "oklch(0.58 0.12 20)",
    chart5: "oklch(0.52 0.1 80)",
  },
);

/**
 * Red — brick / “red collar” accent. Distinct from Rose (pinker, higher chroma):
 * warmer surfaces, moderated chroma, destructive kept slightly orange so
 * primary actions and errors do not collide.
 */
const red = buildPreset(
  "red",
  "Red",
  "oklch(0.5 0.175 28)",
  {
    background: "oklch(0.994 0.005 35)",
    foreground: "oklch(0.22 0.03 28)",
    card: "oklch(0.995 0.003 35)",
    cardForeground: "oklch(0.22 0.03 28)",
    popover: "oklch(0.995 0.003 35)",
    popoverForeground: "oklch(0.22 0.03 28)",
    primary: "oklch(0.5 0.175 28)",
    primaryForeground: "oklch(0.985 0.01 40)",
    secondary: "oklch(0.955 0.02 40)",
    secondaryForeground: "oklch(0.32 0.07 28)",
    muted: "oklch(0.96 0.012 40)",
    mutedForeground: "oklch(0.5 0.04 30)",
    accent: "oklch(0.94 0.04 35)",
    accentForeground: "oklch(0.32 0.07 28)",
    destructive: "oklch(0.55 0.2 18)",
    ring: "oklch(0.55 0.16 28)",
    border: "oklch(0.9 0.03 35)",
    input: "oklch(0.9 0.03 35)",
    chart1: "oklch(0.5 0.175 28)",
    chart2: "oklch(0.58 0.14 45)",
    chart3: "oklch(0.48 0.12 15)",
    chart4: "oklch(0.62 0.1 55)",
    chart5: "oklch(0.42 0.1 35)",
  },
  {
    background: "oklch(0.16 0.02 28)",
    foreground: "oklch(0.97 0.01 40)",
    card: "oklch(0.22 0.03 28)",
    cardForeground: "oklch(0.97 0.01 40)",
    popover: "oklch(0.22 0.03 28)",
    popoverForeground: "oklch(0.97 0.01 40)",
    primary: "oklch(0.72 0.15 28)",
    primaryForeground: "oklch(0.2 0.04 28)",
    secondary: "oklch(0.28 0.04 28)",
    secondaryForeground: "oklch(0.96 0.015 40)",
    muted: "oklch(0.26 0.03 28)",
    mutedForeground: "oklch(0.76 0.04 35)",
    accent: "oklch(0.32 0.055 28)",
    accentForeground: "oklch(0.96 0.015 40)",
    destructive: "oklch(0.68 0.17 20)",
    ring: "oklch(0.72 0.15 28)",
    border: "oklch(1 0 0 / 12%)",
    input: "oklch(1 0 0 / 16%)",
    chart1: "oklch(0.72 0.15 28)",
    chart2: "oklch(0.68 0.12 45)",
    chart3: "oklch(0.62 0.12 15)",
    chart4: "oklch(0.58 0.1 55)",
    chart5: "oklch(0.52 0.09 35)",
  },
);

const green = buildPreset(
  "green",
  "Green",
  "oklch(0.55 0.16 150)",
  {
    primary: "oklch(0.52 0.15 150)",
    primaryForeground: "oklch(0.985 0.01 150)",
    secondary: "oklch(0.96 0.025 145)",
    secondaryForeground: "oklch(0.3 0.07 150)",
    muted: "oklch(0.96 0.015 145)",
    mutedForeground: "oklch(0.48 0.05 150)",
    accent: "oklch(0.94 0.045 145)",
    accentForeground: "oklch(0.3 0.07 150)",
    ring: "oklch(0.52 0.15 150)",
    border: "oklch(0.9 0.03 145)",
    input: "oklch(0.9 0.03 145)",
    chart1: "oklch(0.52 0.15 150)",
    chart2: "oklch(0.62 0.14 170)",
    chart3: "oklch(0.55 0.12 130)",
    chart4: "oklch(0.7 0.12 110)",
    chart5: "oklch(0.45 0.1 160)",
  },
  {
    primary: "oklch(0.78 0.14 150)",
    primaryForeground: "oklch(0.2 0.05 150)",
    secondary: "oklch(0.3 0.045 150)",
    secondaryForeground: "oklch(0.96 0.02 145)",
    muted: "oklch(0.28 0.035 150)",
    mutedForeground: "oklch(0.75 0.05 150)",
    accent: "oklch(0.34 0.055 150)",
    accentForeground: "oklch(0.96 0.02 145)",
    ring: "oklch(0.78 0.14 150)",
    chart1: "oklch(0.78 0.14 150)",
    chart2: "oklch(0.72 0.12 170)",
    chart3: "oklch(0.65 0.11 130)",
    chart4: "oklch(0.6 0.1 110)",
    chart5: "oklch(0.55 0.09 160)",
  },
);

/**
 * Violet — plum-tinted surfaces, moderated chroma, accent slightly warmer
 * (orchid) so interactive hover reads apart from primary.
 */
const violet = buildPreset(
  "violet",
  "Violet",
  "oklch(0.48 0.19 300)",
  {
    background: "oklch(0.993 0.008 300)",
    foreground: "oklch(0.22 0.04 300)",
    card: "oklch(0.996 0.004 300)",
    cardForeground: "oklch(0.22 0.04 300)",
    popover: "oklch(0.996 0.004 300)",
    popoverForeground: "oklch(0.22 0.04 300)",
    primary: "oklch(0.48 0.19 300)",
    primaryForeground: "oklch(0.99 0.01 300)",
    secondary: "oklch(0.95 0.03 300)",
    secondaryForeground: "oklch(0.34 0.1 300)",
    muted: "oklch(0.96 0.018 300)",
    mutedForeground: "oklch(0.48 0.06 300)",
    accent: "oklch(0.935 0.05 320)",
    accentForeground: "oklch(0.32 0.1 310)",
    destructive: "oklch(0.55 0.2 25)",
    ring: "oklch(0.52 0.16 300)",
    border: "oklch(0.9 0.035 300)",
    input: "oklch(0.9 0.035 300)",
    chart1: "oklch(0.48 0.19 300)",
    chart2: "oklch(0.55 0.16 330)",
    chart3: "oklch(0.5 0.16 275)",
    chart4: "oklch(0.62 0.12 350)",
    chart5: "oklch(0.42 0.14 260)",
  },
  {
    background: "oklch(0.16 0.03 300)",
    foreground: "oklch(0.97 0.015 300)",
    card: "oklch(0.22 0.04 300)",
    cardForeground: "oklch(0.97 0.015 300)",
    popover: "oklch(0.22 0.04 300)",
    popoverForeground: "oklch(0.97 0.015 300)",
    primary: "oklch(0.76 0.15 300)",
    primaryForeground: "oklch(0.18 0.05 300)",
    secondary: "oklch(0.28 0.055 300)",
    secondaryForeground: "oklch(0.96 0.02 300)",
    muted: "oklch(0.26 0.04 300)",
    mutedForeground: "oklch(0.78 0.05 300)",
    accent: "oklch(0.34 0.08 320)",
    accentForeground: "oklch(0.96 0.02 300)",
    destructive: "oklch(0.7 0.16 22)",
    ring: "oklch(0.76 0.15 300)",
    border: "oklch(1 0 0 / 12%)",
    input: "oklch(1 0 0 / 16%)",
    chart1: "oklch(0.76 0.15 300)",
    chart2: "oklch(0.7 0.13 330)",
    chart3: "oklch(0.64 0.14 275)",
    chart4: "oklch(0.58 0.12 350)",
    chart5: "oklch(0.54 0.12 260)",
  },
);

/**
 * Blue — cool slate surfaces, intentional secondary/muted/accent split,
 * charts spanning blue→cyan so it reads as a system not a recolored default.
 */
const blue = buildPreset(
  "blue",
  "Blue",
  "oklch(0.48 0.165 250)",
  {
    background: "oklch(0.992 0.007 245)",
    foreground: "oklch(0.22 0.035 250)",
    card: "oklch(0.996 0.004 245)",
    cardForeground: "oklch(0.22 0.035 250)",
    popover: "oklch(0.996 0.004 245)",
    popoverForeground: "oklch(0.22 0.035 250)",
    primary: "oklch(0.48 0.165 250)",
    primaryForeground: "oklch(0.99 0.01 245)",
    secondary: "oklch(0.945 0.03 240)",
    secondaryForeground: "oklch(0.3 0.08 250)",
    muted: "oklch(0.96 0.015 240)",
    mutedForeground: "oklch(0.48 0.05 245)",
    accent: "oklch(0.93 0.05 230)",
    accentForeground: "oklch(0.28 0.09 250)",
    destructive: "oklch(0.55 0.2 25)",
    ring: "oklch(0.52 0.14 250)",
    border: "oklch(0.9 0.03 240)",
    input: "oklch(0.9 0.03 240)",
    chart1: "oklch(0.48 0.165 250)",
    chart2: "oklch(0.55 0.13 220)",
    chart3: "oklch(0.5 0.14 270)",
    chart4: "oklch(0.62 0.11 200)",
    chart5: "oklch(0.42 0.1 235)",
  },
  {
    background: "oklch(0.16 0.03 250)",
    foreground: "oklch(0.97 0.012 240)",
    card: "oklch(0.22 0.04 250)",
    cardForeground: "oklch(0.97 0.012 240)",
    popover: "oklch(0.22 0.04 250)",
    popoverForeground: "oklch(0.97 0.012 240)",
    primary: "oklch(0.74 0.13 250)",
    primaryForeground: "oklch(0.18 0.04 250)",
    secondary: "oklch(0.28 0.05 250)",
    secondaryForeground: "oklch(0.96 0.015 240)",
    muted: "oklch(0.26 0.035 250)",
    mutedForeground: "oklch(0.78 0.05 245)",
    accent: "oklch(0.34 0.07 235)",
    accentForeground: "oklch(0.96 0.015 240)",
    destructive: "oklch(0.7 0.16 22)",
    ring: "oklch(0.74 0.13 250)",
    border: "oklch(1 0 0 / 12%)",
    input: "oklch(1 0 0 / 16%)",
    chart1: "oklch(0.74 0.13 250)",
    chart2: "oklch(0.68 0.11 220)",
    chart3: "oklch(0.62 0.12 270)",
    chart4: "oklch(0.58 0.1 200)",
    chart5: "oklch(0.52 0.09 235)",
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
