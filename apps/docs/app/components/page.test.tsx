import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ComponentsPage from "./page";

describe("components catalog", () => {
  it("separates new components from the full alphabetical catalog", () => {
    render(<ComponentsPage />);

    const headings = screen.getAllByRole("heading").map((heading) => ({
      name: heading.textContent,
      id: heading.id,
    }));

    expect(headings).toEqual([
      { name: "Components", id: "" },
      { name: "Overview", id: "overview" },
      { name: "New Components", id: "new-components" },
      { name: "All Components", id: "all-components" },
      { name: "Using Components", id: "using-components" },
      { name: "What's Next", id: "whats-next" },
    ]);

    const lists = document.querySelectorAll("ul");

    expect(lists).toHaveLength(2);
    for (const list of lists) {
      expect(list).toHaveClass(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-2",
        "xl:grid-cols-3",
      );
    }

    expect(
      screen.getAllByText(
        "A versatile button primitive for actions and commands.",
      ).length,
    ).toBeGreaterThan(0);

    const radioLinks = document.querySelectorAll(
      'a[href="/components/radio-group"]',
    );
    const buttonLink = document.querySelector('a[href="/components/button"]');

    expect(radioLinks).toHaveLength(2);
    expect(radioLinks[0]).toHaveClass("no-underline");
    expect(radioLinks[0]).not.toHaveClass("underline");
    expect(radioLinks[0]?.textContent).toContain(", new");
    expect(buttonLink).toHaveClass("no-underline");
    expect(buttonLink).not.toHaveClass("underline");
    expect(buttonLink?.textContent).not.toContain(", new");
  });
});
