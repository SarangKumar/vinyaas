import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders an inline label and supports every variant", () => {
    const { rerender } = render(<Badge>Pro</Badge>);
    const badge = () => screen.getByText("Pro");

    expect(badge().tagName).toBe("SPAN");
    expect(badge()).toHaveClass(
      "rounded-md",
      "bg-primary",
      "text-primary-foreground",
    );

    rerender(<Badge variant="secondary">Pro</Badge>);
    expect(badge()).toHaveClass("bg-secondary", "text-secondary-foreground");

    rerender(<Badge variant="destructive">Pro</Badge>);
    expect(badge()).toHaveClass(
      "bg-destructive",
      "text-destructive-foreground",
    );

    rerender(<Badge variant="outline">Pro</Badge>);
    expect(badge()).toHaveClass("border", "text-foreground");

    rerender(<Badge variant="ghost">Pro</Badge>);
    expect(badge()).toHaveClass("hover:bg-accent");

    rerender(<Badge variant="link">Pro</Badge>);
    expect(badge()).toHaveClass("text-primary", "hover:underline");
  });

  it("merges className and forwards native props", () => {
    render(
      <Badge className="bg-accent text-accent-foreground" id="beta">
        Beta
      </Badge>,
    );

    const badge = screen.getByText("Beta");

    expect(badge).toHaveClass("bg-accent", "text-accent-foreground");
    expect(badge).toHaveAttribute("id", "beta");
  });
});
