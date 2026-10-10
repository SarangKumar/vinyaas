import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Kbd } from ".";

describe("Kbd", () => {
  it("renders a native keyboard element", () => {
    render(<Kbd>K</Kbd>);

    const key = screen.getByText("K");

    expect(key.tagName).toBe("KBD");
    expect(key).not.toHaveAttribute("role");
    expect(key).not.toHaveAttribute("tabindex");
    expect(key).toHaveClass("h-5", "font-mono", "border");
  });

  it("passes through className and other kbd attributes", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Kbd ref={ref} className="min-w-8" title="Command">
        ⌘
      </Kbd>,
    );

    expect(ref.current).toBe(screen.getByText("⌘"));
    expect(ref.current).toHaveAttribute("title", "Command");
    expect(ref.current).toHaveClass("min-w-8", "font-sans");
    expect(ref.current).not.toHaveClass("min-w-5");
  });

  it("keeps the same key height for letters and modifier symbols", () => {
    render(
      <>
        <Kbd>K</Kbd>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
      </>,
    );

    const letter = screen.getByText("K");
    const command = screen.getByText("⌘");
    const shift = screen.getByText("⇧");

    for (const key of [letter, command, shift]) {
      expect(key).toHaveClass("h-5", "box-border");
    }

    expect(letter).not.toHaveAttribute("data-symbol");
    expect(command).toHaveAttribute("data-symbol");
    expect(shift).toHaveAttribute("data-symbol");
    expect(command).toHaveClass("text-[0.9375rem]");
    expect(letter).toHaveClass("text-xs");
  });
});
