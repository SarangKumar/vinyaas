"use client";

import React, { useId, useState } from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.ComponentProps<"textarea"> & {
  /** Show a `length/maxLength` counter below the field, aligned right. */
  showCount?: boolean;
  /** Classes for the wrapper rendered when `showCount` is set. */
  containerClassName?: string;
};

const textareaClasses =
  "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex min-h-20 w-full resize-y rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export function Textarea({
  className,
  containerClassName,
  showCount = false,
  ref,
  ...props
}: TextareaProps) {
  const countId = useId();
  const { value, defaultValue, maxLength, onChange } = props;
  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => String(defaultValue ?? "").length,
  );

  if (!showCount) {
    return (
      <textarea
        ref={ref}
        className={cn(textareaClasses, className)}
        {...props}
      />
    );
  }

  const length =
    value !== undefined ? String(value).length : uncontrolledLength;
  const atLimit = maxLength !== undefined && length >= maxLength;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      <textarea
        ref={ref}
        className={cn(textareaClasses, className)}
        {...props}
        aria-describedby={
          [props["aria-describedby"], countId].filter(Boolean).join(" ") ||
          undefined
        }
        onChange={(event) => {
          setUncontrolledLength(event.target.value.length);
          onChange?.(event);
        }}
      />
      <p
        id={countId}
        data-slot="textarea-count"
        className={cn(
          "text-muted-foreground self-end text-xs tabular-nums",
          atLimit && "text-destructive",
        )}
      >
        {length}
        {maxLength !== undefined ? `/${maxLength}` : null}
      </p>
    </div>
  );
}
