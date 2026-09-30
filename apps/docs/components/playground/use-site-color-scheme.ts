"use client";

import { useSyncExternalStore } from "react";

import type { ThemePreviewMode } from "@/lib/theme-playground";

function readMode(): ThemePreviewMode {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}

/** Follows the docs site dark class without writing to globals.css. */
export function useSiteColorScheme(): ThemePreviewMode {
  return useSyncExternalStore(subscribe, readMode, () => "light");
}
