import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { components, newComponents } from "@/components/component-meta";

import ComponentsPage from "./page";

describe("components catalog", () => {
  it("lists new components from metadata, then the full name grid", () => {
    render(<ComponentsPage />);

    const headings = screen.getAllByRole("heading").map((heading) => ({
      name: heading.textContent,
      id: heading.id,
    }));

    expect(headings).toEqual([
      { name: "Components", id: "" },
      { name: "New Components", id: "new-components" },
      { name: "All Components", id: "all-components" },
    ]);

    const newlyIntroduced = newComponents();
    expect(newlyIntroduced.map((component) => component.slug).sort()).toEqual([
      "score-ring",
      "toggle",
      "toggle-group",
    ]);

    const newSection = screen.getByRole("heading", {
      name: "New Components",
    }).parentElement;
    expect(newSection).toBeTruthy();
    const toggle = within(newSection!).getByRole("link", {
      name: /two-state button/i,
    });
    expect(toggle).toHaveAttribute("href", "/components/toggle");
    expect(toggle.textContent).toMatch(/v1\.4\.0/);
    expect(toggle.querySelector('[data-nav-indicator="new"]')).toHaveAttribute(
      "aria-label",
      "New",
    );
    expect(
      within(newSection!).queryByRole("link", { name: /Resizable/i }),
    ).toBeNull();

    const lists = [...document.querySelectorAll("ul")];
    // New Components list + All Components grid
    expect(lists.length).toBeGreaterThanOrEqual(2);
    const allGrid = lists.at(-1)!;
    expect(allGrid).toHaveClass("grid", "grid-cols-2", "md:grid-cols-3");
    expect(allGrid.querySelectorAll(".bg-primary").length).toBe(0);
    expect(allGrid.querySelector("svg")).toBeNull();

    const all = [...components]
      .map((component) => component.name)
      .sort((a, b) => a.localeCompare(b));

    expect(names(allGrid)).toEqual(all);
    expect(all).toContain("Button");
    expect(all).toHaveLength(components.length);
    const toggleLink = allGrid.querySelector(
      'a[href="/components/toggle"]',
    ) as HTMLElement | null;
    expect(
      toggleLink?.querySelector('[data-nav-indicator="new"]'),
    ).toHaveAttribute("aria-label", "New");
    // v1.3.0 components lose the dot in the v1.4 line.
    const selectLink = allGrid.querySelector(
      'a[href="/components/select"]',
    ) as HTMLElement | null;
    expect(selectLink?.querySelector('[data-nav-indicator="new"]')).toBeNull();
    const buttonLink = allGrid.querySelector(
      'a[href="/components/button"]',
    ) as HTMLElement | null;
    expect(buttonLink?.querySelector('[data-nav-indicator="new"]')).toBeNull();
    expect(document.body.textContent).toContain(
      `The catalog has ${components.length} independently installable`,
    );
    expect(document.body.textContent).toContain("v1.4.0");
  });
});

function names(list: Element) {
  return [...list.querySelectorAll("a")].map((link) => {
    const label = link.querySelector("span.min-w-0")?.textContent?.trim();
    return label ?? link.textContent?.trim();
  });
}
