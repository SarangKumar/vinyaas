import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

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
  it("renders the hero, playground masonry, and side rails", () => {
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
    expect(
      screen.getAllByRole("link", { name: "Companions" })[0],
    ).toHaveAttribute("href", "/companion");
    expect(screen.getByRole("link", { name: "Themes" })).toHaveAttribute(
      "href",
      "/themes",
    );
    expect(screen.getByRole("link", { name: "Typeset" })).toHaveAttribute(
      "href",
      "/typeset",
    );
    expect(document.body.textContent).toContain("vinyaas init");
    expect(document.body.textContent).toContain("v1.3.0");
    expect(document.querySelector("[data-home-brand]")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Vinyaas" })).toBeInTheDocument();

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
    expect(
      document.querySelectorAll("[data-playground-column]").length,
    ).toBeGreaterThanOrEqual(1);
    // Vertical rhythm comes from column gap only (not stacked card margins).
    expect(
      document.querySelector("[data-playground-column]")?.className,
    ).toMatch(/gap-\(--gap\)/);
    const playBlock = document.querySelector("[data-play-block]");
    expect(playBlock?.className).not.toMatch(/mb-\(--gap\)/);

    const leftRail = document.querySelector('[data-playground-side="left"]');
    const rightRail = document.querySelector('[data-playground-side="right"]');
    expect(leftRail?.className).toContain("grid-cols-[repeat(2,");
    expect(rightRail?.className).toContain("grid-cols-[repeat(2,");
    expect(
      document.querySelector('[data-playground-side-fade="left"]'),
    ).toBeTruthy();
    expect(
      document.querySelector('[data-playground-side-fade="right"]'),
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", { name: "Traffic" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Workspace" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("separator", { name: "Resize explorer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("separator", { name: "Resize terminal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Studio controls" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Storefront" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Uploads" }),
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
