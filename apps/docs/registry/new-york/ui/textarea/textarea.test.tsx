import { createRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a native textarea that a label can name", () => {
    render(
      <>
        <label htmlFor="message">Message</label>
        <Textarea id="message" />
      </>,
    );

    const field = screen.getByLabelText("Message");

    expect(field).toBeInstanceOf(HTMLTextAreaElement);
    expect(field.tagName).toBe("TEXTAREA");
  });

  it("passes through native textarea attributes", () => {
    render(
      <Textarea
        aria-label="Message"
        aria-describedby="message-hint"
        aria-invalid="true"
        id="message"
        name="message"
        rows={6}
        cols={40}
        required
        placeholder="Write a message"
        defaultValue="Hello"
        className="max-w-sm"
      />,
    );

    const field = screen.getByRole("textbox", { name: "Message" });

    expect(field).toHaveAttribute("id", "message");
    expect(field).toHaveAttribute("name", "message");
    expect(field).toHaveAttribute("rows", "6");
    expect(field).toHaveAttribute("cols", "40");
    expect(field).toBeRequired();
    expect(field).toHaveAttribute("placeholder", "Write a message");
    expect(field).toHaveValue("Hello");
    expect(field).toHaveAttribute("aria-describedby", "message-hint");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveClass("max-w-sm");
    expect(field).toHaveClass("min-h-20");
  });

  it("uses a default value without becoming controlled", () => {
    render(<Textarea aria-label="Message" defaultValue="Draft" />);

    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue(
      "Draft",
    );
  });

  it("updates a controlled value and reports the change", () => {
    const onChange = vi.fn();

    function Field() {
      const [value, setValue] = useState("Ada");

      return (
        <Textarea
          aria-label="Message"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setValue(event.target.value);
          }}
        />
      );
    }

    render(<Field />);
    fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
      target: { value: "Grace" },
    });

    expect(onChange).toHaveBeenCalledWith("Grace");
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue(
      "Grace",
    );
  });

  it("marks a disabled field and keeps the not-allowed cursor", () => {
    render(<Textarea aria-label="Message" disabled defaultValue="Locked" />);

    const field = screen.getByRole("textbox", { name: "Message" });

    expect(field).toBeDisabled();
    expect(field).toHaveClass("disabled:cursor-not-allowed");
    expect(field).toHaveClass("disabled:opacity-50");
    expect(field).not.toHaveClass("pointer-events-none");
    expect(field).toHaveValue("Locked");
  });

  it("can be focused and exposes the visible focus ring classes", () => {
    render(<Textarea aria-label="Message" />);
    const field = screen.getByRole("textbox", { name: "Message" });

    field.focus();

    expect(field).toHaveFocus();
    expect(field).toHaveClass("focus-visible:ring-2");
    expect(field).toHaveClass("focus-visible:outline-none");
  });

  it("forwards a ref to the textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(<Textarea aria-label="Message" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Message" }));
  });
});
