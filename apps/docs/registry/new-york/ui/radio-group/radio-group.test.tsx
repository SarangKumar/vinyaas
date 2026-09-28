import { createRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  it("renders a native radio group", () => {
    render(
      <RadioGroup aria-label="Spacing" defaultValue="comfortable">
        <RadioGroupItem value="default" id="r1" />
        <label htmlFor="r1">Default</label>
        <RadioGroupItem value="comfortable" id="r2" />
        <label htmlFor="r2">Comfortable</label>
      </RadioGroup>,
    );

    const group = screen.getByRole("radiogroup", { name: "Spacing" });
    const comfortable = screen.getByRole("radio", { name: "Comfortable" });

    expect(group).toBeInTheDocument();
    expect(comfortable.tagName).toBe("INPUT");
    expect(comfortable).toHaveAttribute("type", "radio");
    expect(comfortable).toBeChecked();
    expect(screen.getByRole("radio", { name: "Default" })).not.toBeChecked();
    expect(comfortable).not.toHaveAttribute("role");
    expect(comfortable).toHaveClass("size-4");
    expect(
      comfortable.parentElement?.querySelector("[aria-hidden]"),
    ).toHaveClass("size-2");
    expect(
      comfortable.parentElement?.querySelector("[aria-hidden]"),
    ).not.toHaveClass("size-1.5");
  });

  it("selects one option at a time", () => {
    render(
      <RadioGroup aria-label="Spacing" defaultValue="default">
        <RadioGroupItem value="default" aria-label="Default" />
        <RadioGroupItem value="comfortable" aria-label="Comfortable" />
      </RadioGroup>,
    );

    const comfortable = screen.getByRole("radio", { name: "Comfortable" });

    fireEvent.click(comfortable);

    expect(comfortable).toBeChecked();
    expect(screen.getByRole("radio", { name: "Default" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Default" })).toHaveAttribute(
      "name",
      comfortable.getAttribute("name"),
    );
  });

  it("supports a controlled value", () => {
    function Field() {
      const [value, setValue] = useState("default");

      return (
        <RadioGroup aria-label="Spacing" value={value} onValueChange={setValue}>
          <RadioGroupItem value="default" aria-label="Default" />
          <RadioGroupItem value="comfortable" aria-label="Comfortable" />
        </RadioGroup>
      );
    }

    render(<Field />);
    fireEvent.click(screen.getByRole("radio", { name: "Comfortable" }));

    expect(screen.getByRole("radio", { name: "Comfortable" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Default" })).not.toBeChecked();
  });

  it("disables every item when the group is disabled", () => {
    render(
      <RadioGroup aria-label="Spacing" disabled defaultValue="default">
        <RadioGroupItem value="default" aria-label="Default" />
        <RadioGroupItem value="comfortable" aria-label="Comfortable" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Default" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Comfortable" })).toBeDisabled();
    expect(
      screen.getByRole("radio", { name: "Default" }).className,
    ).not.toContain("pointer-events-none");
  });

  it("disables a single item", () => {
    render(
      <RadioGroup aria-label="Spacing" defaultValue="default">
        <RadioGroupItem value="default" aria-label="Default" />
        <RadioGroupItem value="comfortable" aria-label="Comfortable" disabled />
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "Comfortable" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Default" })).toBeEnabled();
  });

  it("passes through aria attributes and can be focused", () => {
    render(
      <RadioGroup aria-label="Spacing" aria-required="true">
        <RadioGroupItem value="default" aria-label="Default" className="mt-1" />
      </RadioGroup>,
    );

    const radio = screen.getByRole("radio", { name: "Default" });

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(radio).toHaveClass("mt-1");
    radio.focus();
    expect(radio).toHaveFocus();
  });

  it("forwards refs to the group and the item", () => {
    const groupRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLInputElement>();

    render(
      <RadioGroup aria-label="Spacing" ref={groupRef}>
        <RadioGroupItem value="default" aria-label="Default" ref={itemRef} />
      </RadioGroup>,
    );

    expect(groupRef.current).toBe(screen.getByRole("radiogroup"));
    expect(itemRef.current).toBe(
      screen.getByRole("radio", { name: "Default" }),
    );
  });
});
