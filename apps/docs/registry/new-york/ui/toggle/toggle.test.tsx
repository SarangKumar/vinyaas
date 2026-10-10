import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Toggle } from ".";

describe("Toggle", () => {
  it("renders a native button that exposes its pressed state", () => {
    render(<Toggle aria-label="Bold">B</Toggle>);

    const toggle = screen.getByRole("button", { name: "Bold" });

    expect(toggle.tagName).toBe("BUTTON");
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveAttribute("data-state", "off");
  });

  it("toggles when uncontrolled and reports the change", () => {
    const onPressedChange = vi.fn();

    render(
      <Toggle aria-label="Bold" onPressedChange={onPressedChange}>
        B
      </Toggle>,
    );

    const toggle = screen.getByRole("button", { name: "Bold" });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-state", "on");
    expect(onPressedChange).toHaveBeenLastCalledWith(true);

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(onPressedChange).toHaveBeenLastCalledWith(false);
  });

  it("starts pressed with defaultPressed", () => {
    render(
      <Toggle aria-label="Italic" defaultPressed>
        I
      </Toggle>,
    );

    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("follows the controlled pressed prop", () => {
    const onPressedChange = vi.fn();
    const { rerender } = render(
      <Toggle
        aria-label="Bold"
        pressed={false}
        onPressedChange={onPressedChange}
      >
        B
      </Toggle>,
    );

    const toggle = screen.getByRole("button", { name: "Bold" });

    fireEvent.click(toggle);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    rerender(
      <Toggle aria-label="Bold" pressed onPressedChange={onPressedChange}>
        B
      </Toggle>,
    );
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("does not toggle when disabled or when onClick prevents default", () => {
    const onPressedChange = vi.fn();

    render(
      <>
        <Toggle aria-label="Locked" disabled onPressedChange={onPressedChange}>
          L
        </Toggle>
        <Toggle
          aria-label="Prevented"
          onPressedChange={onPressedChange}
          onClick={(event) => event.preventDefault()}
        >
          P
        </Toggle>
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Locked" }));
    fireEvent.click(screen.getByRole("button", { name: "Prevented" }));

    expect(onPressedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Locked" })).toBeDisabled();
  });

  it("matches Button heights for each size and keeps the border inside the box", () => {
    render(
      <>
        <Toggle aria-label="sm" size="sm" />
        <Toggle aria-label="default" />
        <Toggle aria-label="lg" size="lg" variant="outline" />
      </>,
    );

    expect(screen.getByRole("button", { name: "sm" })).toHaveClass("h-8");
    expect(screen.getByRole("button", { name: "default" })).toHaveClass("h-9");
    expect(screen.getByRole("button", { name: "lg" })).toHaveClass(
      "h-10",
      "border-input",
      "box-border",
    );
  });

  it("forwards a ref and merges className", () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <Toggle ref={ref} aria-label="Bold" className="w-24">
        B
      </Toggle>,
    );

    expect(ref.current).toBe(screen.getByRole("button", { name: "Bold" }));
    expect(ref.current).toHaveClass("w-24");
  });
});
