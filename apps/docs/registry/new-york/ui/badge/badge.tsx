import React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  outline: "border border-border text-foreground",
  ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
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
        "inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:size-3",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
