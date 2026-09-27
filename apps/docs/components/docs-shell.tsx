import Image from "next/image";
import Link from "next/link";

import { DocsMobileNav } from "@/components/docs-mobile-nav";
import { githubUrl } from "@/components/docs-nav";
import { DocsNavLinks } from "@/components/docs-nav-links";
import { focusRing } from "@/components/focus-ring";
import logo from "@/components/logo.png";
import { TableOfContents } from "@/components/table-of-contents";
import { ThemeToggle } from "@/components/theme-toggle";

const headerLink = `cursor-pointer rounded-md px-2 py-1 text-sm text-sidebar-foreground hover:text-foreground ${focusRing}`;

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex h-full min-h-0 flex-col">
      <header className="border-border bg-background z-20 h-12 shrink-0 border-b">
        <div className="flex h-full items-center justify-between gap-4 px-4">
          <Link
            href="/"
            className={`text-foreground inline-flex items-center gap-2 rounded-md text-sm font-medium ${focusRing}`}
          >
            <Image
              src={logo}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span>Vinyaas</span>
          </Link>
          <div className="flex items-center gap-1">
            <nav aria-label="Site" className="flex items-center gap-1">
              <Link href="/" className={headerLink}>
                Docs
              </Link>
              <Link href="/components" className={headerLink}>
                Components
              </Link>
              <a href={githubUrl} className={headerLink}>
                GitHub
              </a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
        <aside className="border-border hidden min-h-0 overflow-y-auto overscroll-y-contain border-r lg:block">
          <DocsNavLinks className="flex flex-col gap-10 px-4 py-8" />
        </aside>
        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
          <DocsMobileNav />
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
    </div>
  );
}
