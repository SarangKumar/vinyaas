import { afterEach, describe, expect, it, vi } from "vitest";

import {
  applyTheme,
  preferredTheme,
  readStoredTheme,
  syncDocumentTheme,
  themeStorageKey,
} from "./theme";

describe("theme preference", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    document.cookie = `${themeStorageKey}=; Path=/; Max-Age=0`;
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
    expect(document.cookie).toContain(`${themeStorageKey}=dark`);

    applyTheme("light");

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem(themeStorageKey)).toBe("light");
    expect(document.cookie).toContain(`${themeStorageKey}=light`);
  });

  it("restores a saved dark theme without overwriting storage", () => {
    localStorage.setItem(themeStorageKey, "dark");
    document.documentElement.classList.remove("dark");

    syncDocumentTheme();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(themeStorageKey)).toBe("dark");
    expect(document.cookie).toContain(`${themeStorageKey}=dark`);
  });

  it("restores a saved light theme when the document is dark", () => {
    localStorage.setItem(themeStorageKey, "light");
    document.documentElement.classList.add("dark");

    syncDocumentTheme();

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem(themeStorageKey)).toBe("light");
  });

  it("does not write a preference when only the system is dark", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    document.documentElement.classList.remove("dark");

    syncDocumentTheme();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(themeStorageKey)).toBeNull();
  });
});
