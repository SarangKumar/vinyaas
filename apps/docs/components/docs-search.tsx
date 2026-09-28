"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  componentHref,
  components,
  type ComponentCategory,
} from "@/components/component-meta";
import { Kbd } from "@/registry/new-york/ui/kbd/kbd";
import { SearchIcon } from "@/components/icons";
import { focusRing } from "@/components/focus-ring";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york/ui/command/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/registry/new-york/ui/dialog/dialog";

const categoryLabel: Record<ComponentCategory, string> = {
  form: "Forms",
  feedback: "Feedback",
  layout: "Layout",
  navigation: "Navigation",
  display: "Data Display",
  overlay: "Overlays",
  utility: "Utilities",
};

const pages = [
  {
    title: "Introduction",
    href: "/introduction",
    description: "What Vinyaas is and how the docs are organized.",
    group: "Getting Started",
  },
  {
    title: "Installation",
    href: "/installation",
    description: "Install the CLI, initialize a project, and add a component.",
    group: "Getting Started",
  },
  {
    title: "Changelog",
    href: "/changelog",
    description: "What shipped in v0.1 and v1.0.0.",
    group: "Getting Started",
  },
  ...components.map((component) => ({
    title: component.name,
    href: componentHref(component.slug),
    description: component.description,
    group: categoryLabel[component.category],
  })),
];

const groups = [...new Set(pages.map((page) => page.group))];

export function DocsSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState("⌘K");

  useEffect(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.userAgent);
    const timeout = window.setTimeout(() => setHint(mac ? "⌘K" : "Ctrl K"), 0);

    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
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
    <>
      <button
        type="button"
        aria-keyshortcuts="Meta+K Control+K"
        className={`border-input bg-muted text-muted-foreground hover:text-foreground hidden h-8 min-w-0 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm sm:inline-flex ${focusRing}`}
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4" />
        <span className="truncate">Search docs</span>
        <Kbd className="ml-2 hidden md:inline-flex">{hint}</Kbd>
      </button>
      <button
        type="button"
        aria-label="Search docs"
        className={`text-muted-foreground hover:text-foreground inline-flex size-8 cursor-pointer items-center justify-center rounded-md sm:hidden ${focusRing}`}
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0">
          <DialogTitle className="sr-only">Search documentation</DialogTitle>
          <DialogDescription className="sr-only">
            Search pages and components, then press Enter to open a result.
          </DialogDescription>
          <Command>
            <CommandInput
              aria-label="Search documentation"
              placeholder="Search docs"
            />
            <CommandList>
              <CommandEmpty>No matching pages.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group} heading={group}>
                  {pages
                    .filter((page) => page.group === group)
                    .map((page) => (
                      <CommandItem
                        key={page.href}
                        value={`${page.title} ${page.description}`}
                        onClick={() => {
                          setOpen(false);
                          router.push(page.href);
                        }}
                      >
                        <span className="grid min-w-0">
                          <span>{page.title}</span>
                          <span className="text-muted-foreground truncate text-xs">
                            {page.description}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
