import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";
import { getThemePreset } from "@/lib/theme-playground";

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

describe("Themes playground page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.documentElement.classList.remove("dark");
  });

  it("exports SEO metadata for the themes playground", () => {
    expect(metadata.title).toBe("Themes");
    expect(metadata.description).toMatch(/theme presets/i);
    expect(metadata.alternates).toMatchObject({ canonical: "/themes" });
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
    expect(screen.queryByText("Hot components")).not.toBeInTheDocument();
    expect(screen.queryByText("June 2025")).not.toBeInTheDocument();
    expect(screen.queryByText("Total Revenue")).not.toBeInTheDocument();
    expect(document.querySelector("[data-playground-content]")).toBeTruthy();
    expect(document.querySelector("[data-playground-grid]")).toHaveAttribute(
      "data-playground-columns",
    );
    expect(
      document.querySelectorAll("[data-playground-column]").length,
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
