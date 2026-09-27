import React from "react";

import { cn } from "@/lib/utils";

const alertVariants = {
  default: "border-border bg-background text-foreground",
  destructive:
    "border-destructive bg-destructive text-destructive-foreground border-2",
} as const;

export type AlertVariant = keyof typeof alertVariants;

export function Alert({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
}) {
  return (
    <div
      role="alert"
      data-variant={variant}
      className={cn(
        "relative flex w-full flex-col gap-1 rounded-md border px-4 py-3 text-sm",
        alertVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm leading-6 opacity-90", className)} {...props} />
  );
}
