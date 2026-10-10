import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Showcase card for the homepage playground masonry.
 * Vertical rhythm comes from the column-item `mb-(--gap)` wrapper in
 * {@link Playground} — do not also add margin-bottom on the card.
 *
 * Default `align="stretch"` matches form and dashboard cards. Use
 * `align="center"` for compact widgets (Calendar, empty states) so they sit
 * in the middle of the preview area.
 */
export function PlayBlock({
  title,
  description,
  children,
  className,
  align = "stretch",
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  align?: "center" | "stretch";
}) {
  return (
    <section
      data-slot="card"
      data-play-block
      data-companion-surface=""
      data-companion-surface-id={title ? `play-${title}` : undefined}
      className={cn(
        "border-border/80 bg-card text-card-foreground flex w-full max-w-full min-w-0 flex-col gap-5 overflow-hidden rounded-2xl border p-5 shadow-[0_1px_0_oklch(1_0_0/0.04)_inset] sm:gap-6 sm:p-6",
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
      <div
        className={cn(
          "flex max-w-full min-w-0 flex-col gap-4 overflow-x-auto p-0.5 text-sm sm:gap-5",
          align === "center" ? "items-center" : "items-stretch",
        )}
      >
        {children}
      </div>
    </section>
  );
}
