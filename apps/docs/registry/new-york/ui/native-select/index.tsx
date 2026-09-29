import React from "react";

import { cn } from "@/lib/utils";

export type NativeSelectProps = React.ComponentProps<"select">;

/** Chevron inset ~0.75rem from the trailing edge (~5px left of a flush arrow). */
const selectChevron =
  "appearance-none bg-[length:1rem_1rem] bg-[position:right_0.75rem_center] bg-no-repeat " +
  "bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2371717a%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] " +
  "dark:bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23a1a1aa%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')]";

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
        listed ? "h-auto px-3 py-1" : cn("h-9 py-0 pr-10 pl-3", selectChevron),
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
