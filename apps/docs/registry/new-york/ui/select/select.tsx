import React from "react";

import { cn } from "@/lib/utils";

export type SelectProps = React.ComponentProps<"select">;

export function Select({
  className,
  ref,
  multiple,
  size,
  ...props
}: SelectProps) {
  const listed = Boolean(multiple) || (size !== undefined && Number(size) > 1);

  return (
    <select
      ref={ref}
      multiple={multiple}
      size={size}
      className={cn(
        "border-input bg-background text-foreground focus-visible:ring-ring focus-visible:ring-offset-background w-full rounded-md border px-3 pr-8 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        listed ? "h-auto py-1" : "h-9",
        className,
      )}
      {...props}
    />
  );
}
