import { afterEach, describe, expect, it, vi } from "vitest";

import {
  applyTheme,
  preferredTheme,
  readStoredTheme,
  themeInitScript,
  themeStorageKey,
} from "./theme";

describe("theme preference", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    vi.unstubAllGlobals();
  });

  it("uses the stored theme before the system preference", () => {
    localStorage.setItem(themeStorageKey, "light");
    vi.stubGlobal("matchMedia", () => ({ matches: true }));

    expect(readStoredTheme()).toBe("light");
    expect(preferredTheme()).toBe("light");
  });

  it("follows a dark system preference when nothing is stored", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));

    expect(readStoredTheme()).toBeNull();
    expect(preferredTheme()).toBe("dark");
  });

  it("stores the choice and applies it to the document", () => {
    applyTheme("dark");

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(themeStorageKey)).toBe("dark");

    applyTheme("light");

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem(themeStorageKey)).toBe("light");
  });

  it("initializes from storage or the system preference before paint", () => {
    expect(themeInitScript).toContain(themeStorageKey);
    expect(themeInitScript).toContain("prefers-color-scheme: dark");
    expect(themeInitScript).toContain('classList.toggle("dark"');
    expect(themeInitScript).not.toContain("localStorage.setItem");
  });
});
