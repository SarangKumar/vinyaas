"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { componentsPath, introductionPath } from "@/components/docs-nav";
import { DocsNavLinks } from "@/components/docs-nav-links";
import { focusRing } from "@/components/focus-ring";
import { GitHubLink } from "@/components/github-link";
import { portfolioUrl } from "@/lib/public-env";

export function DocsMobileNav() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const portfolio = portfolioUrl();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        rootRef.current &&
        target instanceof Node &&
        !rootRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative lg:hidden">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        className={`text-sidebar-foreground hover:bg-muted hover:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-md ${focusRing}`}
        onClick={() => setOpen((current) => !current)}
      >
        <MenuIcon />
      </button>
      {open ? (
        <div className="border-border bg-background absolute top-full left-0 z-30 mt-2 max-h-[min(32rem,calc(100dvh-4rem))] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-md border p-3 shadow-sm">
          <div
            onClick={(event) => {
              const target = event.target;

              if (target instanceof Element && target.closest("a")) {
                setOpen(false);
              }
            }}
          >
            <nav aria-label="Site" className="mb-3 flex flex-col gap-0.5">
              <Link href={introductionPath} className={menuLink}>
                Docs
              </Link>
              <Link href={componentsPath} className={menuLink}>
                Components
              </Link>
            </nav>
            <DocsNavLinks className="flex flex-col gap-4" />
          </div>
          <div className="border-border mt-4 flex flex-col gap-1 border-t pt-3">
            <GitHubLink />
            {portfolio ? (
              <a
                href={portfolio}
                target="_blank"
                rel="noreferrer"
                className={`text-sidebar-foreground hover:text-foreground rounded-md px-2 py-1.5 text-sm ${focusRing}`}
              >
                Portfolio
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const menuLink = `text-sidebar-foreground hover:bg-muted hover:text-foreground rounded-md px-2 py-1.5 text-sm ${focusRing}`;

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
