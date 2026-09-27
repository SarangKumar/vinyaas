import React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-border text-foreground",
  destructive: "bg-destructive text-destructive-foreground",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
