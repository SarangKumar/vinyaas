import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Showcase card for the Pinterest masonry.
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
        "border-border bg-card text-card-foreground mb-(--gap) flex w-full min-w-0 break-inside-avoid flex-col gap-4 overflow-hidden rounded-xl border p-4 sm:gap-5 sm:p-5",
        className,
      )}
    >
      {title ? (
        <header className="flex min-w-0 flex-col gap-1">
          <h2 className="text-foreground text-[0.9375rem] font-medium tracking-tight">
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground text-sm leading-6">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      <div className="flex max-w-full min-w-0 flex-col gap-4 overflow-hidden text-sm">
        {children}
      </div>
    </section>
  );
}

/**
 * Same column breakpoints as the homepage masonry (no side skeletons).
 * Width comes from PlaygroundContent — keep this full-bleed inside that column.
 * 1 · md:2 · lg:3 · min-1400:4 · min-1900:5
 */
export function PlaygroundGrid({ children }: { children: ReactNode }) {
  return (
    <div
      data-playground-grid
      className="relative z-10 w-full columns-1 gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:columns-4! min-[1900px]:columns-5! md:columns-2 lg:columns-3"
    >
      {children}
    </div>
  );
}
