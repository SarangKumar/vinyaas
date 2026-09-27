import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Select } from "./select";

describe("Select", () => {
  it("renders a native select with options", () => {
    render(
      <Select aria-label="Plan" defaultValue="pro">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "Plan" });

    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveValue("pro");
    expect(select).toHaveClass("h-9", "text-sm", "px-3", "rounded-md");
    expect(screen.getByRole("option", { name: "Free" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Pro" })).toBeInTheDocument();
  });

  it("updates a controlled value", () => {
    function Field() {
      const [value, setValue] = useState("free");

      return (
        <Select
          aria-label="Plan"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        >
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </Select>
      );
    }

    render(<Field />);
    fireEvent.change(screen.getByRole("combobox", { name: "Plan" }), {
      target: { value: "pro" },
    });

    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveValue("pro");
  });

  it("passes through native select attributes", () => {
    render(
      <Select
        aria-label="Plan"
        id="plan"
        name="plan"
        required
        disabled
        className="max-w-sm"
        defaultValue=""
      >
        <option value="">Choose</option>
        <option value="pro">Pro</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "Plan" });

    expect(select).toHaveAttribute("id", "plan");
    expect(select).toHaveAttribute("name", "plan");
    expect(select).toBeRequired();
    expect(select).toBeDisabled();
    expect(select).toHaveClass("max-w-sm", "h-9");
    expect(select).toHaveAttribute("aria-label", "Plan");
  });

  it("keeps a multiple select native and lets its height grow", () => {
    render(
      <Select aria-label="Regions" multiple defaultValue={["us"]}>
        <option value="us">United States</option>
        <option value="in">India</option>
      </Select>,
    );

    const select = screen.getByRole("listbox", { name: "Regions" });

    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveAttribute("multiple");
    expect(select).toHaveClass("h-auto");
    expect(select).not.toHaveClass("h-9");
  });
});
