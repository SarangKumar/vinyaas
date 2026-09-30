import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from ".";

describe("NativeSelect", () => {
  it("renders a native select with the chevron inside a sized wrapper", () => {
    render(
      <NativeSelect aria-label="Region" defaultValue="in" className="max-w-sm">
        <NativeSelectOptGroup label="Asia">
          <NativeSelectOption value="in">India</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOption value="us">United States</NativeSelectOption>
      </NativeSelect>,
    );

    const select = screen.getByRole("combobox", { name: "Region" });
    const wrapper = select.parentElement;

    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveValue("in");
    expect(select).toHaveClass(
      "h-9",
      "w-full",
      "min-w-0",
      "text-sm",
      "pl-3",
      "pr-9",
    );
    expect(select).toHaveClass("appearance-none");
    expect(select).not.toHaveClass("max-w-sm");
    expect(wrapper).toHaveClass("relative", "w-full", "min-w-0", "max-w-sm");
    expect(wrapper?.querySelector("svg")).toBeTruthy();
    expect(wrapper?.querySelector("svg")).toHaveClass("right-2.5");
    expect(document.querySelector("optgroup")).toHaveAttribute("label", "Asia");
    expect(screen.getByRole("option", { name: "India" }).tagName).toBe(
      "OPTION",
    );
  });

  it("keeps the chevron within a narrow width constraint", () => {
    render(
      <div className="w-40">
        <NativeSelect aria-label="Role" defaultValue="owner" className="w-28">
          <NativeSelectOption value="owner">Owner</NativeSelectOption>
          <NativeSelectOption value="member">Member</NativeSelectOption>
        </NativeSelect>
      </div>,
    );

    const select = screen.getByRole("combobox", { name: "Role" });
    const wrapper = select.parentElement;

    expect(wrapper).toHaveClass("w-28");
    expect(select).toHaveClass("w-full", "pr-9");
    expect(wrapper?.querySelector("svg")).toHaveClass(
      "absolute",
      "right-2.5",
      "pointer-events-none",
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
    expect(select).not.toHaveClass("pr-9");
    expect(select).not.toHaveClass("appearance-none");
    expect(onChange).toHaveBeenCalled();
  });
});
