"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { DocsNavLinks } from "@/components/docs-nav-links";
import { TableOfContents } from "@/components/table-of-contents";

/**
 * Docs pages keep the sidebar and the table of contents.
 * The homepage is a full-width showcase, so those columns stay off `/`.
 */
export function DocsFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showcase = pathname === "/";

  if (showcase) {
    return (
      <div
        data-docs-frame="home"
        className="min-h-0 min-w-0 flex-1 overflow-hidden"
      >
        <main
          id="docs-content"
          className="h-full min-h-0 min-w-0 overflow-y-auto overscroll-y-contain"
        >
          {children}
        </main>
      </div>
    );
  }

  return (
    <div
      data-docs-frame="docs"
      className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]"
    >
      <aside className="border-border hidden min-h-0 overflow-y-auto overscroll-y-contain border-r lg:block">
        <DocsNavLinks className="flex flex-col gap-6 px-4 py-6" />
      </aside>
      <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        <main
          id="docs-content"
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
        >
          {children}
        </main>
      </div>
      <aside className="hidden min-h-0 overflow-y-auto overscroll-y-contain xl:block">
        <TableOfContents />
      </aside>
    </div>
  );
}
