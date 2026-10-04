import { describe, expect, it } from "vitest";

import {
  getThemePreset,
  radiusOptions,
  themePresets,
  themeWithRadius,
} from "./presets";
import { createDefaultTheme } from "./theme";

describe("theme presets", () => {
  it("exposes the curated presets including Red", () => {
    expect(themePresets.map((preset) => preset.label)).toEqual([
      "Default",
      "Yellow",
      "Rose",
      "Orange",
      "Red",
      "Green",
      "Violet",
      "Blue",
    ]);
    expect(getThemePreset("green").theme.light.primary).toContain("oklch");
    expect(getThemePreset("default").theme.light.primary).toBe(
      createDefaultTheme().light.primary,
    );
    expect(getThemePreset("yellow").theme.light.primary).not.toBe(
      createDefaultTheme().light.primary,
    );
    expect(getThemePreset("yellow").theme.light.accent).toContain("oklch");
  });

  it("keeps Red distinct from Rose with moderated collar chroma", () => {
    const red = getThemePreset("red").theme;
    const rose = getThemePreset("rose").theme;

    expect(red.light.primary).toContain("28");
    expect(rose.light.primary).toContain("16");
    expect(red.light.primary).not.toBe(rose.light.primary);
    expect(red.light.background).toContain("oklch");
    expect(red.dark.card).toContain("oklch");
    expect(red.light.destructive).not.toBe(red.light.primary);
    expect(red.light.chart1).toContain("oklch");
    expect(red.dark.primary).toContain("oklch");
  });

  it("gives Blue a full cool hierarchy beyond a primary swap", () => {
    const blue = getThemePreset("blue").theme;
    const defaults = createDefaultTheme();

    expect(blue.light.background).not.toBe(defaults.light.background);
    expect(blue.light.primary).toContain("250");
    expect(blue.light.secondary).not.toBe(blue.light.muted);
    expect(blue.light.accent).not.toBe(blue.light.secondary);
    expect(blue.light.border).toContain("240");
    expect(blue.dark.background).toContain("250");
    expect(blue.dark.card).not.toBe(blue.dark.background);
    expect(blue.light.chart2).toContain("220");
  });

  it("gives Violet plum surfaces and a warmer accent than primary", () => {
    const violet = getThemePreset("violet").theme;
    const blue = getThemePreset("blue").theme;

    expect(violet.light.primary).toContain("300");
    expect(violet.light.primary).not.toBe(blue.light.primary);
    expect(violet.light.accent).toContain("320");
    expect(violet.light.background).toContain("300");
    expect(violet.dark.background).toContain("300");
    expect(violet.dark.primary).toContain("oklch");
    expect(violet.light.mutedForeground).toContain("oklch");
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
