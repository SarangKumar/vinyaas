"use client";

import React, { createContext, useContext, useState } from "react";

import { cn } from "@/lib/utils";

type InputOTPContextValue = {
  value: string;
  length: number;
  invalid: boolean;
  disabled: boolean;
  focused: boolean;
};

const InputOTPContext = createContext<InputOTPContextValue | null>(null);

function useInputOTP() {
  const context = useContext(InputOTPContext);

  if (!context) {
    throw new Error("Input OTP parts must render inside InputOTP.");
  }

  return context;
}

function digits(value: string, length: number) {
  return value.replace(/\D/g, "").slice(0, length);
}

export type InputOTPProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  id?: string;
  "aria-label"?: string;
};

export function InputOTP({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  disabled = false,
  invalid = false,
  name,
  id,
  "aria-label": ariaLabel = "One-time code",
  className,
  children,
  ...props
}: InputOTPProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const current = digits(value ?? uncontrolled, length);

  function update(next: string) {
    const cleaned = digits(next, length);

    if (value === undefined) {
      setUncontrolled(cleaned);
    }

    onChange?.(cleaned);
  }

  return (
    <div
      className={cn("relative inline-flex items-center", className)}
      {...props}
    >
      <input
        id={id}
        name={name}
        aria-label={ariaLabel}
        inputMode="numeric"
        autoComplete="one-time-code"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        maxLength={length}
        value={current}
        className="absolute inset-0 z-10 cursor-text opacity-0 disabled:cursor-not-allowed"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => update(event.currentTarget.value)}
        onPaste={(event) => {
          const text = event.clipboardData.getData("text");

          if (!text) {
            return;
          }

          event.preventDefault();
          update(text);
        }}
      />
      <InputOTPContext.Provider
        value={{ value: current, length, invalid, disabled, focused }}
      >
        {children}
      </InputOTPContext.Provider>
    </div>
  );
}

export type InputOTPGroupProps = React.ComponentProps<"div">;

export function InputOTPGroup({ className, ...props }: InputOTPGroupProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

export type InputOTPSlotProps = React.ComponentProps<"span"> & {
  index: number;
};

export function InputOTPSlot({
  index,
  className,
  ...props
}: InputOTPSlotProps) {
  const otp = useInputOTP();
  const active = otp.focused && otp.value.length === index;

  return (
    <span
      data-active={active ? "true" : undefined}
      className={cn(
        "border-input bg-muted text-foreground inline-flex size-9 items-center justify-center rounded-md border text-sm",
        active && "ring-ring ring-offset-background ring-2 ring-offset-2",
        otp.invalid && "border-destructive text-destructive",
        otp.disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {otp.value[index] ?? ""}
    </span>
  );
}

export type InputOTPSeparatorProps = React.ComponentProps<"span">;

export function InputOTPSeparator({
  className,
  ...props
}: InputOTPSeparatorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("text-muted-foreground px-1 text-sm", className)}
      {...props}
    />
  );
}
