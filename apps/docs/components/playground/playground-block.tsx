import { Children, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  playgroundColumnItemClassName,
  playgroundColumnsClassName,
  playgroundShowcaseColumnsClassName,
} from "./playground-layout";

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
        "border-border bg-card text-card-foreground flex w-full min-w-0 flex-col gap-4 rounded-xl border p-4 sm:gap-5 sm:p-5",
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
      <div className="flex max-w-full min-w-0 flex-col gap-4 p-0.5 text-sm">
        {children}
      </div>
    </section>
  );
}

/**
 * Shared Pinterest masonry for homepage + Themes + Typeset.
 *
 * CSS columns (not a row grid) so cards can start at different vertical
 * offsets. Shared ladder: 1 → md:2 → lg:3 → xl:4. Homepage showcase adds
 * min-[1900px]:5; Themes / Typeset stay at a max of 4.
 */
export function PlaygroundGrid({
  children,
  mode = "playground",
  className,
}: {
  children: ReactNode;
  /** Homepage (`showcase`) or Themes/Typeset (`playground`). */
  mode?: "showcase" | "playground";
  className?: string;
}) {
  const items = Children.toArray(children);

  return (
    <div
      data-playground-grid
      data-playground-mode={mode}
      className={cn(
        playgroundColumnsClassName,
        mode === "showcase" && playgroundShowcaseColumnsClassName,
        className,
      )}
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
