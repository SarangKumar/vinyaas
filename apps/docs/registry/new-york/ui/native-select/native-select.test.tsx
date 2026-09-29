import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from ".";

describe("NativeSelect", () => {
  it("renders a native select, options, and an optgroup", () => {
    render(
      <NativeSelect aria-label="Region" defaultValue="in" className="max-w-sm">
        <NativeSelectOptGroup label="Asia">
          <NativeSelectOption value="in">India</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOption value="us">United States</NativeSelectOption>
      </NativeSelect>,
    );

    const select = screen.getByRole("combobox", { name: "Region" });

    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveValue("in");
    expect(select).toHaveClass("h-9", "text-sm", "max-w-sm", "pl-3", "pr-10");
    expect(select).toHaveClass("appearance-none");
    expect(document.querySelector("optgroup")).toHaveAttribute("label", "Asia");
    expect(screen.getByRole("option", { name: "India" }).tagName).toBe(
      "OPTION",
    );
  });

  it("passes through native attributes and reports changes", () => {
    render(
      <NativeSelect
        aria-label="Region"
        id="region"
        name="region"
        required
        disabled
        defaultValue=""
      >
        <NativeSelectOption value="">Choose</NativeSelectOption>
        <NativeSelectOption value="in">India</NativeSelectOption>
      </NativeSelect>,
    );

    const select = screen.getByRole("combobox", { name: "Region" });

    expect(select).toHaveAttribute("id", "region");
    expect(select).toHaveAttribute("name", "region");
    expect(select).toBeRequired();
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("aria-label", "Region");
  });

  it("keeps a multiple select native and lets its height grow", () => {
    const onChange = vi.fn();

    render(
      <NativeSelect
        aria-label="Regions"
        multiple
        defaultValue={["in"]}
        onChange={onChange}
      >
        <NativeSelectOption value="in">India</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
      </NativeSelect>,
    );

    const select = screen.getByRole("listbox", { name: "Regions" });

    fireEvent.change(select, { target: { value: "us" } });

    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveAttribute("multiple");
    expect(select).toHaveClass("h-auto", "px-3");
    expect(select).not.toHaveClass("h-9");
    expect(select).not.toHaveClass("pr-10");
    expect(select).not.toHaveClass("appearance-none");
    expect(onChange).toHaveBeenCalled();
  });
});
