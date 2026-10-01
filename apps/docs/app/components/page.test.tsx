import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { components } from "@/components/component-meta";

import ComponentsPage from "./page";

describe("components catalog", () => {
  it("lists names in a responsive grid without cards, descriptions, or new markers", () => {
    render(<ComponentsPage />);

    const headings = screen.getAllByRole("heading").map((heading) => ({
      name: heading.textContent,
      id: heading.id,
    }));

    expect(headings).toEqual([
      { name: "Components", id: "" },
      { name: "All Components", id: "all-components" },
    ]);
    expect(
      screen.queryByRole("heading", { name: "New Components" }),
    ).toBeNull();

    const lists = [...document.querySelectorAll("ul")];

    expect(lists).toHaveLength(1);
    expect(lists[0]).toHaveClass(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "md:grid-cols-3",
    );
    expect(lists[0]!.querySelectorAll(".bg-primary").length).toBe(0);
    expect(lists[0]!.querySelector("svg")).toBeNull();

    const all = [...components]
      .map((component) => component.name)
      .sort((a, b) => a.localeCompare(b));

    expect(names(lists[0]!)).toEqual(all);
    expect(all).toContain("Button");
    expect(all).toHaveLength(components.length);
    expect(document.body.textContent).toContain(
      `The catalog has ${components.length} independently installable`,
    );
    expect(document.body.textContent).toContain("v1.2.0");
    expect(document.body.textContent).not.toContain("marked new");
    expect(
      screen.queryByText(
        "A versatile button primitive for actions and commands.",
      ),
    ).toBeNull();
  });
});

function names(list: Element) {
  return [...list.querySelectorAll("a")].map((link) =>
    link.textContent?.trim(),
  );
}
