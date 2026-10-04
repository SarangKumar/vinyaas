import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Showcase card for the homepage playground grid.
 * Vertical rhythm comes from the homepage grid `gap-(--gap)` — do not also add
 * margin-bottom or gaps stack to 2× the gutter.
 */
export function PlayBlock({
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
      data-play-block
      className={cn(
        "border-border/80 bg-card text-card-foreground flex w-full min-w-0 break-inside-avoid flex-col gap-5 rounded-2xl border p-5 shadow-[0_1px_0_oklch(1_0_0/0.04)_inset] sm:gap-6 sm:p-6",
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
      {/* p-0.5 keeps focus rings (ring + offset) from clipping at the card edge */}
      <div className="flex max-w-full min-w-0 flex-col gap-4 p-0.5 text-sm sm:gap-5">
        {children}
      </div>
    </section>
  );
}
