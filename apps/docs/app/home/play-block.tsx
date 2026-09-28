import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Showcase card for the Pinterest masonry.
 * break-inside-avoid keeps cards whole; mb uses --gap so vertical rhythm
 * matches the column gutter.
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
        "border-border bg-card text-card-foreground mb-(--gap) flex w-full min-w-0 break-inside-avoid flex-col gap-6 overflow-hidden rounded-xl border p-6 sm:p-8",
        className,
      )}
    >
      {title ? (
        <header className="flex min-w-0 flex-col gap-1.5">
          <h2 className="text-foreground text-base font-medium tracking-tight">
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground text-sm leading-6">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      <div className="flex max-w-full min-w-0 flex-col gap-5">{children}</div>
    </section>
  );
}
