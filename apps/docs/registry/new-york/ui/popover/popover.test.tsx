import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function Example({
  side = "bottom",
  align = "center",
}: {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <button type="button">Details</button>
      </PopoverTrigger>
      <PopoverContent side={side} align={align}>
        <button type="button">Save note</button>
        <input aria-label="Note" />
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("opens from the trigger and moves focus into the dialog", () => {
    render(<Example side="top" align="start" />);
    const trigger = screen.getByRole("button", { name: "Details" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
    expect(dialog).toHaveAttribute("data-side", "top");
    expect(dialog).toHaveAttribute("data-align", "start");
    expect(screen.getByRole("button", { name: "Save note" })).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Details" });

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on an outside pointer and keeps content open for an inside click", () => {
    render(
      <div>
        <Example />
        <button type="button">Outside</button>
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Details" }));
    fireEvent.click(screen.getByRole("button", { name: "Save note" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Note" })).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Details" })).toHaveFocus();
  });

  it("does not open a second popover", () => {
    render(
      <div>
        <Example />
        <Popover>
          <PopoverTrigger>
            <button type="button">More</button>
          </PopoverTrigger>
          <PopoverContent>Second</PopoverContent>
        </Popover>
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Details" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByText("Second")).not.toBeInTheDocument();
  });

  it("follows the trigger when a scrolling ancestor moves", () => {
    render(<Example />);
    fireEvent.click(screen.getByRole("button", { name: "Details" }));

    const trigger = screen.getByRole("button", { name: "Details" });
    const dialog = screen.getByRole("dialog");
    const box = (top: number) => ({
      top,
      bottom: top + 36,
      left: 20,
      right: 100,
      width: 80,
      height: 36,
      x: 20,
      y: top,
      toJSON() {
        return {};
      },
    });

    vi.spyOn(trigger, "getBoundingClientRect").mockImplementation(() =>
      box(40),
    );
    vi.spyOn(dialog, "getBoundingClientRect").mockImplementation(() => box(0));
    fireEvent.scroll(window);

    expect(dialog).toHaveClass("overflow-y-auto");
    expect(dialog.style.top).toBe("84px");

    vi.mocked(trigger.getBoundingClientRect).mockImplementation(() => box(140));
    fireEvent.scroll(window);

    expect(dialog.style.top).toBe("184px");
  });
});
