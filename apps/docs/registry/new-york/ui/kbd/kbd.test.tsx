import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Kbd, KbdGroup } from ".";

function key(label: string) {
  return screen.getByText(
    (_, element) => element?.tagName === "KBD" && element.textContent === label,
  );
}

describe("Kbd", () => {
  it("renders a native keyboard element", () => {
    render(<Kbd>K</Kbd>);

    const element = screen.getByText("K");

    expect(element.tagName).toBe("KBD");
    expect(element).not.toHaveAttribute("role");
    expect(element).not.toHaveAttribute("tabindex");
    expect(element).toHaveClass("h-5", "font-mono", "border");
  });

  it("passes through className and other kbd attributes", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Kbd ref={ref} className="min-w-8" title="Command">
        ⌘
      </Kbd>,
    );

    expect(ref.current).toBe(key("⌘"));
    expect(ref.current).toHaveAttribute("title", "Command");
    expect(ref.current).toHaveClass("min-w-8");
    expect(ref.current).not.toHaveClass("min-w-5");
  });

  it("draws common symbols as letter-height SVGs and keeps the character for assistive tech", () => {
    render(
      <>
        <Kbd>K</Kbd>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>↵</Kbd>
      </>,
    );

    for (const label of ["⌘", "⇧", "↵"]) {
      const element = key(label);
      const svg = element.querySelector("svg");

      expect(element).toHaveAttribute("data-symbol");
      expect(element).toHaveClass("h-5", "box-border");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveClass("size-[0.9em]");
      expect(screen.getByText(label)).toHaveClass("sr-only");
    }

    expect(key("K")).not.toHaveAttribute("data-symbol");
    expect(key("K")).toHaveClass("text-xs");
  });

  it("renders a mixed shortcut such as ⌘K as one key", () => {
    render(<Kbd>⌘K</Kbd>);

    const element = key("⌘K");

    expect(element).not.toHaveAttribute("data-symbol");
    expect(element).toHaveClass("h-5", "font-mono");
    expect(element.querySelectorAll("svg")).toHaveLength(1);
    expect(element.querySelector("[data-symbol-glyph]")).toHaveTextContent("⌘");
  });

  it("falls back to a larger font for symbols without a drawn glyph", () => {
    render(<Kbd>⎋</Kbd>);

    const glyph = key("⎋").querySelector("[data-symbol-glyph]");

    expect(glyph).toHaveClass("text-[0.9375rem]");
    expect(key("⎋").querySelector("svg")).toBeNull();
  });

  it("groups the keys of one shortcut", () => {
    render(
      <KbdGroup data-testid="group">
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );

    const group = screen.getByTestId("group");

    expect(group.tagName).toBe("KBD");
    expect(group).toHaveAttribute("data-slot", "kbd-group");
    expect(group).toHaveClass("inline-flex", "gap-1");
  });
});
