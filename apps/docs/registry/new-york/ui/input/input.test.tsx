import { createRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from ".";

describe("Input", () => {
  it("associates with a label through id", () => {
    render(
      <>
        <label htmlFor="email">Email</label>
        <Input id="email" />
      </>,
    );

    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
  });

  it("can be focused", () => {
    render(<Input aria-label="Email" />);
    const input = screen.getByRole("textbox", { name: "Email" });

    input.focus();

    expect(input).toHaveFocus();
  });

  it("renders a text field", () => {
    render(<Input aria-label="Email" placeholder="name@example.com" />);

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "placeholder",
      "name@example.com",
    );
  });

  it("passes through native input attributes", () => {
    render(
      <Input
        aria-label="Email"
        id="email"
        name="email"
        type="email"
        required
        disabled
        defaultValue="a@b.co"
        aria-invalid="true"
        className="max-w-sm"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Email" });

    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(input).toHaveValue("a@b.co");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass(
      "max-w-sm",
      "h-9",
      "text-sm",
      "px-3",
      "bg-background",
    );
  });

  it("updates a controlled value", () => {
    function Field() {
      const [value, setValue] = useState("Ada");

      return (
        <Input
          aria-label="Name"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }

    render(<Field />);
    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "Grace" },
    });

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Grace");
  });

  it("forwards a ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input aria-label="Email" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Email" }));
  });
});
