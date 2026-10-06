import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { SHOWCASE_BLOCK_COUNT } from "@/app/home/showcase-blocks";
import { getShowcaseColumnCount } from "@/components/playground/playground-layout";

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

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => {
      const width = window.innerWidth;
      const minWidth = Number(/min-width:\s*(\d+)px/.exec(query)?.[1] ?? 0);
      return {
        matches: width >= minWidth,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
          return false;
        },
      };
    },
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
    expect(
      screen.getByRole("link", { name: "Open Companions page" }),
    ).toHaveAttribute("href", "/companion");

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
    expect(document.querySelector("[data-playground]")).toHaveAttribute(
      "data-showcase-filter",
      "none",
    );
    expect(document.querySelector("[data-showcase-empty]")).toBeNull();
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
      getShowcaseColumnCount(window.innerWidth),
    );
    expect(document.querySelector("[data-playground]")).toHaveAttribute(
      "data-showcase-columns",
      String(getShowcaseColumnCount(window.innerWidth)),
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
      screen.getByRole("separator", { name: "Resize panels" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Outline").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Preview").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "Schedule" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Deadline" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Assignee" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Empty workspace" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Search" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Timezone" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Invoices" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Verify email" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Profile form" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Storefront" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Sidebar" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Navigation Menu" }),
    ).not.toBeInTheDocument();
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
      screen.getByRole("button", { name: /pick a deadline/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /maya chen|select assignee/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create project/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Search projects" }), {
      target: { value: "Priya" },
    });
    expect(screen.getByText("1 projects")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open Vinyaas Docs" }),
    ).toBeInTheDocument();
  });
});
