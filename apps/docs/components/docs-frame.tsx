"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { DocsNavLinks } from "@/components/docs-nav-links";
import { TableOfContents } from "@/components/table-of-contents";

/**
 * Docs pages keep the sidebar and the table of contents.
 * Homepage, Themes playground, and Typeset playground are full-width showcases.
 */
export function DocsFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const themesShowcase =
    pathname === "/themes" || pathname.startsWith("/themes/");
  const typesetShowcase =
    pathname === "/typeset/playground" ||
    pathname.startsWith("/typeset/playground/");
  const showcase = pathname === "/" || themesShowcase || typesetShowcase;

  if (showcase) {
    const frame =
      pathname === "/"
        ? "home"
        : typesetShowcase
          ? "typeset"
          : themesShowcase
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
        <div className="flex min-h-full flex-col">
          <TableOfContents />
          <div className="mt-auto px-5 pb-8">
            <div
              data-docs-feature-card
              className="border-border bg-card/70 hover:bg-card text-card-foreground rounded-md border p-3 transition-colors"
            >
              <p className="text-foreground text-sm font-medium">
                What&apos;s new
              </p>
              <p className="text-muted-foreground mt-1.5 text-xs leading-5">
                Build dashboards faster with Resizable, Sidebar, Drag &amp;
                Drop, catalogs, and accessible primitives.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
