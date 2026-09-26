import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("supports native button attributes", () => {
    render(
      <Button type="submit" disabled>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });

    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
  });

  it("supports variants", () => {
    render(<Button variant="outline">Cancel</Button>);

    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass(
      "border",
    );
  });

  it("supports sizes", () => {
    render(<Button size="lg">Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("h-11");
  });

  it("allows custom classes", () => {
    render(<Button className="w-full">Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("w-full");
  });
});
