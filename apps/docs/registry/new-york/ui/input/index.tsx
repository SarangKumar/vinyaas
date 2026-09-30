import React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input">;

export function Input({ className, type = "text", ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "border-input bg-muted text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background flex h-9 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
