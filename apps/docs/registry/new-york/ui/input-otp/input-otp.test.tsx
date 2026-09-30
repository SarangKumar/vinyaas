import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from ".";

function Slots() {
  return (
    <>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </>
  );
}

describe("Input OTP", () => {
  it("keeps digits, ignores other characters, and shows slots", () => {
    render(
      <InputOTP aria-label="Code">
        <Slots />
      </InputOTP>,
    );

    const input = screen.getByRole("textbox", { name: "Code" });

    fireEvent.change(input, { target: { value: "12ab34" } });

    expect(input).toHaveValue("1234");
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(input).toHaveAttribute("inputMode", "numeric");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
  });

  it("pastes a code and supports a controlled value", () => {
    function Field() {
      const [value, setValue] = useState("");

      return (
        <InputOTP aria-label="Code" value={value} onChange={setValue}>
          <Slots />
        </InputOTP>
      );
    }

    render(<Field />);
    const input = screen.getByRole("textbox", { name: "Code" });

    fireEvent.paste(input, {
      clipboardData: { getData: () => "98-76-54" },
    });

    expect(input).toHaveValue("987654");
  });

  it("marks invalid and disabled states", () => {
    const { rerender } = render(
      <InputOTP aria-label="Code" invalid>
        <Slots />
      </InputOTP>,
    );

    expect(screen.getByRole("textbox", { name: "Code" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    rerender(
      <InputOTP aria-label="Code" disabled defaultValue="1234">
        <Slots />
      </InputOTP>,
    );

    expect(screen.getByRole("textbox", { name: "Code" })).toBeDisabled();
  });

  it("keeps the control on one horizontal row", () => {
    const { container } = render(
      <InputOTP aria-label="Code">
        <Slots />
      </InputOTP>,
    );

    expect(container.querySelector('[data-slot="input-otp"]')).toHaveClass(
      "flex-nowrap",
      "justify-center",
    );
    expect(
      container.querySelector('[data-slot="input-otp-group"]'),
    ).toHaveClass("flex-nowrap");
    expect(
      container.querySelector('[data-slot="input-otp-group"]'),
    ).not.toHaveClass("flex-wrap");
  });

  it("calls onComplete once when all digits are entered", () => {
    const onComplete = vi.fn();

    render(
      <InputOTP aria-label="Code" onComplete={onComplete}>
        <Slots />
      </InputOTP>,
    );

    const input = screen.getByRole("textbox", { name: "Code" });

    fireEvent.change(input, { target: { value: "12345" } });
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "123456" } });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("123456");

    fireEvent.change(input, { target: { value: "123456" } });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("calls onComplete after paste and again after delete then complete", () => {
    const onComplete = vi.fn();

    render(
      <InputOTP aria-label="Code" onComplete={onComplete}>
        <Slots />
      </InputOTP>,
    );

    const input = screen.getByRole("textbox", { name: "Code" });

    fireEvent.paste(input, {
      clipboardData: { getData: () => "654321" },
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("654321");

    fireEvent.change(input, { target: { value: "65432" } });
    fireEvent.change(input, { target: { value: "654321" } });
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  it("does not complete when disabled or incomplete", () => {
    const onComplete = vi.fn();

    const { unmount } = render(
      <InputOTP aria-label="Code" disabled onComplete={onComplete}>
        <Slots />
      </InputOTP>,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Code" }), {
      target: { value: "123456" },
    });
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Code" })).toHaveValue("");
    unmount();

    render(
      <InputOTP aria-label="Code" onComplete={onComplete}>
        <Slots />
      </InputOTP>,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Code" }), {
      target: { value: "12" },
    });
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("completes in controlled mode", () => {
    const onComplete = vi.fn();

    function Field() {
      const [value, setValue] = useState("");

      return (
        <InputOTP
          aria-label="Code"
          value={value}
          onChange={setValue}
          onComplete={onComplete}
        >
          <Slots />
        </InputOTP>
      );
    }

    render(<Field />);
    fireEvent.change(screen.getByRole("textbox", { name: "Code" }), {
      target: { value: "112233" },
    });
    expect(onComplete).toHaveBeenCalledWith("112233");
  });
});
