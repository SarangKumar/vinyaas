import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { themeStorageKey } from "./theme";
import { ThemeSync } from "./theme-sync";

const pathname = vi.hoisted(() => ({ value: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
}));

describe("ThemeSync", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    pathname.value = "/";
    vi.unstubAllGlobals();
  });

  it("applies a saved dark theme and keeps it across navigation", () => {
    localStorage.setItem(themeStorageKey, "dark");
    document.documentElement.classList.remove("dark");

    const view = render(<ThemeSync />);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(themeStorageKey)).toBe("dark");

    document.documentElement.classList.remove("dark");
    pathname.value = "/components/card";
    view.rerender(<ThemeSync />);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(themeStorageKey)).toBe("dark");
  });

  it("applies a saved light theme", () => {
    localStorage.setItem(themeStorageKey, "light");
    document.documentElement.classList.add("dark");

    render(<ThemeSync />);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem(themeStorageKey)).toBe("light");
  });

  it("restores a saved dark theme when the document class is cleared", async () => {
    localStorage.setItem(themeStorageKey, "dark");

    render(<ThemeSync />);
    document.documentElement.className = "h-full";

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
    expect(localStorage.getItem(themeStorageKey)).toBe("dark");
  });

  it("follows the system preference when nothing is saved", () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));

    render(<ThemeSync />);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(themeStorageKey)).toBeNull();
  });
});
