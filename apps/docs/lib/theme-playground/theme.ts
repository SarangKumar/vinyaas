/**
 * Theme Playground Stage 1 — reusable consumer theme configuration.
 *
 * Defaults mirror `packages/cli/src/lib/theme/tokens.ts` (what `vinyaas init`
 * writes). Docs intentionally duplicates that data so the docs app does not
 * import the CLI package.
 */

/** Semantic colors for one color scheme (`:root` or `.dark`). */
export type ThemeModeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  /** Chart palette; defaults match Vinyaas. Extensible for later UI. */
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
};

/**
 * Editable Vinyaas consumer theme.
 *
 * Primary playground controls map to a subset of these fields (primary,
 * secondary, background, foreground, muted, accent, destructive, border,
 * input, ring, radius, fonts). Companion tokens (card, *-foreground, charts)
 * stay in the model so CSS stays complete and Stage 2 can expose them later.
 */
export type ThemeConfig = {
  radius: string;
  fontSans: string;
  fontMono: string;
  light: ThemeModeColors;
  dark: ThemeModeColors;
};

export class ThemeConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ThemeConfigError";
  }
}

const MODE_COLOR_KEYS = [
  "background",
  "foreground",
  "card",
  "cardForeground",
  "popover",
  "popoverForeground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "accent",
  "accentForeground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart1",
  "chart2",
  "chart3",
  "chart4",
  "chart5",
] as const satisfies ReadonlyArray<keyof ThemeModeColors>;

/** Current Vinyaas consumer light tokens (`:root`). */
const DEFAULT_LIGHT: ThemeModeColors = {
  background: "oklch(1 0 0)",
  foreground: "oklch(0.141 0.005 285.823)",
  card: "oklch(1 0 0)",
  cardForeground: "oklch(0.141 0.005 285.823)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.141 0.005 285.823)",
  primary: "oklch(0.21 0.006 285.885)",
  primaryForeground: "oklch(0.985 0 0)",
  secondary: "oklch(0.967 0.001 286.375)",
  secondaryForeground: "oklch(0.21 0.006 285.885)",
  muted: "oklch(0.967 0.001 286.375)",
  mutedForeground: "oklch(0.552 0.016 285.938)",
  accent: "oklch(0.967 0.001 286.375)",
  accentForeground: "oklch(0.21 0.006 285.885)",
  destructive: "oklch(0.577 0.245 27.325)",
  border: "oklch(0.92 0.004 286.32)",
  input: "oklch(0.92 0.004 286.32)",
  ring: "oklch(0.705 0.015 286.067)",
  chart1: "oklch(0.2 0 0)",
  chart2: "oklch(0.37 0 0)",
  chart3: "oklch(0.54 0 0)",
  chart4: "oklch(0.7 0 0)",
  chart5: "oklch(0.84 0 0)",
};

/** Current Vinyaas consumer dark tokens (`.dark`). */
const DEFAULT_DARK: ThemeModeColors = {
  background: "oklch(0.141 0.005 285.823)",
  foreground: "oklch(0.985 0 0)",
  card: "oklch(0.21 0.006 285.885)",
  cardForeground: "oklch(0.985 0 0)",
  popover: "oklch(0.21 0.006 285.885)",
  popoverForeground: "oklch(0.985 0 0)",
  primary: "oklch(0.92 0.004 286.32)",
  primaryForeground: "oklch(0.21 0.006 285.885)",
  secondary: "oklch(0.274 0.006 286.033)",
  secondaryForeground: "oklch(0.985 0 0)",
  muted: "oklch(0.274 0.006 286.033)",
  mutedForeground: "oklch(0.705 0.015 286.067)",
  accent: "oklch(0.274 0.006 286.033)",
  accentForeground: "oklch(0.985 0 0)",
  destructive: "oklch(0.704 0.191 22.216)",
  border: "oklch(1 0 0 / 10%)",
  input: "oklch(1 0 0 / 15%)",
  ring: "oklch(0.552 0.016 285.938)",
  chart1: "oklch(0.97 0 0)",
  chart2: "oklch(0.83 0 0)",
  chart3: "oklch(0.68 0 0)",
  chart4: "oklch(0.53 0 0)",
  chart5: "oklch(0.4 0 0)",
};

const DEFAULT_FONT_SANS = "ui-sans-serif, system-ui, sans-serif";
const DEFAULT_FONT_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

function cloneModeColors(colors: ThemeModeColors): ThemeModeColors {
  return { ...colors };
}

/** Fresh default theme matching the current Vinyaas consumer baseline. */
export function createDefaultTheme(): ThemeConfig {
  return {
    radius: "0.5rem",
    fontSans: DEFAULT_FONT_SANS,
    fontMono: DEFAULT_FONT_MONO,
    light: cloneModeColors(DEFAULT_LIGHT),
    dark: cloneModeColors(DEFAULT_DARK),
  };
}

function requireNonEmptyString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ThemeConfigError(`${path} must be a non-empty string.`);
  }

  return value;
}

function requireModeColors(value: unknown, path: string): ThemeModeColors {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ThemeConfigError(`${path} must be an object.`);
  }

  const source = value as Record<string, unknown>;
  const colors = {} as ThemeModeColors;

  for (const key of MODE_COLOR_KEYS) {
    colors[key] = requireNonEmptyString(source[key], `${path}.${key}`);
  }

  return colors;
}

/**
 * Validates and returns a deep copy of the theme so callers can mutate the
 * result without affecting the input.
 */
export function parseThemeConfig(input: unknown): ThemeConfig {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new ThemeConfigError("Theme config must be an object.");
  }

  const source = input as Record<string, unknown>;

  return {
    radius: requireNonEmptyString(source.radius, "radius"),
    fontSans: requireNonEmptyString(source.fontSans, "fontSans"),
    fontMono: requireNonEmptyString(source.fontMono, "fontMono"),
    light: requireModeColors(source.light, "light"),
    dark: requireModeColors(source.dark, "dark"),
  };
}
