import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders an inline label and supports variants", () => {
    const { rerender } = render(<Badge>Pro</Badge>);
    const badge = () => screen.getByText("Pro");

    expect(badge().tagName).toBe("SPAN");
    expect(badge()).toHaveClass("bg-primary", "text-primary-foreground");

    rerender(<Badge variant="secondary">Pro</Badge>);
    expect(badge()).toHaveClass("bg-secondary", "text-secondary-foreground");

    rerender(<Badge variant="outline">Pro</Badge>);
    expect(badge()).toHaveClass("border", "text-foreground");

    rerender(<Badge variant="destructive">Pro</Badge>);
    expect(badge()).toHaveClass(
      "bg-destructive",
      "text-destructive-foreground",
    );
  });

  it("merges className", () => {
    render(<Badge className="ml-2">3</Badge>);

    expect(screen.getByText("3")).toHaveClass("ml-2");
  });
});
