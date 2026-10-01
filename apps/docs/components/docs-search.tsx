"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { componentHref, components } from "@/components/component-meta";
import { BookIcon, ComponentIcon, SearchIcon } from "@/components/icons";
import { focusRing } from "@/components/focus-ring";
import { Kbd } from "@/registry/new-york/ui/kbd";
import {
  Command,
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
  group: "Getting Started" | "Components";
};

const pages: SearchPage[] = [
  {
    title: "Introduction",
    href: "/introduction",
    description: "What Vinyaas is and how the docs are organized.",
    group: "Getting Started",
  },
  {
    title: "Installation",
    href: "/installation",
    description:
      "Choose Next.js, React + Vite, or React, then install Vinyaas as source.",
    group: "Getting Started",
  },
  {
    title: "Install with Next.js",
    href: "/installation/nextjs",
    description:
      "Install Vinyaas in a Next.js App Router project with fresh, existing, or shadcn-style setup paths.",
    group: "Getting Started",
  },
  {
    title: "Install with React + Vite",
    href: "/installation/vite",
    description:
      "Install Vinyaas in a Vite + React project with fresh, existing, or shadcn-style setup paths.",
    group: "Getting Started",
  },
  {
    title: "Install with React",
    href: "/installation/react",
    description:
      "Install Vinyaas in other React projects with fresh, existing, or shadcn-style setup paths.",
    group: "Getting Started",
  },
  {
    title: "CLI",
    href: "/cli",
    description:
      "init, doctor, add, categories, status, list, search, and info for source installs.",
    group: "Getting Started",
  },
  {
    title: "Companions",
    href: "/companion",
    description:
      "Meet Ember, Soul, and Moss — tiny Vinyaas companions separate from UI components.",
    group: "Getting Started",
  },
  {
    title: "Companion Installation",
    href: "/companion/installation",
    description:
      "How companions will be installed. CLI companion commands are planned, not available yet.",
    group: "Getting Started",
  },
  {
    title: "companion.json",
    href: "/companion/configuration",
    description:
      "Companion identity, animations, personality, capabilities, and interaction metadata.",
    group: "Getting Started",
  },
  {
    title: "Custom Companion",
    href: "/companion/custom",
    description:
      "Planned workflow for creating custom companions with assets and companion.json.",
    group: "Getting Started",
  },
  {
    title: "components.json",
    href: "/components-json",
    description:
      "Local project config for style, aliases, and Tailwind paths used by vinyaas init and add.",
    group: "Getting Started",
  },
  {
    title: "Theming",
    href: "/theming",
    description:
      "CSS variables, semantic colors, radius, dark mode, and theme customization.",
    group: "Getting Started",
  },
  {
    title: "Themes playground",
    href: "/themes",
    description:
      "Visual theme playground: curated presets, radius, and real UI compositions.",
    group: "Getting Started",
  },
  {
    title: "Typeset",
    href: "/typeset",
    description:
      "Markdown-first content typography docs. Distinct from the Typography component.",
    group: "Getting Started",
  },
  {
    title: "Typeset playground",
    href: "/typeset/playground",
    description:
      "Experiment with measure, fonts, size, leading, and flow on Markdown-style content.",
    group: "Getting Started",
  },
  {
    title: "Package Import",
    href: "/package-import",
    description:
      "Import installed Vinyaas components via project aliases and local source paths.",
    group: "Getting Started",
  },
  {
    title: "Dark Mode",
    href: "/dark-mode",
    description:
      "Choose a framework, then enable light and dark themes with the class strategy.",
    group: "Getting Started",
  },
  {
    title: "Dark Mode with Next.js",
    href: "/dark-mode/nextjs",
    description: "Wire Vinyaas dark class tokens in a Next.js App Router app.",
    group: "Getting Started",
  },
  {
    title: "Dark Mode with React + Vite",
    href: "/dark-mode/vite",
    description: "Wire Vinyaas dark class tokens in a Vite + React app.",
    group: "Getting Started",
  },
  {
    title: "Dark Mode with React",
    href: "/dark-mode/react",
    description: "Wire Vinyaas dark class tokens in a generic React app.",
    group: "Getting Started",
  },
  {
    title: "Changelog",
    href: "/changelog",
    description: "What shipped in v0.1, v1.0.0, v1.1.0, and v1.2.0.",
    group: "Getting Started",
  },
  ...components.map((component) => ({
    title: component.name,
    href: componentHref(component.slug),
    description: component.description,
    group: "Components" as const,
  })),
];

const groupOrder = ["Components", "Getting Started"] as const;

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
      className={`text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-8 cursor-pointer items-center justify-center rounded-md md:hidden ${focusRing}`}
      onClick={() => setOpen(true)}
    >
      <SearchIcon className="size-4" />
    </button>
  );
}

function matchesQuery(page: SearchPage, query: string) {
  const haystack = `${page.title} ${page.description}`.toLowerCase();

  return haystack.includes(query);
}

function SearchDialog() {
  const router = useRouter();
  const { open, setOpen } = useDocsSearch();
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? pages.filter((page) => matchesQuery(page, normalized))
    : [];

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
      <DialogContent className="border-border bg-secondary max-w-lg gap-0 overflow-hidden border p-0 shadow-sm">
        <DialogTitle className="sr-only">Search documentation</DialogTitle>
        <DialogDescription className="sr-only">
          Search pages and components, then press Enter to open a result.
        </DialogDescription>
        <Command
          onQueryChange={setQuery}
          className="bg-secondary rounded-none border-0 shadow-none"
        >
          <CommandInput
            aria-label="Search documentation"
            placeholder="Search documentation..."
          />
          <CommandList>
            {normalized === "" ? (
              <p className="text-muted-foreground px-3 py-8 text-center text-sm">
                Search components, docs and pages
              </p>
            ) : results.length === 0 ? (
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
                        {page.group === "Getting Started" ? (
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
        </Command>
      </DialogContent>
    </Dialog>
  );
}
