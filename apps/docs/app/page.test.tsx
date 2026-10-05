import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { SHOWCASE_BLOCK_COUNT } from "@/app/home/showcase-blocks";

import Home from "./page";

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

describe("homepage", () => {
  it("renders the hero, playground masonry, and side rails", async () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Build. Ship. Beautifully.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/components",
    );
    expect(document.body.textContent).not.toContain(
      "Explore Companions, Themes, and Typeset playgrounds",
    );
    expect(document.body.textContent).toContain("vinyaas init");
    expect(document.querySelector("[data-home-brand]")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Vinyaas" })).toBeInTheDocument();

    await waitFor(() => {
      expect(document.querySelector("[data-playground]")).toBeTruthy();
    });

    expect(document.querySelector("[data-companion-showcase]")).toBeNull();
    expect(
      document.querySelector("[data-companion-home-preview]"),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Companion" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ember" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Soul" })).toBeNull();
    expect(screen.queryByRole("img", { name: "Moss" })).toBeNull();
    expect(
      screen.getByRole("link", { name: "Meet companions" }),
    ).toHaveAttribute("href", "/companion");

    const playground = document.querySelector("[data-playground]");
    expect(playground).toBeTruthy();
    expect(document.querySelector("[data-playground-grid]")).toHaveAttribute(
      "data-playground-mode",
      "showcase",
    );
    expect(document.querySelector("[data-playground]")).toHaveAttribute(
      "data-showcase-count",
      String(SHOWCASE_BLOCK_COUNT),
    );
    expect(document.querySelectorAll("[data-play-block]")).toHaveLength(
      SHOWCASE_BLOCK_COUNT,
    );
    const grid = document.querySelector("[data-playground-grid]");
    expect(grid?.className).toMatch(/\bgrid\b/);
    expect(grid?.className).toMatch(/md:grid-cols-2/);
    expect(grid?.className).toMatch(/lg:grid-cols-3/);
    expect(grid?.className).toMatch(/min-\[1400px\]:grid-cols-4!/);
    expect(grid?.className).toMatch(/min-\[1900px\]:grid-cols-5!/);
    expect(playground?.className).toMatch(/xl:max-w-\[1600px\]/);
    expect(playground?.className).toMatch(/2xl:max-w-\[1900px\]/);
    expect(
      document.querySelector("[data-playground-shell]")?.className,
    ).toMatch(/flex-col/);
    expect(document.querySelectorAll("[data-playground-column]")).toHaveLength(
      5,
    );
    expect(document.body.textContent).toContain("v1.3.0");
    expect(document.querySelectorAll("[data-playground-item]")).toHaveLength(0);
    const playBlock = document.querySelector("[data-play-block]");
    expect(playBlock?.className).not.toMatch(/mb-\(--gap\)/);

    expect(document.querySelector("[data-playground-rails]")).toBeTruthy();
    const leftRail = document.querySelector('[data-playground-side="left"]');
    const rightRail = document.querySelector('[data-playground-side="right"]');
    expect(leftRail?.className).toContain("grid-cols-[repeat(2,");
    expect(rightRail?.className).toContain("grid-cols-[repeat(2,");
    expect(document.querySelector("[data-playground-blur]")).toBeTruthy();

    expect(
      screen.getByRole("heading", { name: "Traffic" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Resizable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("separator", { name: "Resize sidebar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sidebar" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Main content").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Select" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Storefront" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Drag & Drop" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reorder Revenue" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Workspace settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Continue with Google/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: /Continue with GitHub/i }).length,
    ).toBeGreaterThan(0);

    fireEvent.change(screen.getByRole("textbox", { name: "Search people" }), {
      target: { value: "Priya" },
    });
    expect(screen.getByText("1 people")).toBeInTheDocument();
  });
});
