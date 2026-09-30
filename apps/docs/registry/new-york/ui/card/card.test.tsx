import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ".";

describe("Card", () => {
  it("composes the sections and merges class names", () => {
    render(
      <Card className="max-w-sm" id="profile">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">Sarah Johnson</CardTitle>
          <CardDescription className="text-xs">
            Product Designer
          </CardDescription>
          <CardAction className="shrink-0">
            <button type="button">More</button>
          </CardAction>
        </CardHeader>
        <CardContent className="text-sm">Available for projects.</CardContent>
        <CardFooter className="justify-end">
          <button type="button">View profile</button>
        </CardFooter>
      </Card>,
    );

    const card = document.getElementById("profile");

    expect(card?.tagName).toBe("DIV");
    expect(card).toHaveAttribute("data-size", "default");
    expect(card).toHaveClass(
      "rounded-md",
      "border",
      "gap-4",
      "p-4",
      "max-w-sm",
    );
    expect(card?.querySelector("header")).toHaveClass("gap-2");
    expect(screen.getByText("Sarah Johnson")).toHaveClass("text-base");
    expect(screen.getByText("Product Designer").tagName).toBe("P");
    expect(screen.getByText("Product Designer")).toHaveClass("text-xs");
    expect(screen.getByText("Available for projects.")).toHaveClass("text-sm");
    expect(card?.querySelector("[data-slot=card-action]")).toHaveClass(
      "shrink-0",
    );
    expect(card?.querySelector("footer")).toHaveClass("justify-end");
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View profile" }),
    ).toBeInTheDocument();
  });

  it("uses tighter spacing for the small size", () => {
    render(<Card size="sm">Compact</Card>);

    const card = screen.getByText("Compact");

    expect(card).toHaveAttribute("data-size", "sm");
    expect(card).toHaveClass("gap-2", "p-3");
    expect(card).not.toHaveClass("gap-4");
    expect(card).not.toHaveClass("p-4");
  });
});
