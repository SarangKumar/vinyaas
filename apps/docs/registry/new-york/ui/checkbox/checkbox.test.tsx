import { createRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from ".";

describe("Checkbox", () => {
  it("renders a native checkbox that a label can name", () => {
    render(
      <>
        <label htmlFor="terms">Accept terms</label>
        <Checkbox id="terms" />
      </>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    expect(checkbox.tagName).toBe("INPUT");
    expect(checkbox).toHaveAttribute("type", "checkbox");
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toHaveAttribute("role");
    expect(checkbox).toHaveClass(
      "checked:border-primary",
      "checked:bg-primary",
      "accent-primary",
    );
  });

  it("checks and unchecks", () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("supports a controlled checked state", () => {
    function Field() {
      const [checked, setChecked] = useState(false);

      return (
        <Checkbox
          aria-label="Accept terms"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
      );
    }

    render(<Field />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Accept terms" }));

    expect(
      screen.getByRole("checkbox", { name: "Accept terms" }),
    ).toBeChecked();
  });

  it("passes through native checkbox attributes", () => {
    render(
      <Checkbox
        aria-label="Accept terms"
        name="terms"
        value="yes"
        defaultChecked
        required
        disabled
        aria-invalid="true"
        className="mt-1"
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    expect(checkbox).toHaveAttribute("name", "terms");
    expect(checkbox).toHaveAttribute("value", "yes");
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeRequired();
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveClass("mt-1");
    expect(checkbox.className).not.toContain("pointer-events-none");
  });

  it("sets the indeterminate state", () => {
    render(<Checkbox aria-label="Select all" indeterminate />);

    expect(
      screen.getByRole("checkbox", { name: "Select all" }),
    ).toBePartiallyChecked();
  });

  it("can be focused", () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    checkbox.focus();

    expect(checkbox).toHaveFocus();
  });

  it("forwards a ref to the checkbox element", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Checkbox aria-label="Accept terms" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(
      screen.getByRole("checkbox", { name: "Accept terms" }),
    );
  });
});
