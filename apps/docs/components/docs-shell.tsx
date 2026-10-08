import Link from "next/link";

import { DocsFrame } from "@/components/docs-frame";
import { DocsMobileNav } from "@/components/docs-mobile-nav";
import {
  DocsSearchField,
  DocsSearchIcon,
  DocsSearchProvider,
} from "@/components/docs-search";
import {
  companionPath,
  componentsPath,
  homePath,
  installationPath,
  introductionPath,
  themesPath,
  typesetPlaygroundPath,
} from "@/components/docs-nav";
import { portfolioUrl } from "@/lib/public-env";
import { focusRing } from "@/components/focus-ring";
import { GitHubLink } from "@/components/github-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { CompanionProvider } from "@/components/companion/companion-provider";
import { VinyaasMark } from "@/components/vinyaas-mark";
import { Toaster } from "@/registry/new-york/ui/toast";

const headerLink = `text-foreground hover:text-foreground/80 cursor-pointer rounded-md px-2 py-1 text-sm ${focusRing}`;

/**
 * Site chrome. Below lg: Menu · Home · Search · Theme · GitHub.
 * At lg+: full site nav links + search field + GitHub/Portfolio.
 * Nav links and the hamburger share the lg breakpoint so they never overlap.
 */
export function DocsShell({ children }: { children: React.ReactNode }) {
  const portfolio = portfolioUrl();

  return (
    <DocsSearchProvider>
      <CompanionProvider>
        <div className="bg-background text-foreground flex h-full min-h-0 flex-col">
          <header className="bg-background relative z-[60] h-12 shrink-0 print:hidden">
            <div className="grid h-full grid-cols-[auto_minmax(0,1fr)] items-center gap-2 px-3 sm:gap-3 sm:px-4">
              <div
                data-header-section="start"
                className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3"
              >
                <DocsMobileNav />
                <Link
                  href={homePath}
                  aria-label="Vinyaas home"
                  className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md ${focusRing}`}
                >
                  <VinyaasMark className="size-7" />
                </Link>
                <nav
                  aria-label="Site"
                  className="flex shrink-0 items-center gap-1"
                >
                  <Link href={homePath} className={headerLink}>
                    Home
                  </Link>
                  <Link
                    href={introductionPath}
                    className={`${headerLink} hidden lg:inline-flex`}
                  >
                    Docs
                  </Link>
                  <Link
                    href={componentsPath}
                    className={`${headerLink} hidden lg:inline-flex`}
                  >
                    Components
                  </Link>
                  <Link
                    href={companionPath}
                    className={`${headerLink} hidden lg:inline-flex`}
                  >
                    Companion
                  </Link>
                  <Link
                    href={installationPath}
                    className={`${headerLink} hidden lg:inline-flex`}
                  >
                    Installation
                  </Link>
                  <Link
                    href={themesPath}
                    className={`${headerLink} hidden lg:inline-flex`}
                  >
                    Themes
                  </Link>
                  <Link
                    href={typesetPlaygroundPath}
                    className={`${headerLink} hidden lg:inline-flex`}
                  >
                    Typeset
                  </Link>
                </nav>
              </div>
              <div
                data-header-section="end"
                className="flex min-w-0 items-center justify-end gap-1 sm:gap-2 lg:gap-4"
              >
                <div className="hidden min-w-0 flex-1 md:block md:max-w-56 lg:max-w-72">
                  <DocsSearchField />
                </div>
                <DocsSearchIcon />
                <ThemeToggle />
                {/* Mobile / tablet: compact GitHub beside theme */}
                <div className="lg:hidden">
                  <GitHubLink variant="compact" />
                </div>
                {/* Desktop: full GitHub + optional portfolio */}
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
              </div>
            </div>
          </header>
          <DocsFrame>{children}</DocsFrame>
          <div className="print:hidden">
            <Toaster />
          </div>
        </div>
      </CompanionProvider>
    </DocsSearchProvider>
  );
}
