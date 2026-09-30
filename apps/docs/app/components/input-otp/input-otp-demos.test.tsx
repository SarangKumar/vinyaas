import { fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { toast } from "@/registry/new-york/ui/toast";

import { VerificationCodeDemo } from "./input-otp-demos";

describe("VerificationCodeDemo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it("auto-submits on complete, shows verifying, then success", () => {
    const add = vi.spyOn(toast, "add");
    render(<VerificationCodeDemo />);

    fireEvent.change(
      screen.getByRole("textbox", { name: "Verification code" }),
      {
        target: { value: "482916" },
      },
    );

    expect(screen.getByRole("button", { name: "Verifying" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Verifying" }).querySelector("svg"),
    ).not.toBeNull();
    expect(add).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(add).toHaveBeenCalledWith({
      title: "Device verified",
      description: "You can continue to your account.",
      type: "success",
    });
    expect(
      screen.getByText("Device verified. You can continue."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verify" })).toBeEnabled();
  });

  it("shows an error for an incorrect code", () => {
    render(<VerificationCodeDemo />);

    fireEvent.change(
      screen.getByRole("textbox", { name: "Verification code" }),
      {
        target: { value: "000000" },
      },
    );

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(
      screen.getByText(
        "That code is incorrect. Try again or resend a new one.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Verification code" }),
    ).toHaveAttribute("aria-invalid", "true");
  });
});
