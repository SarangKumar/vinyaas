import Image from "next/image";
import Link from "next/link";

import { DocsMobileNav } from "@/components/docs-mobile-nav";
import {
  DocsSearchField,
  DocsSearchIcon,
  DocsSearchProvider,
} from "@/components/docs-search";
import {
  componentsPath,
  homePath,
  introductionPath,
} from "@/components/docs-nav";
import { portfolioUrl } from "@/lib/public-env";
import { DocsNavLinks } from "@/components/docs-nav-links";
import { focusRing } from "@/components/focus-ring";
import { GitHubLink } from "@/components/github-link";
import logo from "@/components/logo.png";
import { TableOfContents } from "@/components/table-of-contents";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/registry/new-york/ui/toast/toast";

const headerLink = `cursor-pointer rounded-md px-2 py-1 text-sm text-sidebar-foreground hover:text-foreground ${focusRing}`;

export function DocsShell({ children }: { children: React.ReactNode }) {
  const portfolio = portfolioUrl();

  return (
    <DocsSearchProvider>
      <div className="bg-background text-foreground flex h-full min-h-0 flex-col">
        <header className="border-border bg-background z-20 h-12 shrink-0 border-b">
          <div className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4">
            <div
              data-header-section="start"
              className="flex min-w-0 items-center gap-3"
            >
              <DocsMobileNav />
              <Link
                href={homePath}
                className={`text-foreground inline-flex min-w-0 items-center gap-2 rounded-md text-sm font-medium ${focusRing}`}
              >
                <Image
                  src={logo}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                <span className="truncate">Vinyaas</span>
              </Link>
              <nav
                aria-label="Site"
                className="hidden min-w-0 items-center gap-1 md:flex"
              >
                <Link href={introductionPath} className={headerLink}>
                  Docs
                </Link>
                <Link href={componentsPath} className={headerLink}>
                  Components
                </Link>
              </nav>
            </div>
            <div
              data-header-section="end"
              className="flex min-w-0 shrink-0 items-center justify-end gap-2 lg:gap-4"
            >
              <div className="hidden w-56 min-w-0 md:block lg:w-72">
                <DocsSearchField />
              </div>
              <DocsSearchIcon />
              <div className="hidden items-center gap-4 lg:flex">
                <GitHubLink />
                {portfolio ? (
                  <a
                    href={portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className={headerLink}
                  >
                    Portfolio
                  </a>
                ) : null}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
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
        <Toaster />
      </div>
    </DocsSearchProvider>
  );
}
