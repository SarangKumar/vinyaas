"use client";

import React, { createContext, useContext, useId } from "react";

import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  name: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export type RadioGroupProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  name?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
};

export function RadioGroup({
  className,
  name,
  value,
  defaultValue,
  disabled,
  required,
  onValueChange,
  ref,
  ...props
}: RadioGroupProps) {
  const generatedName = useId();

  return (
    <RadioGroupContext.Provider
      value={{
        name: name ?? generatedName,
        value,
        defaultValue,
        disabled,
        required,
        onValueChange,
      }}
    >
      <div
        {...props}
        role="radiogroup"
        {...(disabled ? { "aria-disabled": true } : {})}
        {...(required ? { "aria-required": true } : {})}
        ref={ref}
        className={cn("grid gap-2", className)}
      />
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupItemProps = Omit<
  React.ComponentProps<"input">,
  "type"
> & {
  value: string;
};

export function RadioGroupItem({
  className,
  value,
  disabled,
  required,
  name,
  checked,
  defaultChecked,
  onChange,
  ref,
  ...props
}: RadioGroupItemProps) {
  const group = useContext(RadioGroupContext);
  const groupControlled = group?.value !== undefined;
  const checkedProps = groupControlled
    ? { checked: group.value === value }
    : checked !== undefined
      ? { checked }
      : {
          defaultChecked:
            defaultChecked ??
            (group?.defaultValue !== undefined
              ? group.defaultValue === value
              : undefined),
        };

  return (
    <span className="relative inline-flex size-4 shrink-0">
      <input
        {...props}
        {...checkedProps}
        type="radio"
        ref={ref}
        name={name ?? group?.name}
        value={value}
        disabled={disabled || group?.disabled}
        required={required ?? group?.required}
        className={cn(
          "peer border-input bg-background focus-visible:ring-ring focus-visible:ring-offset-background checked:border-foreground checked:bg-background size-4 cursor-pointer appearance-none rounded-full border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onChange={(event) => {
          onChange?.(event);

          if (event.currentTarget.checked) {
            group?.onValueChange?.(value);
          }
        }}
      />
      <span
        aria-hidden="true"
        className="bg-foreground ring-background pointer-events-none absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 ring-2 peer-checked:opacity-100"
      />
    </span>
  );
}
