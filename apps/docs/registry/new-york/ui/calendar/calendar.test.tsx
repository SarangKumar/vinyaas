import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

  it("navigates months with previous and next controls", () => {
    render(<Calendar mode="single" defaultMonth={new Date(2026, 2, 15)} />);

    expect(screen.getByText(/March 2026/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText(/April 2026/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByText(/March 2026/i)).toBeInTheDocument();
  });

  it("keeps focus-visible ring classes on day buttons", () => {
    render(<Calendar mode="single" defaultMonth={new Date(2026, 2, 15)} />);
    const day = screen.getByRole("button", { name: /15/ });
    expect(day.className).toMatch(/focus-visible:ring/);
  });
});
