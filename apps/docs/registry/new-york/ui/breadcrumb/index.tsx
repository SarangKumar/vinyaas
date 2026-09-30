import React from "react";

import { cn } from "@/lib/utils";

export function Breadcrumb({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("w-full min-w-0", className)}
      {...props}
    />
  );
}

export function BreadcrumbList({
  className,
  ...props
}: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      className={cn("inline-flex min-w-0 items-center gap-1.5", className)}
      {...props}
    />
  );
}

export function BreadcrumbLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "text-muted-foreground hover:text-foreground rounded-sm no-underline transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      className={cn("text-foreground font-medium", className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children ?? "/"}
    </li>
  );
}

export function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span className={cn("inline-flex items-center", className)} {...props}>
      <span aria-hidden="true">…</span>
      <span className="sr-only">More</span>
    </span>
  );
}
