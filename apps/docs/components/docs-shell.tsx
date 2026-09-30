import Image from "next/image";
import Link from "next/link";

import { DocsFrame } from "@/components/docs-frame";
import { DocsMobileNav } from "@/components/docs-mobile-nav";
import {
  DocsSearchField,
  DocsSearchIcon,
  DocsSearchProvider,
} from "@/components/docs-search";
import {
  componentsPath,
  homePath,
  installationPath,
  introductionPath,
  themesPath,
  typesetPath,
} from "@/components/docs-nav";
import { portfolioUrl } from "@/lib/public-env";
import { focusRing } from "@/components/focus-ring";
import { GitHubLink } from "@/components/github-link";
import logo from "@/components/logo.png";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/registry/new-york/ui/toast";

const headerLink = `cursor-pointer rounded-md px-2 py-1 text-sm text-sidebar-foreground hover:text-foreground ${focusRing}`;

export function DocsShell({ children }: { children: React.ReactNode }) {
  const portfolio = portfolioUrl();

  return (
    <DocsSearchProvider>
      <div className="bg-background text-foreground flex h-full min-h-0 flex-col">
        <header className="border-border bg-background relative z-30 h-12 shrink-0 border-b print:hidden">
          <div className="grid h-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-4">
            <div
              data-header-section="start"
              className="flex shrink-0 items-center gap-3"
            >
              <DocsMobileNav />
              <Link
                href={homePath}
                className={`text-foreground inline-flex shrink-0 items-center gap-2 rounded-md text-sm font-medium ${focusRing}`}
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
              <nav
                aria-label="Site"
                className="hidden shrink-0 items-center gap-1 md:flex"
              >
                <Link href={introductionPath} className={headerLink}>
                  Docs
                </Link>
                <Link href={componentsPath} className={headerLink}>
                  Components
                </Link>
                <Link href={installationPath} className={headerLink}>
                  Installation
                </Link>
                <Link href={themesPath} className={headerLink}>
                  Themes
                </Link>
                <Link href={typesetPath} className={headerLink}>
                  Typeset
                </Link>
              </nav>
            </div>
            <div
              data-header-section="end"
              className="flex min-w-0 items-center justify-end gap-2 lg:gap-4"
            >
              <div className="hidden min-w-0 flex-1 md:block md:max-w-56 lg:max-w-72">
                <DocsSearchField />
              </div>
              <DocsSearchIcon />
              <div className="hidden shrink-0 items-center gap-4 lg:flex">
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
        <DocsFrame>{children}</DocsFrame>
        <div className="print:hidden">
          <Toaster />
        </div>
      </div>
    </DocsSearchProvider>
  );
}
