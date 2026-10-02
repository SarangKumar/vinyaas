"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Link from "next/link";

import {
  companionPath,
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

const CLOSE_MS = 200;

/**
 * Full-viewport mobile navigation sheet (below the fixed header).
 * Desktop is untouched — this mounts only below the `lg` breakpoint.
 */
export function DocsMobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const portfolio = portfolioUrl();

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openMenu() {
    clearCloseTimer();
    setMounted(true);
    setOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }

  function closeMenu() {
    setOpen(false);
    setVisible(false);
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      closeTimerRef.current = null;
    }, CLOSE_MS);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setVisible(false);
        clearCloseTimer();
        closeTimerRef.current = setTimeout(() => {
          setMounted(false);
          closeTimerRef.current = null;
        }, CLOSE_MS);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const drawer = mounted
    ? createPortal(
        <div
          data-docs-mobile-nav
          data-state={visible ? "open" : "closed"}
          className="fixed inset-x-0 top-12 bottom-0 z-50 lg:hidden"
          role="presentation"
        >
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            data-docs-mobile-panel
            className="absolute inset-0 flex flex-col transition-[opacity,transform] duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-0.5rem)",
            }}
          >
            <div
              aria-hidden="true"
              data-docs-mobile-backdrop
              className="absolute inset-0 bg-white/5 backdrop-blur-2xl dark:bg-white/5"
            />
            <div className="bg-background/80 relative flex min-h-0 flex-1 flex-col dark:bg-background/75">
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-5"
                onClick={(event) => {
                  const target = event.target;

                  if (target instanceof Element && target.closest("a")) {
                    closeMenu();
                  }
                }}
              >
                <p className="text-muted-foreground px-3 pb-3 text-xs font-medium tracking-[0.14em] uppercase">
                  Navigation
                </p>
                <nav aria-label="Site" className="mb-6 flex flex-col gap-1">
                  <Link href={introductionPath} className={menuLink}>
                    Docs
                  </Link>
                  <Link href={componentsPath} className={menuLink}>
                    Components
                  </Link>
                  <Link href={companionPath} className={menuLink}>
                    Companion
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
                <DocsNavLinks
                  density="comfortable"
                  className="flex flex-col gap-7"
                />
              </div>
              <div className="border-border flex flex-col gap-2 border-t px-4 py-4">
                <GitHubLink variant="mobile" />
                {portfolio ? (
                  <a
                    href={portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-sidebar-foreground hover:bg-muted hover:text-foreground flex min-h-12 items-center gap-2.5 rounded-md px-3 py-3 text-base ${focusRing}`}
                  >
                    Portfolio
                    <ExternalIcon />
                  </a>
                ) : null}
              </div>
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
        aria-controls={open || mounted ? panelId : undefined}
        className={`text-sidebar-foreground hover:bg-muted hover:text-foreground flex size-12 cursor-pointer items-center justify-center rounded-md ${focusRing}`}
        onClick={() => {
          if (open) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
      >
        <MenuToggleIcon open={open} />
      </button>
      {drawer}
    </div>
  );
}

const menuLink = `text-sidebar-foreground hover:bg-muted hover:text-foreground flex min-h-12 items-center rounded-md px-3 py-3 text-base ${focusRing}`;

/** Two-bar hamburger that rotates into an X when open. */
function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      data-menu-icon
      data-state={open ? "open" : "closed"}
      className="relative flex size-5 items-center justify-center"
    >
      <span
        className={
          open
            ? "bg-current absolute h-0.5 w-[1.125rem] rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none translate-y-0 rotate-45"
            : "bg-current absolute h-0.5 w-[1.125rem] rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none -translate-y-[0.22rem] rotate-0"
        }
      />
      <span
        className={
          open
            ? "bg-current absolute h-0.5 w-[1.125rem] rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none translate-y-0 -rotate-45"
            : "bg-current absolute h-0.5 w-[1.125rem] rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none translate-y-[0.22rem] rotate-0"
        }
      />
    </span>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 shrink-0 opacity-70"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4h6v6" />
      <path d="M10 14 20 4" />
      <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
    </svg>
  );
}
