import React from "react";

import { cn } from "@/lib/utils";

const markerVariants = {
  default: "inline-flex",
  border: "flex w-full border-b border-border pb-2",
  separator:
    "flex w-full before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
} as const;

export type MarkerVariant = keyof typeof markerVariants;

export function Marker({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: MarkerVariant;
}) {
  return (
    <div
      data-variant={variant}
      className={cn(
        "text-muted-foreground items-center gap-2 text-sm",
        markerVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function MarkerIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function MarkerContent({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return <span className={cn("min-w-0", className)} {...props} />;
}
