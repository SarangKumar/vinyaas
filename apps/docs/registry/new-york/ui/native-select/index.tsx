import React from "react";

import { cn } from "@/lib/utils";

export type NativeSelectProps = React.ComponentProps<"select">;

function SelectChevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function NativeSelect({
  className,
  ref,
  multiple,
  size,
  ...props
}: NativeSelectProps) {
  const listed = Boolean(multiple) || (size !== undefined && Number(size) > 1);

  if (listed) {
    return (
      <select
        ref={ref}
        multiple={multiple}
        size={size}
        className={cn(
          "border-input bg-background text-foreground focus-visible:ring-ring focus-visible:ring-offset-background h-auto w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div className="relative w-full min-w-0">
      <select
        ref={ref}
        multiple={multiple}
        size={size}
        className={cn(
          "border-input bg-background text-foreground focus-visible:ring-ring focus-visible:ring-offset-background h-9 w-full appearance-none rounded-md border py-0 pr-10 pl-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <SelectChevron />
    </div>
  );
}

export function NativeSelectOption(props: React.ComponentProps<"option">) {
  return <option {...props} />;
}

export function NativeSelectOptGroup(props: React.ComponentProps<"optgroup">) {
  return <optgroup {...props} />;
}
