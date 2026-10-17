import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { AppliedThemeSync } from "@/components/applied-theme";
import { DocsStoreProvider } from "@/lib/store/provider";
import {
  appliedThemeStorageKey,
  defaultSelection,
  getThemePreset,
} from "@/lib/theme-playground";

import { themeExamples } from "./examples";
import ThemesPage, { metadata } from "./page";

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: ResizeObserverMock,
  });
  Object.defineProperty(globalThis, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: ResizeObserverMock,
  });
});

function renderThemes() {
  return render(
    <DocsStoreProvider>
      <ThemesPage />
    </DocsStoreProvider>,
  );
}

/** The site-wide applier lives in the root layout, so tests mount it too. */
function renderThemesWithSite() {
  return render(
    <DocsStoreProvider>
      <AppliedThemeSync />
      <ThemesPage />
    </DocsStoreProvider>,
  );
}

function applyButton() {
  return screen.getByRole("button", { name: "Apply theme to the site" });
}

function resetButton() {
  return screen.getByRole("button", { name: "Reset to the default theme" });
}

describe("Themes playground page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("style");
    document.documentElement.removeAttribute("data-applied-theme");
    localStorage.clear();
  });

  it("exports SEO metadata for the themes playground", () => {
    expect(metadata.title).toBe("Themes");
    expect(metadata.description).toMatch(/theme presets/i);
    expect(metadata.alternates).toMatchObject({ canonical: "/themes" });
  });

  it("themes overlay layers that portal out of the preview wrapper", async () => {
    renderThemes();

    const wrapper = document.querySelector("[data-theme-playground]");
    expect(wrapper).toBeTruthy();
    // The marker the portal rules key off has to sit on <body>, because the
    // layers themselves are body children.
    expect(document.body.classList.contains("vinyaas-theme-preview")).toBe(
      true,
    );

    const portalCss = [...document.querySelectorAll("style")]
      .map((node) => node.textContent ?? "")
      .find((css) => css.includes("vinyaas-theme-preview"));
    expect(portalCss).toBeTruthy();
    // Scoped to the layer roles, so page chrome keeps the site theme.
    expect(portalCss).toContain('body.vinyaas-theme-preview > [role="dialog"]');
    expect(portalCss).toContain(
      'body.vinyaas-theme-preview > [role="listbox"]',
    );
    // `--popover` is only ever read by a portalled layer, so it is the token
    // that proves the preview reaches them.
    const { theme } = getThemePreset(defaultSelection.presetId);
    expect(portalCss).toContain(`--popover: ${theme.light.popover};`);
    expect(portalCss).toContain("--radius:");

    // Opening a Select really does escape the wrapper.
    fireEvent.click(screen.getByRole("combobox", { name: "Role" }));
    const listbox = await waitFor(() => screen.getByRole("listbox"));
    expect(wrapper?.contains(listbox)).toBe(false);
    expect(document.body.contains(listbox)).toBe(true);
  });

  it("renders presets, radius, masonry compositions, and Copy code dialog", () => {
    renderThemes();

    expect(
      screen.getByRole("heading", { level: 1, name: "Themes" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yellow" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Radius" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
    expect(themeExamples.length).toBeGreaterThanOrEqual(16);
    expect(document.querySelectorAll("[data-playground-block]").length).toBe(
      themeExamples.length,
    );
    expect(screen.getByText("CLI installs")).toBeInTheDocument();
    expect(screen.getByText("Registry traffic")).toBeInTheDocument();
    expect(screen.getByText("Workspace access")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Resizable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Calendar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Date picker" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Combobox" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Empty state" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Form" })).toBeInTheDocument();
    expect(screen.queryByText("Hot components")).not.toBeInTheDocument();
    expect(screen.queryByText("June 2025")).not.toBeInTheDocument();
    expect(screen.queryByText("Total Revenue")).not.toBeInTheDocument();
    expect(document.querySelector("[data-playground-content]")).toBeTruthy();
    const grid = document.querySelector("[data-playground-grid]");

    expect(grid?.className).toMatch(/\bgrid\b/);
    expect(grid?.className).not.toMatch(/columns-/);
    // Every card sits in one of the column stacks, and the stacks are the
    // grid's only children, so all columns share a top edge.
    expect(
      Number(grid?.getAttribute("data-playground-columns")),
    ).toBeGreaterThanOrEqual(1);
    expect(document.querySelectorAll("[data-playground-column]").length).toBe(
      Number(grid?.getAttribute("data-playground-columns")),
    );
    expect(document.querySelector("[data-playground-grid]")).toHaveAttribute(
      "data-playground-mode",
      "playground",
    );
    expect(
      document.querySelectorAll("[data-playground-item]").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: "Yellow" })).toHaveAttribute(
      "aria-label",
      "Yellow",
    );
    expect(screen.getByRole("button", { name: "Green" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Red" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Blue" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Violet" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Lavender" })).toBeNull();
  });

  it("scopes preset selection to the playground wrapper", () => {
    renderThemes();

    const playground = document.querySelector("[data-theme-playground]");
    const beforePrimary = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--primary");

    fireEvent.click(screen.getByRole("button", { name: "Yellow" }));

    expect(playground).toHaveAttribute("data-theme-preset", "yellow");
    expect(playground?.getAttribute("style")).toContain(
      getThemePreset("yellow").theme.light.primary,
    );
    expect(
      getComputedStyle(document.documentElement).getPropertyValue("--primary"),
    ).toBe(beforePrimary);
  });

  it("holds a selection in preview until Apply, then marks it applied", () => {
    renderThemesWithSite();

    const root = document.documentElement;
    expect(screen.getByText("Preview only")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Violet" }));

    // Still preview: the strip says so and the document is untouched.
    expect(screen.getByText("Preview only")).toBeInTheDocument();
    expect(root.style.getPropertyValue("--primary")).toBe("");

    fireEvent.click(applyButton());

    expect(screen.getByText("Applied to site")).toBeInTheDocument();
    expect(root.style.getPropertyValue("--primary")).toBe(
      getThemePreset("violet").theme.light.primary,
    );
    expect(localStorage.getItem(appliedThemeStorageKey)).toBe(
      JSON.stringify({ presetId: "violet", radius: "0.75rem" }),
    );
  });

  it("disables Apply while the selection already matches the site", () => {
    renderThemesWithSite();

    // Nothing applied yet, so applying the opening selection is a real change.
    expect(applyButton()).toBeEnabled();

    fireEvent.click(applyButton());
    expect(applyButton()).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "1.25" }));
    expect(applyButton()).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "0.75" }));
    expect(applyButton()).toBeDisabled();
  });

  it("restores the default theme and selection on Reset", () => {
    renderThemesWithSite();

    fireEvent.click(screen.getByRole("button", { name: "Green" }));
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(applyButton());

    expect(document.documentElement.style.getPropertyValue("--radius")).toBe(
      "1rem",
    );

    fireEvent.click(resetButton());

    expect(localStorage.getItem(appliedThemeStorageKey)).toBeNull();
    expect(document.documentElement.style.getPropertyValue("--radius")).toBe(
      "",
    );
    expect(
      document.documentElement.getAttribute("data-applied-theme"),
    ).toBeNull();
    // The selector returns to the default preset and radius.
    expect(screen.getByRole("button", { name: "Default" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "0.75" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(resetButton()).toBeDisabled();
  });

  it("opens the selector on the applied theme after a refresh", () => {
    localStorage.setItem(
      appliedThemeStorageKey,
      JSON.stringify({ presetId: "blue", radius: "0.5rem" }),
    );

    renderThemesWithSite();

    expect(screen.getByRole("button", { name: "Blue" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "0.5" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Applied to site")).toBeInTheDocument();
    expect(applyButton()).toBeDisabled();
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe(
      getThemePreset("blue").theme.light.primary,
    );
  });

  it("opens a code dialog and copies generated theme CSS from the header", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    renderThemes();

    fireEvent.click(screen.getByRole("button", { name: "0.75" }));
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Theme")).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        "Copy and paste the following code into your CSS file.",
      ),
    ).toBeInTheDocument();
    expect(
      dialog.querySelector("[data-playground-code]")?.textContent,
    ).toContain("--radius: 0.75rem");

    fireEvent.click(within(dialog).getByRole("button", { name: "Copy code" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });

    expect(writeText.mock.calls[0]?.[0]).toContain("--radius: 0.75rem");
    expect(writeText.mock.calls[0]?.[0]).toContain('@import "tailwindcss"');
  });
});
