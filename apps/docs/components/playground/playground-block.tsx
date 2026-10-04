"use client";

import { Children, useEffect, useState, type ReactNode } from "react";

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
        "border-border bg-card text-card-foreground flex w-full min-w-0 flex-col gap-4 overflow-hidden rounded-xl border p-4 sm:gap-5 sm:p-5",
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
 * Shared masonry column progression for homepage + Themes/Typeset:
 * 1 → 2 (md/768) → 3 (lg/1024) → 4 (1400) → 5 (1900)
 */
export function playgroundColumnCountForWidth(width: number) {
  if (width >= 1900) {
    return 5;
  }
  if (width >= 1400) {
    return 4;
  }
  if (width >= 1024) {
    return 3;
  }
  if (width >= 768) {
    return 2;
  }
  return 1;
}

function usePlaygroundColumnCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    function update() {
      setCount(playgroundColumnCountForWidth(window.innerWidth));
    }

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export function PlaygroundGrid({
  children,
  mode = "playground",
}: {
  children: ReactNode;
  /** Homepage (`showcase`) or Themes/Typeset (`playground`) — same 1→5 steps. */
  mode?: "showcase" | "playground";
}) {
  const columnCount = usePlaygroundColumnCount();
  const items = Children.toArray(children);
  const columns = Array.from({ length: columnCount }, () => [] as ReactNode[]);

  items.forEach((item, index) => {
    columns[index % columnCount]!.push(item);
  });

  return (
    <div
      data-playground-grid
      data-playground-columns={columnCount}
      data-playground-mode={mode}
      className="relative z-10 flex w-full min-w-0 items-start gap-(--gap)"
    >
      {columns.map((column, index) => (
        <div
          key={index}
          data-playground-column
          className="flex min-w-0 flex-1 flex-col gap-(--gap)"
        >
          {column}
        </div>
      ))}
    </div>
  );
}
