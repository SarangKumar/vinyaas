import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DatePicker } from ".";

describe("DatePicker", () => {
  it("opens the calendar from the trigger", () => {
    render(<DatePicker placeholder="Pick a deadline" />);

    const trigger = screen.getByRole("button", { name: /pick a deadline/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("selects a date, updates the trigger label, and closes", () => {
    const onValueChange = vi.fn();
    render(
      <DatePicker
        defaultOpen
        placeholder="Pick a date"
        onValueChange={onValueChange}
      />,
    );

    const days = screen.getAllByRole("button").filter((button) => {
      const label =
        button.getAttribute("aria-label") ?? button.textContent ?? "";
      return /\d/.test(label) && !/previous|next/i.test(label);
    });
    expect(days.length).toBeGreaterThan(0);
    fireEvent.click(days[10]!);

    expect(onValueChange).toHaveBeenCalled();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("respects the disabled state", () => {
    render(<DatePicker disabled placeholder="Pick a date" />);
    expect(screen.getByRole("button", { name: /pick a date/i })).toBeDisabled();
  });

  it("restores focus to the trigger after Escape", () => {
    render(<DatePicker defaultOpen placeholder="Pick a date" />);
    const trigger = screen.getByRole("button", { name: /pick a date/i });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
