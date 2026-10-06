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
    const icon = wrapper?.querySelector("[data-slot='native-select-icon']");

    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveValue("in");
    expect(select).toHaveAttribute("data-slot", "native-select");
    expect(select).toHaveClass(
      "h-9",
      "min-h-9",
      "max-h-9",
      "box-border",
      "w-full",
      "min-w-0",
      "text-sm",
      "leading-none",
      "pl-3",
      "pr-9",
    );
    expect(select).not.toHaveClass("py-2");
    expect(select).toHaveClass("appearance-none");
    expect(select.className).toContain("[-webkit-appearance:none]");
    expect(select).not.toHaveClass("max-w-sm");
    expect(wrapper).toHaveClass("relative", "w-full", "min-w-0", "max-w-sm");
    expect(wrapper).toHaveAttribute("data-slot", "native-select-wrapper");
    expect(icon).toHaveClass("pointer-events-none", "absolute", "w-9");
    expect(icon?.querySelector("svg")).toBeTruthy();
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
    const icon = wrapper?.querySelector("[data-slot='native-select-icon']");

    expect(wrapper).toHaveClass("w-28");
    expect(select).toHaveClass("w-full", "pr-9");
    expect(icon).toHaveClass("pointer-events-none", "absolute", "right-0");
    expect(icon?.querySelector("svg")).toBeTruthy();
  });

  it("supports uncontrolled defaultValue and controlled value changes", () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <NativeSelect aria-label="Region" defaultValue="in">
        <NativeSelectOption value="in">India</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
      </NativeSelect>,
    );

    const uncontrolled = screen.getByRole("combobox", { name: "Region" });
    expect(uncontrolled).toHaveValue("in");
    fireEvent.change(uncontrolled, { target: { value: "us" } });
    expect(uncontrolled).toHaveValue("us");

    rerender(
      <NativeSelect aria-label="Region" value="in" onChange={onChange}>
        <NativeSelectOption value="in">India</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
      </NativeSelect>,
    );

    const controlled = screen.getByRole("combobox", { name: "Region" });
    expect(controlled).toHaveValue("in");
    fireEvent.change(controlled, { target: { value: "us" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("passes through native attributes including disabled and form name", () => {
    render(
      <form aria-label="Profile">
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
        </NativeSelect>
      </form>,
    );

    const select = screen.getByRole("combobox", { name: "Region" });

    expect(select).toHaveAttribute("id", "region");
    expect(select).toHaveAttribute("name", "region");
    expect(select).toBeRequired();
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("aria-label", "Region");
    expect(screen.getByRole("form", { name: "Profile" })).toContainElement(
      select,
    );
  });

  it("keeps long option labels on a full-width select without dropping padding", () => {
    render(
      <NativeSelect
        aria-label="Locale"
        defaultValue="en-US"
        className="max-w-xs"
      >
        <NativeSelectOption value="en-US">
          English (United States) — very long label for layout
        </NativeSelectOption>
        <NativeSelectOption value="hi-IN">Hindi (India)</NativeSelectOption>
      </NativeSelect>,
    );

    const select = screen.getByRole("combobox", { name: "Locale" });
    expect(select).toHaveClass("w-full", "min-w-0", "pr-9");
    expect(select.parentElement).toHaveClass("max-w-xs", "relative");
    expect(
      screen.getByRole("option", {
        name: "English (United States) — very long label for layout",
      }),
    ).toBeInTheDocument();
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
    expect(
      select.parentElement?.querySelector("[data-slot='native-select-icon']"),
    ).toBeNull();
  });

  it("does not override native Tab or arrow keyboard handling", () => {
    render(
      <div>
        <button type="button">Before</button>
        <label htmlFor="locale">Locale</label>
        <NativeSelect id="locale" defaultValue="en">
          <NativeSelectOption value="en">English</NativeSelectOption>
          <NativeSelectOption value="hi">Hindi</NativeSelectOption>
        </NativeSelect>
        <button type="button">After</button>
      </div>,
    );

    const select = screen.getByRole("combobox", { name: "Locale" });
    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveClass("focus-visible:ring-2");

    select.focus();
    expect(select).toHaveFocus();

    // Native selects keep browser Tab/Arrow behavior — we must not preventDefault.
    const tab = fireEvent.keyDown(select, { key: "Tab" });
    expect(tab).toBe(true);
    const arrow = fireEvent.keyDown(select, { key: "ArrowDown" });
    expect(arrow).toBe(true);

    fireEvent.change(select, { target: { value: "hi" } });
    expect(select).toHaveValue("hi");
  });
});
