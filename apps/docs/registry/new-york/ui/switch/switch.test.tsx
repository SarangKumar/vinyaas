import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Switch } from ".";

describe("Switch", () => {
  it("renders an unchecked switch button", () => {
    render(<Switch aria-label="Alerts" />);

    const control = screen.getByRole("switch", { name: "Alerts" });

    expect(control.tagName).toBe("BUTTON");
    expect(control.querySelector("span")).toHaveClass("translate-x-0.5");
    expect(control).toHaveAttribute("type", "button");
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(control).not.toHaveAttribute("aria-disabled");
  });

  it("starts checked when defaultChecked is set", () => {
    render(<Switch aria-label="Alerts" defaultChecked />);

    expect(screen.getByRole("switch", { name: "Alerts" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("toggles an uncontrolled switch and reports the next value", () => {
    const onCheckedChange = vi.fn();

    render(<Switch aria-label="Alerts" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch", { name: "Alerts" });

    fireEvent.click(control);

    expect(control).toHaveAttribute("aria-checked", "true");
    expect(control.querySelector("span")).toHaveClass("translate-x-4");
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    fireEvent.click(control);

    expect(control).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("keeps a controlled switch on the value it is given", () => {
    function Field() {
      const [checked, setChecked] = useState(false);

      return (
        <Switch
          aria-label="Alerts"
          checked={checked}
          onCheckedChange={setChecked}
        />
      );
    }

    render(<Field />);
    const control = screen.getByRole("switch", { name: "Alerts" });

    fireEvent.click(control);

    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("does not change state when disabled", () => {
    const onCheckedChange = vi.fn();

    render(
      <Switch
        aria-label="Alerts"
        disabled
        defaultChecked
        onCheckedChange={onCheckedChange}
      />,
    );
    const control = screen.getByRole("switch", { name: "Alerts" });

    fireEvent.click(control);
    fireEvent.keyDown(control, { key: "Enter" });
    fireEvent.keyDown(control, { key: " " });

    expect(control).toBeDisabled();
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("is a native button, so Enter and Space activate it", () => {
    render(<Switch aria-label="Alerts" />);
    const control = screen.getByRole("switch", { name: "Alerts" });

    control.focus();
    fireEvent.click(control);

    expect(control).toHaveFocus();
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(control).not.toHaveAttribute("tabindex");
  });

  it("associates with a label and merges class names", () => {
    render(
      <>
        <label htmlFor="alerts">Alerts</label>
        <Switch id="alerts" name="alerts" value="on" className="w-12" />
      </>,
    );

    const control = screen.getByRole("switch", { name: "Alerts" });

    expect(control).toHaveAttribute("id", "alerts");
    expect(control).toHaveAttribute("name", "alerts");
    expect(control).toHaveAttribute("value", "on");
    expect(control).toHaveClass("h-5", "w-12");
    expect(control).not.toHaveClass("w-9");
  });
});
