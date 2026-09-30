"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { DocsNavLinks } from "@/components/docs-nav-links";
import { TableOfContents } from "@/components/table-of-contents";

/**
 * Docs pages keep the sidebar and the table of contents.
 * Homepage, Themes, and Typeset are full-width showcases (no sidebar).
 */
export function DocsFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showcase =
    pathname === "/" ||
    pathname === "/themes" ||
    pathname === "/typeset" ||
    pathname.startsWith("/themes/") ||
    pathname.startsWith("/typeset/");

  if (showcase) {
    const frame =
      pathname === "/"
        ? "home"
        : pathname.startsWith("/typeset")
          ? "typeset"
          : pathname.startsWith("/themes")
            ? "themes"
            : "home";

    return (
      <div
        data-docs-frame={frame}
        className="min-h-0 min-w-0 flex-1 overflow-hidden"
      >
        <main
          id="docs-content"
          className="h-full min-h-0 min-w-0 overflow-y-auto overscroll-y-contain print:h-auto print:overflow-visible"
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
      <aside
        data-docs-sidebar
        className="border-border relative z-0 hidden min-h-0 overflow-y-auto overscroll-y-contain border-r lg:block print:hidden"
      >
        <DocsNavLinks className="flex flex-col gap-6 px-4 py-6" />
      </aside>
      <div className="relative z-0 flex h-full min-h-0 min-w-0 flex-col overflow-hidden print:contents">
        <main
          id="docs-content"
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain print:overflow-visible"
        >
          {children}
        </main>
      </div>
      <aside className="relative z-0 hidden min-h-0 overflow-y-auto overscroll-y-contain xl:block print:hidden">
        <TableOfContents />
      </aside>
    </div>
  );
}
