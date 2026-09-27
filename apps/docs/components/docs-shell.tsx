import Image from "next/image";
import Link from "next/link";

import { DocsMobileNav } from "@/components/docs-mobile-nav";
import { githubUrl, introductionPath } from "@/components/docs-nav";
import { portfolioUrl } from "@/lib/public-env";
import { DocsNavLinks } from "@/components/docs-nav-links";
import { focusRing } from "@/components/focus-ring";
import logo from "@/components/logo.png";
import { TableOfContents } from "@/components/table-of-contents";
import { ThemeToggle } from "@/components/theme-toggle";

const headerLink = `cursor-pointer rounded-md px-2 py-1 text-sm text-sidebar-foreground hover:text-foreground ${focusRing}`;

export function DocsShell({ children }: { children: React.ReactNode }) {
  const portfolio = portfolioUrl();

  return (
    <div className="bg-background text-foreground flex h-full min-h-0 flex-col">
      <header className="border-border bg-background z-20 h-12 shrink-0 border-b">
        <div className="flex h-full items-center justify-between gap-3 px-4">
          <div data-header-section="start" className="flex items-center gap-3">
            <Link
              href={introductionPath}
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
            <nav aria-label="Site" className="flex items-center gap-1">
              <Link href={introductionPath} className={headerLink}>
                Docs
              </Link>
              <Link href="/components" className={headerLink}>
                Components
              </Link>
            </nav>
          </div>
          <div data-header-section="end" className="flex items-center gap-1">
            <ThemeToggle />
            <a
              href={githubUrl}
              aria-label="GitHub"
              title="GitHub"
              className={`text-sidebar-foreground hover:text-foreground inline-flex cursor-pointer rounded-md p-1.5 ${focusRing}`}
            >
              <GitHubIcon />
            </a>
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

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
    >
      <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
    </svg>
  );
}
