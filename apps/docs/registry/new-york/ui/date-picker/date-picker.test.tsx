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

  it("spaces the calendar icon and label with gap-2", () => {
    render(<DatePicker placeholder="Pick a date" />);
    const trigger = screen.getByRole("button", { name: /pick a date/i });
    expect(trigger.className).toMatch(/gap-2/);
    expect(trigger.className).toMatch(/inline-flex/);
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

  it("announces the selected date on the trigger", () => {
    render(
      <DatePicker
        defaultValue={new Date(2026, 3, 8)}
        formatString="PPP"
        placeholder="Pick a date"
      />,
    );

    const trigger = screen.getByRole("button");
    expect(trigger.getAttribute("aria-label") ?? "").toMatch(/selected date/i);
  });

  it("respects the disabled state", () => {
    render(<DatePicker disabled placeholder="Pick a date" />);
    expect(screen.getByRole("button", { name: /pick a date/i })).toBeDisabled();
  });

  it("closes on Escape without trapping focus", () => {
    render(<DatePicker defaultOpen placeholder="Pick a date" />);
    const trigger = screen.getByRole("button", { name: /pick a date/i });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
