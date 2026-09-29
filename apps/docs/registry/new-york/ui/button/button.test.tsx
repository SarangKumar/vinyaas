import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from ".";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "active:translate-y-px",
    );
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
    const { rerender } = render(<Button variant="outline">Save</Button>);
    const button = () => screen.getByRole("button", { name: "Save" });

    expect(button()).toHaveClass("border", "bg-background");

    rerender(<Button variant="ghost">Save</Button>);
    expect(button()).toHaveClass("hover:bg-accent");

    rerender(<Button variant="secondary">Save</Button>);
    expect(button()).toHaveClass("bg-secondary", "text-secondary-foreground");

    rerender(<Button variant="link">Save</Button>);
    expect(button()).toHaveClass("underline-offset-4");

    rerender(<Button variant="destructive">Save</Button>);
    expect(button()).toHaveClass(
      "bg-destructive/10",
      "text-destructive",
      "hover:bg-destructive/20",
    );
    expect(button()).toHaveClass("disabled:opacity-50");
  });

  it("uses the default control height and keeps the size scale", () => {
    const { rerender } = render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    expect(button).toHaveClass("h-9", "text-sm", "px-4");
    expect(button).not.toHaveClass("h-8");
    expect(button).not.toHaveClass("h-10");
    expect(button).not.toHaveClass("h-7");

    rerender(<Button size="xs">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "h-7",
      "text-xs",
    );

    rerender(<Button size="sm">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("h-8");

    rerender(<Button size="lg">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "h-10",
      "px-6",
    );

    rerender(
      <Button size="icon" aria-label="Save">
        +
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("size-9");

    rerender(
      <Button size="icon-xs" aria-label="Save">
        +
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("size-7");

    rerender(
      <Button size="icon-sm" aria-label="Save">
        +
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("size-8");

    rerender(
      <Button size="icon-lg" aria-label="Save">
        +
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("size-10");
  });

  it("is keyboard focusable and activates from a click", () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    button.focus();
    fireEvent.click(button);

    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveFocus();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not activate when disabled", () => {
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("allows custom classes", () => {
    render(<Button className="w-full">Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("w-full");
  });
});
