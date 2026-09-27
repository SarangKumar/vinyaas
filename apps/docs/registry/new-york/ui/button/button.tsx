import React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Form controls use one height scale: sm h-8, md h-9, lg h-10, all text-sm.
// md is the default and matches Input. Fields use border-input, px-3, rounded-md,
// the same focus ring, and disabled:cursor-not-allowed disabled:opacity-50.
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4",
        lg: "h-10 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  children,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
