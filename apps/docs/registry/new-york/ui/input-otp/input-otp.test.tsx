import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";

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
});
