import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("renders a decorative placeholder", () => {
    render(<Skeleton className="h-4 w-64" data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton.tagName).toBe("DIV");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).not.toHaveAttribute("role");
    expect(skeleton).toHaveClass(
      "bg-muted",
      "animate-pulse",
      "motion-reduce:animate-none",
      "h-4",
      "w-64",
    );
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Skeleton ref={ref} data-testid="skeleton" />);

    expect(ref.current).toBe(screen.getByTestId("skeleton"));
  });
});
