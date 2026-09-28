import React from "react";

import { cn } from "@/lib/utils";

export type NativeSelectProps = React.ComponentProps<"select">;

export function NativeSelect({
  className,
  ref,
  multiple,
  size,
  ...props
}: NativeSelectProps) {
  const listed = Boolean(multiple) || (size !== undefined && Number(size) > 1);

  return (
    <select
      ref={ref}
      multiple={multiple}
      size={size}
      className={cn(
        "border-input bg-background text-foreground focus-visible:ring-ring focus-visible:ring-offset-background w-full rounded-md border text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        listed ? "h-auto px-3 py-1" : "h-9 py-0 pr-10 pl-3",
        className,
      )}
      {...props}
    />
  );
}

export function NativeSelectOption(props: React.ComponentProps<"option">) {
  return <option {...props} />;
}

export function NativeSelectOptGroup(props: React.ComponentProps<"optgroup">) {
  return <optgroup {...props} />;
}
