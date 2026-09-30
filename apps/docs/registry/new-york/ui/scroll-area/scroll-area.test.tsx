import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScrollArea } from ".";

describe("ScrollArea", () => {
  it("is a native scroll container with a vertical scrollbar hook", () => {
    render(
      <ScrollArea className="h-24" aria-label="Notes">
        <p>One</p>
      </ScrollArea>,
    );

    const region = screen.getByLabelText("Notes");

    expect(region.tagName).toBe("DIV");
    expect(region).toHaveAttribute("data-orientation", "vertical");
    expect(region).toHaveClass("overflow-y-auto", "h-24");
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).not.toHaveAttribute("role");
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(region.querySelector("[data-scroll-bar]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("supports horizontal overflow and merges className", () => {
    render(
      <ScrollArea orientation="horizontal" className="max-w-xs">
        <p>Line</p>
      </ScrollArea>,
    );

    const region = screen.getByText("Line").parentElement;

    expect(region).toHaveAttribute("data-orientation", "horizontal");
    expect(region).toHaveClass("overflow-x-auto", "max-w-xs");
    expect(region?.querySelector("[data-scroll-bar]")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("scrolls on both axes when asked", () => {
    render(
      <ScrollArea orientation="both">
        <p>Both</p>
      </ScrollArea>,
    );

    expect(screen.getByText("Both").parentElement).toHaveClass("overflow-auto");
  });
});
