import React from "react";

import { cn } from "@/lib/utils";

const alertVariants = {
  default: "border-border bg-muted text-foreground",
  destructive:
    "border-destructive bg-muted text-destructive [&_svg]:text-destructive [&_button]:border-destructive [&_button]:text-destructive [&_button]:hover:bg-destructive/10",
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
        "relative grid w-full grid-cols-[0_minmax(0,1fr)] items-start gap-y-1 rounded-md border px-4 py-3 text-sm has-[>svg]:grid-cols-[1rem_minmax(0,1fr)] has-[>svg]:gap-x-3 [&>*:not(svg)]:col-start-2 [&>svg]:col-start-1 [&>svg]:row-span-2 [&>svg]:row-start-1 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
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
