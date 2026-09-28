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
 * Next can replace the document class during hydration and client navigations.
 * That drops the dark class the before-paint script added. This puts it back
 * from storage without writing a new preference.
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
