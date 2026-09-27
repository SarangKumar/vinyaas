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
    expect(
      screen.getAllByText("An image with a fallback for a person or entity.")
        .length,
    ).toBeGreaterThan(0);

    const newList = lists[0];
    const allList = lists[1];

    expect(newList?.querySelector('a[href="/components/button"]')).toBeNull();
    expect(
      newList?.querySelector('a[href="/components/card"]')?.textContent,
    ).toContain(", new");
    expect(
      allList?.querySelector('a[href="/components/button"]'),
    ).not.toBeNull();

    const allNames = [...(allList?.querySelectorAll("a") ?? [])].map((link) =>
      link.querySelector("span")?.childNodes[0]?.textContent?.trim(),
    );

    expect(allNames).toEqual(
      [...allNames].sort((a, b) => (a ?? "").localeCompare(b ?? "")),
    );

    const avatarLinks = document.querySelectorAll(
      'a[href="/components/avatar"]',
    );

    expect(avatarLinks).toHaveLength(2);
    expect(avatarLinks[0]?.textContent).toContain(", new");

    const radioLinks = document.querySelectorAll(
      'a[href="/components/radio-group"]',
    );
    const buttonLinks = document.querySelectorAll(
      'a[href="/components/button"]',
    );

    expect(buttonLinks).toHaveLength(1);
    expect(radioLinks).toHaveLength(2);
    expect(radioLinks[0]).toHaveClass("no-underline");
    expect(radioLinks[0]).not.toHaveClass("underline");
    expect(radioLinks[0]?.textContent).toContain(", new");
    expect(buttonLinks[0]).toHaveClass("no-underline");
    expect(buttonLinks[0]).not.toHaveClass("underline");
    expect(buttonLinks[0]?.textContent).not.toContain(", new");
  });
});
