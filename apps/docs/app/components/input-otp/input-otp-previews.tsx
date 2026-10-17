"use client";

import type { ControlValues } from "@/components/component-demo";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp";

export function InputOTPPreview({ values }: { values: ControlValues }) {
  const length = Math.max(1, Math.min(8, (values.length as number) || 6));
  return (
    <InputOTP
      length={length}
      invalid={values.invalid as boolean}
      aria-label="Verification code"
    >
      <InputOTPGroup>
        {Array.from({ length }, (_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
