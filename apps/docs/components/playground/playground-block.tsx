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
 * Column count mirrors the previous CSS columns breakpoints:
 * 1 · md:2 · lg:3 · min-1400:4 · min-1900:5
 *
 * Items are distributed round-robin into explicit flex columns so every
 * column starts on the same top edge (no CSS-columns balance shifts).
 */
function usePlaygroundColumnCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    function update() {
      const width = window.innerWidth;

      if (width >= 1900) {
        setCount(5);
      } else if (width >= 1400) {
        setCount(4);
      } else if (width >= 1024) {
        setCount(3);
      } else if (width >= 768) {
        setCount(2);
      } else {
        setCount(1);
      }
    }

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export function PlaygroundGrid({ children }: { children: ReactNode }) {
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
      className="relative z-10 flex w-full items-start gap-(--gap)"
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
