import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { components, newComponents } from "@/components/component-meta";

import ComponentsPage from "./page";

describe("components catalog", () => {
  it("lists names in a responsive grid without cards or descriptions", () => {
    render(<ComponentsPage />);

    const headings = screen.getAllByRole("heading").map((heading) => ({
      name: heading.textContent,
      id: heading.id,
    }));

    expect(headings).toEqual([
      { name: "Components", id: "" },
      { name: "New Components", id: "new" },
      { name: "All Components", id: "all-components" },
    ]);

    const lists = [...document.querySelectorAll("ul")];

    expect(lists).toHaveLength(2);
    for (const list of lists) {
      expect(list).toHaveClass(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-2",
        "md:grid-cols-3",
      );
      expect(list).not.toHaveClass("divide-y", "border");
      expect(list.querySelector("svg")).toBeNull();
    }

    const added = [...newComponents()]
      .map((component) => component.name)
      .sort((a, b) => a.localeCompare(b));
    const all = [...components]
      .map((component) => component.name)
      .sort((a, b) => a.localeCompare(b));

    expect(names(lists[0]!)).toEqual(added);
    expect(names(lists[1]!)).toEqual(all);
    expect(lists[0]!.querySelectorAll(".bg-new").length).toBe(added.length);
    expect(lists[1]!.querySelectorAll(".bg-new").length).toBe(added.length);
    expect(
      lists[1]!.querySelector('a[href="/components/button"] .bg-new'),
    ).toBeNull();
    expect(added).not.toContain("Button");
    expect(all).toContain("Button");
    expect(all).toHaveLength(components.length);
    expect(document.body.textContent).toContain(
      `The catalog has ${components.length} independently installable`,
    );
    expect(document.body.textContent).toContain(
      "Components marked new were introduced in v1.1.0",
    );
    expect(
      screen.queryByText(
        "A versatile button primitive for actions and commands.",
      ),
    ).toBeNull();
    expect(document.body.textContent).not.toContain("An image with a fallback");
  });
});

function names(list: Element) {
  return [...list.querySelectorAll("a")].map((link) =>
    link.textContent?.replace(", new", "").trim(),
  );
}
