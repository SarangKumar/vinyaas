import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

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
    expect(document.body.textContent).toContain("v1.2.0");

    expect(
      screen.getByRole("heading", { name: "Meet Vinyaas Companions" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ember" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Soul" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Moss" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Skeleton" })).toBeNull();
    expect(document.querySelector("[data-companion-showcase]")).toBeTruthy();

    const playground = document.querySelector("[data-playground]");
    expect(playground).toBeTruthy();
    expect(playground?.className).toContain("min-[1900px]:columns-5!");

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
