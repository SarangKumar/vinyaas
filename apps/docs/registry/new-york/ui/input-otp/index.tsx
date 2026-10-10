"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  /** Fires once when the value reaches `length`. Resets after a digit is removed. */
  onComplete?: (value: string) => void;
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
  onComplete,
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
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (disabled) {
      completedRef.current = false;
      return;
    }

    if (current.length === length) {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.(current);
      }
      return;
    }

    completedRef.current = false;
  }, [current, length, disabled]);

  function update(next: string) {
    if (disabled) {
      return;
    }

    const cleaned = digits(next, length);

    if (value === undefined) {
      setUncontrolled(cleaned);
    }

    onChange?.(cleaned);
  }

  return (
    <div
      data-slot="input-otp"
      className={cn(
        "relative flex w-full max-w-full min-w-0 flex-nowrap items-center justify-center gap-1.5 sm:gap-2",
        className,
      )}
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
      data-slot="input-otp-group"
      className={cn(
        "flex min-w-0 flex-nowrap items-center gap-1.5 sm:gap-2",
        className,
      )}
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
      data-slot="input-otp-slot"
      data-active={active ? "true" : undefined}
      className={cn(
        "border-input bg-background text-foreground inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm sm:h-9 sm:w-9",
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
      data-slot="input-otp-separator"
      className={cn(
        "text-muted-foreground shrink-0 px-0.5 text-sm sm:px-1",
        className,
      )}
      {...props}
    />
  );
}
