import {
  createDefaultTheme,
  type ThemeConfig,
  type ThemeModeColors,
} from "./theme";

export type ThemePresetId =
  "default" | "yellow" | "rose" | "orange" | "green" | "violet" | "blue";

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

const violet = buildPreset(
  "violet",
  "Violet",
  "oklch(0.54 0.26 295)",
  {
    primary: "oklch(0.5 0.26 295)",
    primaryForeground: "oklch(0.99 0.01 295)",
    secondary: "oklch(0.955 0.03 295)",
    secondaryForeground: "oklch(0.32 0.12 295)",
    muted: "oklch(0.96 0.02 295)",
    mutedForeground: "oklch(0.48 0.07 295)",
    accent: "oklch(0.93 0.06 295)",
    accentForeground: "oklch(0.32 0.12 295)",
    ring: "oklch(0.5 0.26 295)",
    border: "oklch(0.9 0.04 295)",
    input: "oklch(0.9 0.04 295)",
    chart1: "oklch(0.5 0.26 295)",
    chart2: "oklch(0.58 0.22 315)",
    chart3: "oklch(0.48 0.22 275)",
    chart4: "oklch(0.68 0.18 330)",
    chart5: "oklch(0.42 0.2 255)",
  },
  {
    primary: "oklch(0.76 0.2 295)",
    primaryForeground: "oklch(0.18 0.06 295)",
    secondary: "oklch(0.3 0.07 295)",
    secondaryForeground: "oklch(0.97 0.02 295)",
    muted: "oklch(0.27 0.05 295)",
    mutedForeground: "oklch(0.78 0.07 295)",
    accent: "oklch(0.36 0.09 295)",
    accentForeground: "oklch(0.97 0.02 295)",
    ring: "oklch(0.76 0.2 295)",
    chart1: "oklch(0.76 0.2 295)",
    chart2: "oklch(0.7 0.18 315)",
    chart3: "oklch(0.64 0.18 275)",
    chart4: "oklch(0.58 0.15 330)",
    chart5: "oklch(0.55 0.16 255)",
  },
);

const blue = buildPreset(
  "blue",
  "Blue",
  "oklch(0.55 0.2 245)",
  {
    primary: "oklch(0.52 0.2 245)",
    primaryForeground: "oklch(0.99 0.01 245)",
    secondary: "oklch(0.955 0.03 240)",
    secondaryForeground: "oklch(0.3 0.09 245)",
    muted: "oklch(0.96 0.018 240)",
    mutedForeground: "oklch(0.48 0.06 245)",
    accent: "oklch(0.93 0.055 235)",
    accentForeground: "oklch(0.3 0.09 245)",
    ring: "oklch(0.52 0.2 245)",
    border: "oklch(0.9 0.035 240)",
    input: "oklch(0.9 0.035 240)",
    chart1: "oklch(0.52 0.2 245)",
    chart2: "oklch(0.58 0.16 220)",
    chart3: "oklch(0.5 0.18 265)",
    chart4: "oklch(0.68 0.14 200)",
    chart5: "oklch(0.45 0.12 210)",
  },
  {
    primary: "oklch(0.76 0.15 245)",
    primaryForeground: "oklch(0.18 0.05 245)",
    secondary: "oklch(0.3 0.06 245)",
    secondaryForeground: "oklch(0.97 0.02 240)",
    muted: "oklch(0.27 0.045 245)",
    mutedForeground: "oklch(0.78 0.06 245)",
    accent: "oklch(0.35 0.08 240)",
    accentForeground: "oklch(0.97 0.02 240)",
    ring: "oklch(0.76 0.15 245)",
    chart1: "oklch(0.76 0.15 245)",
    chart2: "oklch(0.7 0.13 220)",
    chart3: "oklch(0.64 0.14 265)",
    chart4: "oklch(0.58 0.11 200)",
    chart5: "oklch(0.54 0.1 210)",
  },
);

export const themePresets: ThemePreset[] = [
  defaultPreset,
  yellow,
  rose,
  orange,
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
