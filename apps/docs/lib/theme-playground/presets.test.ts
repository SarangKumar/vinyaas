import { describe, expect, it } from "vitest";

import {
  getThemePreset,
  radiusOptions,
  themePresets,
  themeWithRadius,
} from "./presets";
import { createDefaultTheme } from "./theme";

describe("theme presets", () => {
  it("exposes the seven curated presets", () => {
    expect(themePresets.map((preset) => preset.label)).toEqual([
      "Default",
      "Yellow",
      "Rose",
      "Orange",
      "Green",
      "Violet",
      "Blue",
    ]);
    expect(getThemePreset("green").theme.light.primary).toContain("oklch");
    expect(getThemePreset("violet").theme.light.primary).toContain("0.26");
    expect(getThemePreset("blue").theme.light.primary).toContain("245");
    expect(getThemePreset("default").theme.light.primary).toBe(
      createDefaultTheme().light.primary,
    );
    expect(getThemePreset("yellow").theme.light.primary).not.toBe(
      createDefaultTheme().light.primary,
    );
    expect(getThemePreset("yellow").theme.light.accent).toContain("oklch");
    expect(getThemePreset("blue").theme.dark.primary).toContain("oklch");
  });

  it("keeps radius options limited and non-mutating", () => {
    expect(radiusOptions.map((option) => option.label)).toEqual([
      "0",
      "0.3",
      "0.5",
      "0.75",
      "1.0",
    ]);

    const preset = getThemePreset("rose").theme;
    const next = themeWithRadius(preset, "1rem");
    expect(next.radius).toBe("1rem");
    expect(preset.radius).toBe(createDefaultTheme().radius);
  });
});
