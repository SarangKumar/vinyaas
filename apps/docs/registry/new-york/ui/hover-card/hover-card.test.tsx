import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HoverCard, HoverCardContent, HoverCardTrigger } from ".";
import { Button } from "../button";

function Card({
  openDelay = 0,
  closeDelay = 0,
}: {
  openDelay?: number;
  closeDelay?: number;
}) {
  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger>
        <Button type="button">Ada Lovelace</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p>Wrote the first algorithm.</p>
      </HoverCardContent>
    </HoverCard>
  );
}

describe("HoverCard", () => {
  it("opens from hover and closes from pointer leave", () => {
    render(<Card />);

    const trigger = screen.getByRole("button", { name: "Ada Lovelace" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    fireEvent.mouseEnter(trigger);

    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveTextContent("Wrote the first algorithm.");
    expect(dialog).toHaveClass("bg-popover", "border", "rounded-md");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens from keyboard focus and closes on Escape", () => {
    render(<Card />);

    const trigger = screen.getByRole("button", { name: "Ada Lovelace" });

    fireEvent.focus(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("stays closed until the open delay elapses", () => {
    render(<Card openDelay={500} />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Ada Lovelace" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
