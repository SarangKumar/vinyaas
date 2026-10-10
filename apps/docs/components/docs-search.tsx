"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { componentHref, components } from "@/components/component-meta";
import { BookIcon, ComponentIcon, SearchIcon } from "@/components/icons";
import { focusRing } from "@/components/focus-ring";
import { Kbd, KbdGroup } from "@/registry/new-york/ui/kbd";
import {
  Command,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/registry/new-york/ui/dialog";

type SearchPage = {
  title: string;
  href: string;
  description: string;
  group: "Pages" | "Components";
};

export type DocsSearchPage = SearchPage;

const docPages: SearchPage[] = [
  {
    title: "Home",
    href: "/",
    description: "Vinyaas homepage and component showcase.",
    group: "Pages",
  },
  {
    title: "Introduction",
    href: "/introduction",
    description: "What Vinyaas is and how the docs are organized.",
    group: "Pages",
  },
  {
    title: "Components",
    href: "/components",
    description: "Browse the full catalog of installable UI primitives.",
    group: "Pages",
  },
  {
    title: "Installation",
    href: "/installation",
    description:
      "Choose Next.js, React + Vite, or React, then install Vinyaas as source.",
    group: "Pages",
  },
  {
    title: "Install with Next.js",
    href: "/installation/nextjs",
    description:
      "Install Vinyaas in a Next.js App Router project with fresh, existing, or shadcn-style setup paths.",
    group: "Pages",
  },
  {
    title: "Install with React + Vite",
    href: "/installation/vite",
    description:
      "Install Vinyaas in a Vite + React project with fresh, existing, or shadcn-style setup paths.",
    group: "Pages",
  },
  {
    title: "Install with React",
    href: "/installation/react",
    description:
      "Install Vinyaas in other React projects with fresh, existing, or shadcn-style setup paths.",
    group: "Pages",
  },
  {
    title: "CLI",
    href: "/cli",
    description:
      "init, doctor, add, categories, status, list, search, and info for source installs.",
    group: "Pages",
  },
  {
    title: "Companions",
    href: "/companion",
    description:
      "Meet Ember, Soul, Moss, Flint, Bubble, Rime, Jab, and Volt — tiny Vinyaas companions separate from UI components.",
    group: "Pages",
  },
  {
    title: "Companion Installation",
    href: "/companion/installation",
    description:
      "How companions will be installed. CLI companion commands are planned, not available yet.",
    group: "Pages",
  },
  {
    title: "companion.json",
    href: "/companion/configuration",
    description:
      "Companion identity, animations, personality, capabilities, and interaction metadata.",
    group: "Pages",
  },
  {
    title: "Custom Companion",
    href: "/companion/custom",
    description:
      "Planned workflow for creating custom companions with assets and companion.json.",
    group: "Pages",
  },
  {
    title: "components.json",
    href: "/components-json",
    description:
      "Local project config for style, aliases, and Tailwind paths used by vinyaas init and add.",
    group: "Pages",
  },
  {
    title: "Theming",
    href: "/theming",
    description:
      "CSS variables, semantic colors, radius, dark mode, and theme customization.",
    group: "Pages",
  },
  {
    title: "Themes playground",
    href: "/themes",
    description:
      "Visual theme playground: curated presets, radius, and real UI compositions.",
    group: "Pages",
  },
  {
    title: "Typeset",
    href: "/typeset",
    description:
      "Markdown-first content typography docs. Distinct from the Typography component.",
    group: "Pages",
  },
  {
    title: "Typeset playground",
    href: "/typeset/playground",
    description:
      "Experiment with measure, fonts, size, leading, and flow on Markdown-style content.",
    group: "Pages",
  },
  {
    title: "Package Import",
    href: "/package-import",
    description:
      "Import installed Vinyaas components via project aliases and local source paths.",
    group: "Pages",
  },
  {
    title: "Dark Mode",
    href: "/dark-mode",
    description:
      "Choose a framework, then enable light and dark themes with the class strategy.",
    group: "Pages",
  },
  {
    title: "Dark Mode with Next.js",
    href: "/dark-mode/nextjs",
    description: "Wire Vinyaas dark class tokens in a Next.js App Router app.",
    group: "Pages",
  },
  {
    title: "Dark Mode with React + Vite",
    href: "/dark-mode/vite",
    description: "Wire Vinyaas dark class tokens in a Vite + React app.",
    group: "Pages",
  },
  {
    title: "Dark Mode with React",
    href: "/dark-mode/react",
    description: "Wire Vinyaas dark class tokens in a generic React app.",
    group: "Pages",
  },
  {
    title: "Changelog",
    href: "/changelog",
    description: "What shipped through v1.3.2.",
    group: "Pages",
  },
  {
    title: "Catalogs",
    href: "/catalogs",
    description: "Named registry catalogs for discovery and bulk install.",
    group: "Pages",
  },
  {
    title: "Accessibility",
    href: "/accessibility",
    description: "Release-wide accessibility contract for registry components.",
    group: "Pages",
  },
];

/** Component results — one entry per registry metadata item (no manual duplicates). */
const componentPages: SearchPage[] = components.map((component) => ({
  title: component.name,
  href: componentHref(component.slug),
  description: component.description,
  group: "Components" as const,
}));

const pages: SearchPage[] = [...docPages, ...componentPages];

/** Full search index (pages + metadata-backed components). Exported for tests. */
export const docsSearchPages: readonly DocsSearchPage[] = pages;

const groupOrder = ["Pages", "Components"] as const;

type DocsSearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  hint: string;
};

