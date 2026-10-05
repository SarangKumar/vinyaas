import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DateRange } from "react-day-picker";

import { Calendar } from ".";

describe("Calendar", () => {
  it("renders a grid with weekday headers and today", () => {
    render(<Calendar mode="single" defaultMonth={new Date(2026, 2, 15)} />);

    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("selects a day and calls onSelect", () => {
    const onSelect = vi.fn();
    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 2, 15)}
        selected={undefined}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /15/ }));
    expect(onSelect).toHaveBeenCalled();
    const selected = onSelect.mock.calls.at(-1)?.[0] as Date | undefined;
    expect(selected?.getDate()).toBe(15);
  });

  it("selects a date range with start and end", () => {
    const onSelect = vi.fn();
    let range: DateRange | undefined;

    const { rerender } = render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 2, 1)}
        selected={range}
        onSelect={(next) => {
          range = next;
          onSelect(next);
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /10/ }));
    expect(onSelect).toHaveBeenCalled();
    const start = onSelect.mock.calls.at(-1)?.[0] as DateRange;
    expect(start.from?.getDate()).toBe(10);

    rerender(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 2, 1)}
        selected={range}
        onSelect={(next) => {
          range = next;
          onSelect(next);
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /16/ }));
    const end = onSelect.mock.calls.at(-1)?.[0] as DateRange;
    expect(end.from?.getDate()).toBe(10);
    expect(end.to?.getDate()).toBe(16);
  });

  it("marks range start and end when a range is selected", () => {
    render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 2, 1)}
        selected={{
          from: new Date(2026, 2, 10),
          to: new Date(2026, 2, 16),
        }}
      />,
    );

    expect(
      document.querySelector(".day-range-start, [class*='day-range-start']"),
    ).toBeTruthy();
    expect(
      document.querySelector(".day-range-end, [class*='day-range-end']"),
    ).toBeTruthy();
  });

  it("does not select disabled dates", () => {
    const onSelect = vi.fn();
    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 2, 15)}
        disabled={{ dayOfWeek: [0, 6] }}
        onSelect={onSelect}
      />,
    );

    const weekend = screen
      .getAllByRole("button")
      .find((button) => button.hasAttribute("disabled"));
    expect(weekend).toBeTruthy();
    if (weekend) {
      fireEvent.click(weekend);
    }
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("does not select disabled dates in range mode", () => {
    const onSelect = vi.fn();
    render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 2, 15)}
        disabled={{ dayOfWeek: [0, 6] }}
        onSelect={onSelect}
      />,
    );

    const weekend = screen
      .getAllByRole("button")
      .find((button) => button.hasAttribute("disabled"));
    expect(weekend).toBeTruthy();
    if (weekend) {
      fireEvent.click(weekend);
    }
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("navigates months with previous and next controls", () => {
    render(<Calendar mode="single" defaultMonth={new Date(2026, 2, 15)} />);

    expect(screen.getByText(/March 2026/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText(/April 2026/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByText(/March 2026/i)).toBeInTheDocument();
  });

  it("supports keyboard focus on day buttons", () => {
    render(<Calendar mode="single" defaultMonth={new Date(2026, 2, 15)} />);
    const day = screen.getByRole("button", { name: /15/ });
    day.focus();
    expect(day).toHaveFocus();
    expect(day.className).toMatch(/focus-visible:ring/);
  });

  it("uses primary token classes for the selected day", () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 2, 15)}
        selected={new Date(2026, 2, 15)}
      />,
    );

    const selected =
      container.querySelector("[aria-selected='true']") ??
      screen.getByRole("button", { name: /15/ });
    expect(selected).toBeTruthy();
    expect(
      selected?.className ?? selected?.parentElement?.className ?? "",
    ).toMatch(/bg-primary|selected/);
  });
});
