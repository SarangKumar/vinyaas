import React from "react";

import { cn } from "@/lib/utils";

export type KbdProps = React.ComponentProps<"kbd">;

export function Kbd({ className, ref, ...props }: KbdProps) {
  return (
    <kbd
      ref={ref}
      className={cn(
        "border-border bg-muted text-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-sm border px-1 font-mono text-xs leading-none",
        className,
      )}
      {...props}
    />
  );
}
