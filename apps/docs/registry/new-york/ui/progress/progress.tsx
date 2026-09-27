import React from "react";

import { cn } from "@/lib/utils";

export type ProgressProps = React.ComponentProps<"progress">;

export function Progress({ className, ref, ...props }: ProgressProps) {
  return (
    <progress
      ref={ref}
      className={cn(
        "bg-muted h-2 w-full appearance-none overflow-hidden rounded-full",
        "[&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-bar]:rounded-full",
        "[&::-webkit-progress-value]:bg-foreground [&::-webkit-progress-value]:rounded-full",
        "[&::-moz-progress-bar]:bg-foreground",
        className,
      )}
      {...props}
    />
  );
}
