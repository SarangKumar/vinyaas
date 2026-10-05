import { describe, expect, it } from "vitest";

import {
  getThemePreset,
  radiusOptions,
  themePresets,
  themeWithRadius,
  type ThemePresetId,
} from "./presets";
import { createDefaultTheme, type ThemeModeColors } from "./theme";

const REQUIRED_TOKENS: (keyof ThemeModeColors)[] = [
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
];

describe("theme presets", () => {
  it("exposes unique curated presets including Red", () => {
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
    expect(new Set(themePresets.map((preset) => preset.id)).size).toBe(
      themePresets.length,
    );
    expect(getThemePreset("green").theme.light.primary).toContain("oklch");
    expect(getThemePreset("default").theme.light.primary).toBe(
      createDefaultTheme().light.primary,
    );
    expect(getThemePreset("yellow").theme.light.primary).not.toBe(
      createDefaultTheme().light.primary,
    );
    expect(getThemePreset("yellow").theme.light.accent).toContain("oklch");
  });

  it("keeps every preset valid with required semantic tokens", () => {
    for (const preset of themePresets) {
      for (const mode of ["light", "dark"] as const) {
        const colors = preset.theme[mode];
        for (const token of REQUIRED_TOKENS) {
          expect(colors[token], `${preset.id}.${mode}.${token}`).toMatch(
            /^oklch\(/,
          );
        }
        expect(colors.primary).not.toBe(colors.destructive);
      }
      if (preset.id !== "default") {
        expect(preset.theme.light.ring).toBe(preset.theme.light.primary);
        // Green source palette uses a dedicated dark ring (not equal to primary).
        if (preset.id !== "green") {
          expect(preset.theme.dark.ring).toBe(preset.theme.dark.primary);
        }
      }
      expect(preset.theme.dark.card).not.toBe(preset.theme.dark.background);
    }
  });

  it("keeps dark backgrounds deep with only a subtle primary tint", () => {
    for (const preset of themePresets) {
      if (preset.id === "default") continue;
      const match = preset.theme.dark.background.match(
        /^oklch\(([\d.]+)\s+([\d.]+)\s+/,
      );
      expect(match, preset.id).toBeTruthy();
      const lightness = Number(match![1]);
      const chroma = Number(match![2]);
      expect(lightness, `${preset.id} dark.bg L`).toBeLessThanOrEqual(0.16);
      expect(chroma, `${preset.id} dark.bg C`).toBeLessThanOrEqual(0.008);
      expect(preset.theme.dark.card).not.toBe(preset.theme.dark.background);
    }
  });

  it("keeps Red unmistakably red and distinct from Rose / Orange", () => {
    const red = getThemePreset("red").theme;
    const rose = getThemePreset("rose").theme;
    const orange = getThemePreset("orange").theme;

    expect(red.light.primary).toBe("oklch(0.55 0.24 29)");
    expect(rose.light.primary).toContain("16");
    expect(red.light.primary).not.toBe(rose.light.primary);
    expect(red.light.primary).not.toBe(orange.light.primary);
    expect(red.light.destructive).not.toBe(red.light.primary);
    expect(red.dark.background).toBe("oklch(0.145 0.006 29)");
    expect(red.dark.primary).toBe("oklch(0.62 0.24 29)");
    expect(red.dark.card).not.toBe(red.dark.background);
  });

  it("gives Orange a bright primary on a lightly tinted dark surface", () => {
    const orange = getThemePreset("orange").theme;

    expect(orange.light.primary).toBe("oklch(0.7 0.19 50)");
    expect(orange.dark.background).toBe("oklch(0.145 0.006 50)");
    expect(orange.dark.primary).toBe("oklch(0.78 0.17 55)");
    expect(orange.dark.card).not.toBe(orange.dark.background);
    expect(orange.light.destructive).not.toBe(orange.light.primary);
    expect(orange.light.ring).toBe(orange.light.primary);
  });

  it("applies the Green source palette tokens", () => {
    const green = getThemePreset("green").theme;

    expect(green.light.primary).toBe("oklch(0.723 0.219 149.579)");
    expect(green.light.primaryForeground).toBe("oklch(0.982 0.018 155.826)");
    expect(green.light.foreground).toBe("oklch(0.141 0.005 285.823)");
    expect(green.light.ring).toBe(green.light.primary);
    expect(green.light.destructive).toBe("oklch(0.577 0.245 27.325)");
    expect(green.dark.background).toBe("oklch(0.141 0.005 285.823)");
    expect(green.dark.card).toBe("oklch(0.21 0.006 285.885)");
    expect(green.dark.primary).toBe("oklch(0.696 0.17 162.48)");
    expect(green.dark.primaryForeground).toBe("oklch(0.393 0.095 152.535)");
    expect(green.dark.ring).toBe("oklch(0.527 0.154 150.069)");
    expect(green.dark.chart2).toBe(green.dark.primary);
  });

  it("gives Blue a clear primary on a lightly tinted dark surface", () => {
    const blue = getThemePreset("blue").theme;

    expect(blue.light.primary).toBe("oklch(0.55 0.2 255)");
    expect(blue.dark.background).toBe("oklch(0.145 0.006 255)");
    expect(blue.dark.card).not.toBe(blue.dark.background);
    expect(blue.light.chart2).toContain("220");
  });

  it("applies the Violet source palette tokens", () => {
    const violet = getThemePreset("violet").theme;

    expect(violet.light.primary).toBe("oklch(0.606 0.25 292.717)");
    expect(violet.light.primaryForeground).toBe("oklch(0.969 0.016 293.756)");
    expect(violet.light.foreground).toBe("oklch(0.141 0.005 285.823)");
    expect(violet.light.ring).toBe(violet.light.primary);
    expect(violet.light.destructive).toBe("oklch(0.577 0.245 27.325)");
    expect(violet.dark.background).toBe("oklch(0.141 0.005 285.823)");
    expect(violet.dark.card).toBe("oklch(0.21 0.006 285.885)");
    expect(violet.dark.primary).toBe("oklch(0.541 0.281 293.009)");
    expect(violet.dark.ring).toBe(violet.dark.primary);
    expect(violet.dark.destructive).toBe("oklch(0.704 0.191 22.216)");
    expect(violet.dark.chart4).toBe("oklch(0.627 0.265 303.9)");
  });

  it("resolves unknown ids to default without inventing duplicates", () => {
    expect(getThemePreset("not-a-theme" as ThemePresetId).id).toBe("default");
  });

  it("keeps radius options limited and non-mutating", () => {
    expect(radiusOptions.map((option) => option.label)).toEqual([
      "0",
      "0.25",
      "0.5",
      "0.75",
      "1",
      "1.25",
    ]);

    const preset = getThemePreset("rose").theme;
    const next = themeWithRadius(preset, "1.25rem");
    expect(next.radius).toBe("1.25rem");
    expect(preset.radius).toBe(createDefaultTheme().radius);
  });
});
