import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared content column for Themes / Typeset — header, toolbar, and masonry
 * share one width so the top controls align with the code-block grid.
 */
export function PlaygroundContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-playground-content
      className={cn(
        "mx-auto flex w-full min-w-0 flex-col gap-5 md:gap-6",
        "md:max-w-3xl lg:max-w-none xl:max-w-[1600px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PlaygroundHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="flex w-full min-w-0 flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
      <h1 className="text-foreground shrink-0 text-[1.75rem] leading-tight font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="text-muted-foreground max-w-md text-sm leading-6 text-pretty sm:max-w-xs sm:pb-0.5 sm:text-right sm:leading-6">
        {description}
      </p>
    </header>
  );
}

export function PlaygroundOptionStrip({
  label,
  children,
  actions,
}: {
  label: string;
  children: ReactNode;
  /** Right-end actions (Copy code, Shuffle, …) — top-aligned with options. */
  actions?: ReactNode;
}) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-20 flex w-full min-w-0 items-start justify-between gap-2 rounded-xl border p-2 shadow-sm backdrop-blur-md sm:gap-3 sm:p-2.5 print:static print:hidden print:shadow-none"
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-start gap-2 sm:gap-3">
        {children}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-start justify-end gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export function PlaygroundOptionGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex min-w-0 shrink-0 items-center gap-1.5", className)}
    >
      <span className="text-muted-foreground sr-only">{label}</span>
      <div className="flex flex-wrap items-center gap-1">{children}</div>
    </div>
  );
}
