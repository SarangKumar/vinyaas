import React from "react";

import { cn } from "@/lib/utils";

export type TypographyProps = React.ComponentProps<"div">;

export function Typography({ className, ref, ...props }: TypographyProps) {
  return (
    <div
      ref={ref}
      className={cn("text-foreground flex flex-col gap-4", className)}
      {...props}
    />
  );
}

export function TypographyH1({
  className,
  ref,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      ref={ref}
      className={cn(
        "text-foreground text-3xl font-semibold tracking-tight text-balance",
        className,
      )}
      {...props}
    />
  );
}

export function TypographyH2({
  className,
  ref,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      ref={ref}
      className={cn(
        "text-foreground text-2xl font-semibold tracking-tight text-balance",
        className,
      )}
      {...props}
    />
  );
}

export function TypographyH3({
  className,
  ref,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-foreground text-xl font-semibold tracking-tight text-balance",
        className,
      )}
      {...props}
    />
  );
}

export function TypographyH4({
  className,
  ref,
  ...props
}: React.ComponentProps<"h4">) {
  return (
    <h4
      ref={ref}
      className={cn(
        "text-foreground text-lg font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function TypographyP({
  className,
  ref,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      ref={ref}
      className={cn("text-body text-base leading-7", className)}
      {...props}
    />
  );
}

export function TypographyLead({
  className,
  ref,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      ref={ref}
      className={cn("text-body text-lg leading-8", className)}
      {...props}
    />
  );
}

export function TypographyLarge({
  className,
  ref,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      ref={ref}
      className={cn("text-foreground text-lg leading-7 font-medium", className)}
      {...props}
    />
  );
}

export function TypographySmall({
  className,
  ref,
  ...props
}: React.ComponentProps<"small">) {
  return (
    <small
      ref={ref}
      className={cn("text-foreground text-sm leading-5", className)}
      {...props}
    />
  );
}

export function TypographyMuted({
  className,
  ref,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      ref={ref}
      className={cn("text-muted-foreground text-sm leading-5", className)}
      {...props}
    />
  );
}

export function TypographyBlockquote({
  className,
  ref,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      ref={ref}
      className={cn(
        "border-border text-body border-l-2 pl-4 leading-7 italic",
        className,
      )}
      {...props}
    />
  );
}

export function TypographyList({
  className,
  ref,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      ref={ref}
      className={cn(
        "text-body list-disc pl-5 text-base leading-7 [&>li]:mt-2",
        className,
      )}
      {...props}
    />
  );
}
