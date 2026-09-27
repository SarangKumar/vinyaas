"use client";

import { useRef } from "react";

import { DocsNavLinks } from "@/components/docs-nav-links";
import { focusRing } from "@/components/focus-ring";

export function DocsMobileNav() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <details
      ref={detailsRef}
      className="border-border bg-background shrink-0 border-b md:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && detailsRef.current?.open) {
          detailsRef.current.open = false;
        }
      }}
      onClick={(event) => {
        const target = event.target;

        if (
          detailsRef.current &&
          target instanceof Element &&
          target.closest("a")
        ) {
          detailsRef.current.open = false;
        }
      }}
    >
      <summary
        className={`text-muted-foreground cursor-pointer px-4 py-2.5 text-sm ${focusRing}`}
      >
        Menu
      </summary>
      <DocsNavLinks className="flex flex-col gap-8 px-4 pt-2 pb-6" />
    </details>
  );
}
