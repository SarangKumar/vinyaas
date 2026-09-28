import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ComponentsPage from "./page";

describe("components catalog", () => {
  it("lists every component once in alphabetical order", () => {
    render(<ComponentsPage />);

    const headings = screen.getAllByRole("heading").map((heading) => ({
      name: heading.textContent,
      id: heading.id,
    }));

    expect(headings).toEqual([
      { name: "Components", id: "" },
      { name: "Overview", id: "overview" },
      { name: "All Components", id: "all-components" },
      { name: "Using Components", id: "using-components" },
    ]);

    const list = document.querySelector("ul");

    expect(list).not.toBeNull();
    expect(list).toHaveClass("divide-y", "border");
    expect(list).not.toHaveClass("grid-cols-1");

    expect(
      screen.getByText(
        "A versatile button primitive for actions and commands.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("An image with a fallback for a person or entity."),
    ).toBeInTheDocument();

    expect(list?.querySelector('a[href="/components/button"]')).not.toBeNull();
    expect(
      list?.querySelector('a[href="/components/card"]')?.textContent,
    ).toContain(", new");

    const allNames = [...(list?.querySelectorAll("a") ?? [])].map((link) =>
      link.querySelector("span span")?.childNodes[0]?.textContent?.trim(),
    );

    expect(allNames).toEqual(
      [...allNames].sort((a, b) => (a ?? "").localeCompare(b ?? "")),
    );

    expect(
      document.querySelectorAll('a[href="/components/avatar"]'),
    ).toHaveLength(1);
    expect(
      document.querySelectorAll('a[href="/components/button"]'),
    ).toHaveLength(1);

    const button = document.querySelector('a[href="/components/button"]');

    expect(button).toHaveClass("no-underline");
    expect(button?.textContent).not.toContain(", new");
    expect(button?.querySelector("svg")).not.toBeNull();
  });
});
