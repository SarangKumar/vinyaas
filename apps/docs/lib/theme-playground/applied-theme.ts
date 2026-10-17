import {
  getThemePreset,
  radiusOptions,
  themePresets,
  themeWithRadius,
  type RadiusOptionValue,
  type ThemePresetId,
} from "./presets";
import type { ThemeConfig } from "./theme";

/**
 * The Themes playground selection, once the reader applies it to the whole
 * site. Only the two selector axes are stored — the full token set is derived
 * from the preset, so a preset edit reaches already-applied themes.
 */
export type AppliedTheme = {
  presetId: ThemePresetId;
  radius: RadiusOptionValue;
};

export const appliedThemeStorageKey = "vinyaas-applied-theme";

/**
 * Fired on `window` after the stored theme changes, so the whole tab reacts to
 * Apply / Reset without a reload. `storage` only covers other tabs.
 */
export const appliedThemeEvent = "vinyaas:applied-theme";

/** Where the selector starts, and what Reset returns it to. */
export const defaultSelection: AppliedTheme = {
  presetId: "default",
  radius: "0.75rem",
};

const presetIds = new Set<string>(themePresets.map((preset) => preset.id));
const radiusValues = new Set<string>(
  radiusOptions.map((option) => option.value),
);

export function sameAppliedTheme(
  left: AppliedTheme | null,
  right: AppliedTheme | null,
): boolean {
  if (!left || !right) {
    return left === right;
  }

  return left.presetId === right.presetId && left.radius === right.radius;
}

/** Null for anything unrecognized, so a stale or hand-edited value is ignored. */
export function parseAppliedTheme(input: unknown): AppliedTheme | null {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const source = input as Record<string, unknown>;

  if (
    typeof source.presetId !== "string" ||
    typeof source.radius !== "string" ||
    !presetIds.has(source.presetId) ||
    !radiusValues.has(source.radius)
  ) {
    return null;
  }

  return {
    presetId: source.presetId as ThemePresetId,
    radius: source.radius as RadiusOptionValue,
  };
}

/** Null when nothing is applied, storage is empty, or the value is unusable. */
export function readAppliedTheme(): AppliedTheme | null {
  try {
    const stored = localStorage.getItem(appliedThemeStorageKey);

    return stored ? parseAppliedTheme(JSON.parse(stored)) : null;
  } catch {
    // Unavailable storage or invalid JSON both mean "nothing applied".
    return null;
  }
}

export function appliedThemeConfig(applied: AppliedTheme): ThemeConfig {
  return themeWithRadius(
    getThemePreset(applied.presetId).theme,
    applied.radius,
  );
}
