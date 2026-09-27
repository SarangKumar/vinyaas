import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ComponentsPage from "./page";

describe("components catalog", () => {
  it("lists components alphabetically with descriptions and page headings", () => {
    render(<ComponentsPage />);

    const headings = screen.getAllByRole("heading").map((heading) => ({
      name: heading.textContent,
      id: heading.id,
    }));

    expect(headings).toEqual([
      { name: "Components", id: "" },
      { name: "Overview", id: "overview" },
      { name: "Available Components", id: "available-components" },
      { name: "Forms", id: "forms" },
      { name: "Button", id: "button" },
      { name: "Checkbox", id: "checkbox" },
      { name: "Input", id: "input" },
      { name: "Label", id: "label" },
      { name: "Radio Group", id: "radio-group" },
      { name: "Textarea", id: "textarea" },
      { name: "Using Components", id: "using-components" },
      { name: "What's Next", id: "whats-next" },
    ]);
    expect(
      screen.getByText(
        "A versatile button primitive for actions and commands.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A group of mutually exclusive selectable options."),
    ).toBeInTheDocument();

    const button = screen.getByRole("link", { name: "Button, new" });

    expect(button).toHaveAttribute("href", "/components/button");
    expect(button).toHaveClass("no-underline");
    expect(button).not.toHaveClass("underline");
    expect(
      screen.getByRole("link", { name: "Radio Group, new" }),
    ).toHaveAttribute("href", "/components/radio-group");
  });
});
