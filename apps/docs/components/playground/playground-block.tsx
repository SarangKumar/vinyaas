import { Children, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  playgroundColumnItemClassName,
  playgroundColumnsClassName,
} from "./playground-layout";

/**
 * Showcase card for Themes / Typeset playgrounds.
 * No per-card Code button — theme/typeset Copy code lives on the toolbar.
 */
export function PlaygroundBlock({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-slot="card"
      data-playground-block
      data-example={title}
      className={cn(
        "border-border bg-card text-card-foreground flex w-full min-w-0 flex-col gap-4 rounded-xl border p-4 sm:gap-5 sm:p-5",
        className,
      )}
    >
      {title ? (
        // Only reserve two description lines when a description exists, so
        // title-only cards (Typeset) do not show an empty band under the title.
        <header
          className={cn(
            "flex min-w-0 flex-col gap-1",
            description && "min-h-[4.75rem]",
          )}
        >
          <h2 className="text-foreground text-[0.9375rem] font-medium tracking-tight">
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      <div className="flex max-w-full min-w-0 flex-1 flex-col gap-4 p-0.5 text-sm">
        {children}
      </div>
    </section>
  );
}

/**
 * Themes / Typeset / Homepage Pinterest masonry (CSS columns).
 * Homepage uses `playgroundShowcaseGridClassName` (grid of flex columns).
 */
export function PlaygroundGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const items = Children.toArray(children);

  return (
    <div
      data-playground-grid
      data-playground-mode="playground"
      className={cn(playgroundColumnsClassName, className)}
    >
      {items.map((item, index) => (
        <div
          key={index}
          data-playground-item
          className={playgroundColumnItemClassName}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
