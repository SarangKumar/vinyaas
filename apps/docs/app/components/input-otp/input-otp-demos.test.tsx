import { fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { toast } from "@/registry/new-york/ui/toast/toast";

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

  it("auto-submits on complete, toasts the code, and shows verifying", () => {
    const add = vi.spyOn(toast, "add");
    render(<VerificationCodeDemo />);

    fireEvent.change(
      screen.getByRole("textbox", { name: "Verification code" }),
      {
        target: { value: "482916" },
      },
    );

    expect(add).toHaveBeenCalledWith({
      title: "Verification code",
      description: "482916",
      type: "success",
    });
    expect(screen.getByRole("button", { name: "Verifying" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Verifying" }).querySelector("svg"),
    ).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByRole("button", { name: "Verify" })).toBeEnabled();
  });
});