const DocsSearchContext = createContext<DocsSearchContextValue | null>(null);

function useDocsSearch() {
  const context = useContext(DocsSearchContext);

  if (!context) {
    throw new Error(
      "Docs search controls must render inside DocsSearchProvider.",
    );
  }

  return context;
}

export function DocsSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState("⌘K");

  useEffect(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.userAgent);
    const timeout = window.setTimeout(() => setHint(mac ? "⌘K" : "Ctrl K"), 0);

    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        event.target instanceof HTMLElement &&
        !event.target.closest(
          "input, textarea, select, [contenteditable='true']",
        )
      ) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <DocsSearchContext.Provider value={{ open, setOpen, hint }}>
      {children}
      <SearchDialog />
    </DocsSearchContext.Provider>
  );
}

export function DocsSearchField() {
  const { setOpen, hint } = useDocsSearch();

  return (
    <button
      type="button"
      aria-label="Search documentation"
      aria-keyshortcuts="Meta+K Control+K"
      className={`border-input bg-muted text-muted-foreground hover:text-foreground inline-flex h-8 w-full max-w-md min-w-0 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm ${focusRing}`}
      onClick={() => setOpen(true)}
    >
      <SearchIcon className="size-4 shrink-0" />
      <span className="truncate">Search documentation...</span>
      <Kbd className="ml-auto">{hint}</Kbd>
    </button>
  );
}

export function DocsSearchIcon() {
  const { setOpen } = useDocsSearch();

  return (
    <button
      type="button"
      aria-label="Search documentation"
      className={`text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-12 cursor-pointer items-center justify-center rounded-md md:hidden ${focusRing}`}
      onClick={() => setOpen(true)}
    >
      <SearchIcon className="size-5" />
    </button>
  );
}

function matchesQuery(page: SearchPage, query: string) {
  const title = page.title.toLowerCase();
  const description = page.description.toLowerCase();

  return title.includes(query) || description.includes(query);
}

/**
 * Lower score = stronger match. Title matches outrank description-only hits.
 * 0 exact title · 1 title prefix · 2 title contains · 3 description only
 */
export function searchRank(
  page: Pick<SearchPage, "title" | "description">,
  query: string,
): number {
  const title = page.title.toLowerCase();
  const description = page.description.toLowerCase();
  const q = query.trim().toLowerCase();

  if (!q) {
    return Number.POSITIVE_INFINITY;
  }

  if (title === q) {
    return 0;
  }

  if (title.startsWith(q)) {
    return 1;
  }

  if (title.includes(q)) {
    return 2;
  }

  if (description.includes(q)) {
    return 3;
  }

  return Number.POSITIVE_INFINITY;
}

export function rankSearchPages(
  pagesToRank: SearchPage[],
  query: string,
): SearchPage[] {
  const q = query.trim().toLowerCase();

  return [...pagesToRank]
    .filter((page) => matchesQuery(page, q))
    .sort((a, b) => {
      const rankDiff = searchRank(a, q) - searchRank(b, q);

      if (rankDiff !== 0) {
        return rankDiff;
      }

      return pagesToRank.indexOf(a) - pagesToRank.indexOf(b);
    });
}

function SearchDialog() {
  const router = useRouter();
  const { open, setOpen } = useDocsSearch();
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = normalized ? rankSearchPages(pages, normalized) : pages;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);

        if (!next) {
          setQuery("");
        }
      }}
    >
      <DialogContent className="border-border/80 bg-popover max-w-lg gap-0 overflow-hidden rounded-xl border p-0 shadow-md">
        <DialogTitle className="sr-only">Search documentation</DialogTitle>
        <DialogDescription className="sr-only">
          Search pages and components, then press Enter to open a result.
        </DialogDescription>
        <Command
          onQueryChange={setQuery}
          className="bg-popover rounded-none border-0 shadow-none"
        >
          <CommandInput
            aria-label="Search documentation"
            placeholder="Search documentation..."
          />
          <CommandList>
            {normalized !== "" && results.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm">
                <p>No results found.</p>
                <p className="text-muted-foreground">
                  Try another search term.
                </p>
              </div>
            ) : (
              groupOrder.map((group) => {
                const items = results.filter((page) => page.group === group);

                if (items.length === 0) {
                  return null;
                }

                return (
                  <CommandGroup key={group} heading={group}>
                    {items.map((page) => (
                      <CommandItem
                        key={page.href}
                        value={`${page.title} ${page.description}`}
                        onClick={() => {
                          setOpen(false);
                          setQuery("");
                          router.push(page.href);
                        }}
                      >
                        {page.group === "Pages" ? (
                          <BookIcon className="text-muted-foreground size-4 shrink-0" />
                        ) : (
                          <ComponentIcon className="text-muted-foreground size-4 shrink-0" />
                        )}
                        <span className="grid min-w-0 flex-1 gap-0.5">
                          <span className="truncate">{page.title}</span>
                          <span className="text-muted-foreground truncate text-xs font-normal">
                            {page.description}
                          </span>
                        </span>
                        <span className="text-muted-foreground shrink-0 text-xs font-normal">
                          {page.group}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })
            )}
          </CommandList>
          <CommandFooter>
            <span className="inline-flex items-center gap-1.5">
              <KbdGroup>
                <Kbd>Tab</Kbd>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </KbdGroup>
              <span>Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              <span>Open</span>
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5">
              <Kbd>Esc</Kbd>
              <span>Close</span>
            </span>
          </CommandFooter>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
