"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Link from "next/link";

import {
  componentsPath,
  installationPath,
  introductionPath,
  themesPath,
  typesetPlaygroundPath,
} from "@/components/docs-nav";
import { DocsNavLinks } from "@/components/docs-nav-links";
import { focusRing } from "@/components/focus-ring";
import { GitHubLink } from "@/components/github-link";
import { portfolioUrl } from "@/lib/public-env";

/**
 * Mobile documentation drawer.
 * Drawer content portals to document.body only after the user opens it
 * (`open` starts false), so server HTML and the first client paint match.
 */
export function DocsMobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const portfolio = portfolioUrl();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // `open` starts false on server and first client paint, so createPortal
  // (and document.body) only run after a user click on the client.
  const drawer = open
    ? createPortal(
        <div className="fixed inset-0 z-40 lg:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close menu"
            className="bg-background/80 absolute inset-0 backdrop-blur-[1px]"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
          />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="border-border bg-background absolute inset-y-0 left-0 flex w-[min(20rem,calc(100vw-2.5rem))] max-w-full flex-col border-r shadow-[0_12px_40px_-24px_var(--foreground)]"
          >
            <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-3">
              <p className="text-foreground text-sm font-medium">Navigation</p>
              <button
                type="button"
                aria-label="Close menu"
                className={`text-sidebar-foreground hover:bg-muted hover:text-foreground flex size-9 cursor-pointer items-center justify-center rounded-md ${focusRing}`}
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <CloseIcon />
              </button>
            </div>
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-4"
              onClick={(event) => {
                const target = event.target;

                if (target instanceof Element && target.closest("a")) {
                  setOpen(false);
                }
              }}
            >
              <nav aria-label="Site" className="mb-4 flex flex-col gap-0.5">
                <Link href={introductionPath} className={menuLink}>
                  Docs
                </Link>
                <Link href={componentsPath} className={menuLink}>
                  Components
                </Link>
                <Link href={installationPath} className={menuLink}>
                  Installation
                </Link>
                <Link href={themesPath} className={menuLink}>
                  Themes
                </Link>
                <Link href={typesetPlaygroundPath} className={menuLink}>
                  Typeset
                </Link>
              </nav>
              <DocsNavLinks className="flex flex-col gap-5" />
            </div>
            <div className="border-border flex flex-col gap-1 border-t px-3 py-3">
              <GitHubLink />
              {portfolio ? (
                <a
                  href={portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-sidebar-foreground hover:text-foreground rounded-md px-2 py-2.5 text-sm ${focusRing}`}
                >
                  Portfolio
                </a>
              ) : null}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={`text-sidebar-foreground hover:bg-muted hover:text-foreground flex size-9 cursor-pointer items-center justify-center rounded-md ${focusRing}`}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      {drawer}
    </div>
  );
}

const menuLink = `text-sidebar-foreground hover:bg-muted hover:text-foreground rounded-md px-2 py-2.5 text-sm ${focusRing}`;

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

function CloseIcon() {
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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
