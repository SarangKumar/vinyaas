import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  appliedThemeConfig,
  appliedThemeStorageKey,
  createDefaultTheme,
  defaultSelection,
  getThemePreset,
  parseAppliedTheme,
  readAppliedTheme,
  sameAppliedTheme,
  siteThemeVariables,
} from "./index";

describe("applied theme selection", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("accepts a known preset and radius, and rejects anything else", () => {
    expect(parseAppliedTheme({ presetId: "violet", radius: "1rem" })).toEqual({
      presetId: "violet",
      radius: "1rem",
    });

    // A preset that no longer exists, an unlisted radius, and junk shapes all
    // mean "nothing applied" rather than a half-applied theme.
    expect(
      parseAppliedTheme({ presetId: "lavender", radius: "1rem" }),
    ).toBeNull();
    expect(
      parseAppliedTheme({ presetId: "violet", radius: "3rem" }),
    ).toBeNull();
    expect(parseAppliedTheme({ presetId: "violet" })).toBeNull();
    expect(parseAppliedTheme(null)).toBeNull();
    expect(parseAppliedTheme([])).toBeNull();
    expect(parseAppliedTheme("violet")).toBeNull();
  });

  it("compares selections and treats null as nothing applied", () => {
    const selection = { presetId: "blue", radius: "0.5rem" } as const;

    expect(sameAppliedTheme(selection, { ...selection })).toBe(true);
    expect(
      sameAppliedTheme(selection, { presetId: "blue", radius: "1rem" }),
    ).toBe(false);
    expect(sameAppliedTheme(selection, null)).toBe(false);
    expect(sameAppliedTheme(null, null)).toBe(true);
  });

  it("reads storage, ignoring absent, invalid, and unparsable values", () => {
    expect(readAppliedTheme()).toBeNull();

    localStorage.setItem(
      appliedThemeStorageKey,
      JSON.stringify({ presetId: "green", radius: "0.25rem" }),
    );
    expect(readAppliedTheme()).toEqual({
      presetId: "green",
      radius: "0.25rem",
    });

    localStorage.setItem(appliedThemeStorageKey, "not json");
    expect(readAppliedTheme()).toBeNull();

    localStorage.setItem(appliedThemeStorageKey, JSON.stringify({ a: 1 }));
    expect(readAppliedTheme()).toBeNull();
  });

  it("survives storage that throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });

    expect(readAppliedTheme()).toBeNull();
  });

  it("builds the preset theme at the selected radius", () => {
    const config = appliedThemeConfig({ presetId: "rose", radius: "1.25rem" });

    expect(config.radius).toBe("1.25rem");
    expect(config.light.primary).toBe(
      getThemePreset("rose").theme.light.primary,
    );
  });

  it("starts on the default preset at 0.75rem", () => {
    expect(defaultSelection).toEqual({
      presetId: "default",
      radius: "0.75rem",
    });
  });
});

describe("siteThemeVariables", () => {
  it("covers the document tokens, including sidebar and color-scheme", () => {
    const theme = createDefaultTheme();
    theme.light.primary = "oklch(0.5 0.1 30)";

    const light = siteThemeVariables(theme, "light");
    const dark = siteThemeVariables(theme, "dark");

    expect(light["--primary"]).toBe("oklch(0.5 0.1 30)");
    expect(light["--radius"]).toBe(theme.radius);
    expect(light["color-scheme"]).toBe("light");
    // Sidebar follows the surface it sits on, as generateThemeCss derives it.
    expect(light["--sidebar"]).toBe("var(--background)");
    expect(dark["--sidebar"]).toBe("var(--card)");
    expect(dark["--primary"]).toBe(theme.dark.primary);
    expect(dark["color-scheme"]).toBe("dark");

    for (const token of [
      "--background",
      "--foreground",
      "--card",
      "--popover",
      "--secondary",
      "--muted",
      "--accent",
      "--destructive",
      "--border",
      "--input",
      "--ring",
      "--chart-1",
      "--sidebar-border",
      "--sidebar-ring",
    ]) {
      expect(light[token]).toBeTruthy();
    }
  });
});
