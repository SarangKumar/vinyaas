import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  AppliedThemeSync,
  applySiteTheme,
  resetSiteTheme,
} from "@/components/applied-theme";
import {
  appliedThemeStorageKey,
  getThemePreset,
  type AppliedTheme,
} from "@/lib/theme-playground";

const violet: AppliedTheme = { presetId: "violet", radius: "1rem" };

function root() {
  return document.documentElement;
}

function tokenValue(name: string) {
  return root().style.getPropertyValue(name);
}

describe("AppliedThemeSync", () => {
  beforeEach(() => {
    localStorage.clear();
    root().removeAttribute("style");
    root().removeAttribute("data-applied-theme");
    root().classList.remove("dark");
  });

  it("leaves the document alone when nothing is applied", () => {
    render(<AppliedThemeSync />);

    expect(root().getAttribute("data-applied-theme")).toBeNull();
    expect(tokenValue("--primary")).toBe("");
  });

  it("applies the stored theme on mount, so it survives a refresh", () => {
    localStorage.setItem(appliedThemeStorageKey, JSON.stringify(violet));

    render(<AppliedThemeSync />);

    expect(tokenValue("--primary")).toBe(
      getThemePreset("violet").theme.light.primary,
    );
    expect(tokenValue("--radius")).toBe("1rem");
    expect(tokenValue("color-scheme")).toBe("light");
    expect(root().getAttribute("data-applied-theme")).toContain("--primary");
  });

  it("picks up Apply and then takes every token back off on Reset", () => {
    render(<AppliedThemeSync />);

    act(() => {
      applySiteTheme(violet);
    });

    expect(tokenValue("--primary")).toBe(
      getThemePreset("violet").theme.light.primary,
    );
    expect(localStorage.getItem(appliedThemeStorageKey)).toBe(
      JSON.stringify(violet),
    );

    act(() => {
      resetSiteTheme();
    });

    expect(localStorage.getItem(appliedThemeStorageKey)).toBeNull();
    expect(root().getAttribute("data-applied-theme")).toBeNull();
    // Nothing of the applied theme may linger, or the site keeps half of it.
    for (const token of [
      "--primary",
      "--background",
      "--radius",
      "--sidebar",
      "color-scheme",
    ]) {
      expect(tokenValue(token)).toBe("");
    }
  });

  it("swaps to the dark tokens when the site switches scheme", async () => {
    render(<AppliedThemeSync />);

    act(() => {
      applySiteTheme(violet);
    });
    expect(tokenValue("--background")).toBe(
      getThemePreset("violet").theme.light.background,
    );

    await act(async () => {
      root().classList.add("dark");
    });

    expect(tokenValue("--background")).toBe(
      getThemePreset("violet").theme.dark.background,
    );
    expect(tokenValue("color-scheme")).toBe("dark");
  });

  it("follows a theme applied in another tab", () => {
    render(<AppliedThemeSync />);

    act(() => {
      localStorage.setItem(appliedThemeStorageKey, JSON.stringify(violet));
      window.dispatchEvent(new Event("storage"));
    });

    expect(tokenValue("--radius")).toBe("1rem");
  });

  it("ignores a stored value it cannot use", () => {
    localStorage.setItem(
      appliedThemeStorageKey,
      JSON.stringify({ presetId: "lavender", radius: "9rem" }),
    );

    render(<AppliedThemeSync />);

    expect(root().getAttribute("data-applied-theme")).toBeNull();
    expect(tokenValue("--primary")).toBe("");
  });
});
