import * as React from "react";

import { cn } from "@/lib/utils";

const emptySize = {
  default: "gap-3 p-8",
  sm: "gap-2 p-5",
} as const;

export type EmptySize = keyof typeof emptySize;

/**
 * Compact empty-state shell for lists, tables, and dashboard panels.
 */
export function Empty({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: EmptySize;
}) {
  return (
    <div
      data-slot="empty"
      data-size={size}
      role="status"
      className={cn(
        "border-border bg-card text-card-foreground flex w-full min-w-0 flex-col items-center justify-center rounded-md border border-dashed text-center",
        emptySize[size],
        className,
      )}
      {...props}
    />
  );
}

export function EmptyIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-icon"
      className={cn(
        "bg-muted text-muted-foreground mb-1 flex size-10 items-center justify-center rounded-full [&_svg]:size-5",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="empty-title"
      className={cn(
        "text-foreground min-w-0 text-sm leading-none font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground max-w-sm min-w-0 text-sm leading-5 text-pretty",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-actions"
      className={cn(
        "mt-1 flex flex-wrap items-center justify-center gap-2",
        className,
      )}
      {...props}
    />
  );
}
