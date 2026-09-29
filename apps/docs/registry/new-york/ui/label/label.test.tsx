import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Label } from ".";

describe("Label", () => {
  it("renders its children in a native label", () => {
    render(<Label>Email</Label>);

    const label = screen.getByText("Email");

    expect(label.tagName).toBe("LABEL");
    expect(label).not.toHaveAttribute("role");
  });

  it("passes through htmlFor, className, and other label attributes", () => {
    render(
      <Label htmlFor="email" id="email-label" className="max-w-sm" lang="en">
        Email
      </Label>,
    );

    const label = screen.getByText("Email");

    expect(label).toHaveAttribute("for", "email");
    expect(label).toHaveAttribute("id", "email-label");
    expect(label).toHaveAttribute("lang", "en");
    expect(label).toHaveClass("max-w-sm");
    expect(label).toHaveClass("text-sm");
  });

  it("associates with a control when htmlFor matches the control id", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );

    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
  });

  it("forwards a ref to the label element", () => {
    const ref = createRef<HTMLLabelElement>();

    render(<Label ref={ref}>Email</Label>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current).toBe(screen.getByText("Email"));
  });
});
