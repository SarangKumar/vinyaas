"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

import {
  readStoredTheme,
  syncDocumentTheme,
  themeStorageKey,
  writeThemeCookie,
} from "@/components/theme";

/**
 * Keeps the document theme class in sync with storage and system preference
 * after hydration and client navigations — without inline HTML injection.
 */
export function ThemeSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const stored = readStoredTheme();

    if (stored) {
      const cookie = document.cookie
        .split("; ")
        .find((part) => part.startsWith(`${themeStorageKey}=`));

      if (cookie !== `${themeStorageKey}=${stored}`) {
        writeThemeCookie(stored);
      }
    }

    syncDocumentTheme();

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      syncDocumentTheme();
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    const onMedia = () => {
      if (!readStoredTheme()) {
        syncDocumentTheme();
      }
    };
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");

    if (media) {
      media.addEventListener("change", onMedia);
    }

    return () => {
      observer.disconnect();
      media?.removeEventListener("change", onMedia);
    };
  }, [pathname]);

  return null;
}
