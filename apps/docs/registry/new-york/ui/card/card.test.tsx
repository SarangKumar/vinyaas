import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("composes the sections and merges class names", () => {
    render(
      <Card className="max-w-sm" id="profile">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">Sarah Johnson</CardTitle>
          <CardDescription className="text-xs">
            Product Designer
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">Available for projects.</CardContent>
        <CardFooter className="justify-end">
          <button type="button">View profile</button>
        </CardFooter>
      </Card>,
    );

    const card = document.getElementById("profile");

    expect(card?.tagName).toBe("DIV");
    expect(card).toHaveClass("rounded-md", "border", "max-w-sm");
    expect(card?.querySelector("header")).toHaveClass("gap-2");
    expect(screen.getByText("Sarah Johnson")).toHaveClass("text-base");
    expect(screen.getByText("Product Designer").tagName).toBe("P");
    expect(screen.getByText("Product Designer")).toHaveClass("text-xs");
    expect(screen.getByText("Available for projects.")).toHaveClass("text-sm");
    expect(card?.querySelector("footer")).toHaveClass("justify-end");
    expect(
      screen.getByRole("button", { name: "View profile" }),
    ).toBeInTheDocument();
  });
});
