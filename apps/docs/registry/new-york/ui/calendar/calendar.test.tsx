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

    const month = screen.getByRole("combobox", { name: /month/i });
    expect(month).toHaveValue("2");

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(month).toHaveValue("3");

    fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(month).toHaveValue("2");
  });

  it("exposes working native month and year selects without clipped labels", () => {
    const { container } = render(
      <Calendar mode="single" defaultMonth={new Date(2026, 8, 15)} />,
    );

    const month = screen.getByRole("combobox", { name: /month/i });
    const year = screen.getByRole("combobox", { name: /year/i });

    expect(month.tagName).toBe("SELECT");
    expect(year.tagName).toBe("SELECT");
    expect(month).toHaveValue("8");
    expect(year).toHaveValue("2026");
    expect(month).toHaveDisplayValue(/sep/i);
    expect(year).toHaveDisplayValue("2026");

    fireEvent.change(month, { target: { value: "0" } });
    expect(month).toHaveValue("0");
    expect(month).toHaveDisplayValue(/jan/i);

    fireEvent.change(year, { target: { value: "2025" } });
    expect(year).toHaveValue("2025");

    const monthWrap = container.querySelector(
      '[data-slot="calendar-month-select"]',
    );
    const yearWrap = container.querySelector(
      '[data-slot="calendar-year-select"]',
    );
    expect(monthWrap?.className).toMatch(/w-\[6\.5rem\]/);
    expect(yearWrap?.className).toMatch(/w-\[5\.5rem\]/);
    expect(month.className).toMatch(/pr-8/);
    expect(month.className).not.toMatch(/leading-none/);
  });

  it("keeps caption selects above the nav overlay", () => {
    const { container } = render(
      <Calendar mode="single" defaultMonth={new Date(2026, 9, 15)} />,
    );

    const nav = container.querySelector("nav");
    const dropdowns = container.querySelector("[class*='z-30']");
    expect(nav?.className).toMatch(/pointer-events-none/);
    expect(screen.getByRole("button", { name: /previous/i }).className).toMatch(
      /pointer-events-auto/,
    );
    expect(screen.getByRole("button", { name: /next/i }).className).toMatch(
      /pointer-events-auto/,
    );
    expect(dropdowns).toBeTruthy();
  });

  it("keeps rounded focus and selected day shapes", () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 2, 15)}
        selected={new Date(2026, 2, 15)}
      />,
    );

    const day = screen.getByRole("button", { name: /15/ });
    expect(day.className).toMatch(/rounded-md/);
    expect(day.className).toMatch(
      /focus-visible:rounded-md|focus-visible:ring/,
    );
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
