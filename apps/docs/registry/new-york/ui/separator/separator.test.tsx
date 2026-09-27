import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Separator } from "./separator";

describe("Separator", () => {
  it("renders a native horizontal rule", () => {
    render(<Separator />);

    const separator = screen.getByRole("separator");

    expect(separator.tagName).toBe("HR");
    expect(separator).not.toHaveAttribute("aria-orientation");
    expect(separator).not.toHaveAttribute("role");
    expect(separator).toHaveClass("h-px", "w-full", "bg-border");
  });

  it("renders a vertical separator with an explicit orientation", () => {
    render(<Separator orientation="vertical" className="h-8" />);

    const separator = screen.getByRole("separator");

    expect(separator.tagName).toBe("DIV");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
    expect(separator).toHaveClass("w-px", "h-8");
    expect(separator).not.toHaveClass("h-4");
  });

  it("forwards a ref on the horizontal separator", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Separator ref={ref} />);

    expect(ref.current?.tagName).toBe("HR");
  });
});
