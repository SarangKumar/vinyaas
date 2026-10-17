"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { useSiteColorScheme } from "@/components/playground";
import {
  appliedThemeConfig,
  appliedThemeEvent,
  appliedThemeStorageKey,
  readAppliedTheme,
  siteThemeVariables,
  type AppliedTheme,
} from "@/lib/theme-playground";

/** Marks the document while a playground theme is in force. */
const appliedAttribute = "data-applied-theme";

function announce() {
  window.dispatchEvent(new CustomEvent(appliedThemeEvent));
}

/** Applies `theme` to the whole site and keeps it across navigation/refresh. */
export function applySiteTheme(theme: AppliedTheme) {
  try {
    localStorage.setItem(appliedThemeStorageKey, JSON.stringify(theme));
  } catch {
    // Storage can be unavailable. The theme still applies for this view.
  }

  announce();
}

/** Drops the applied theme so the site returns to its shipped tokens. */
export function resetSiteTheme() {
  try {
    localStorage.removeItem(appliedThemeStorageKey);
  } catch {
    // Nothing to clear when storage is unavailable.
  }

  announce();
}

/** Re-reads the stored theme on Apply / Reset here, and on changes elsewhere. */
function useStoredAppliedTheme() {
  const [applied, setApplied] = useState<AppliedTheme | null>(null);

  useEffect(() => {
    const read = () => setApplied(readAppliedTheme());

    read();
    window.addEventListener(appliedThemeEvent, read);
    // Another tab applied or reset it.
    window.addEventListener("storage", read);

    return () => {
      window.removeEventListener(appliedThemeEvent, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return applied;
}

/**
 * Keeps the document in the theme applied from the Themes playground.
 *
 * The tokens go on `<html>` as inline custom properties, so they beat both
 * `globals.css` and the `prefers-color-scheme` fallback in `docs.css` with no
 * cascade juggling, and come straight back off when the theme is reset. Pages
 * are static and nothing is injected into the HTML, so — exactly as with the
 * saved light/dark choice — the first paint after a hard refresh shows the
 * shipped tokens until this runs.
 */
export function AppliedThemeSync() {
  const applied = useStoredAppliedTheme();
  const mode = useSiteColorScheme();

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (!applied) {
      // Only clear what this component owns: read the keys back off the
      // element so a reset cannot leave a stray token behind.
      const stale = root.getAttribute(appliedAttribute);

      if (stale !== null) {
        for (const name of stale.split(" ").filter(Boolean)) {
          root.style.removeProperty(name);
        }

        root.removeAttribute(appliedAttribute);
      }

      return;
    }

    const variables = siteThemeVariables(appliedThemeConfig(applied), mode);

    for (const [name, value] of Object.entries(variables)) {
      root.style.setProperty(name, value);
    }

    root.setAttribute(appliedAttribute, Object.keys(variables).join(" "));
  }, [applied, mode]);

  return null;
}
