export const themeStorageKey = "vinyaas-theme";

export type ThemeName = "light" | "dark";

export function readStoredTheme(): ThemeName | null {
  try {
    const stored = localStorage.getItem(themeStorageKey);

    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    return null;
  }

  return null;
}

export function preferredTheme(): ThemeName {
  const stored = readStoredTheme();

  if (stored) {
    return stored;
  }

  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

/**
 * Earlier releases mirrored the choice into a cookie for server rendering.
 * Pages are static now, so the cookie only adds bytes to every request:
 * expire it if it is still around.
 */
export function clearLegacyThemeCookie() {
  if (document.cookie.includes(`${themeStorageKey}=`)) {
    document.cookie = `${themeStorageKey}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}

/**
 * `.dark` drives `dark:` utilities and tokens. `.light` marks an explicit light
 * choice so the docs.css system-dark fallback does not apply.
 */
function setThemeClasses(theme: ThemeName, explicit: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", explicit && theme === "light");
}

export function applyTheme(theme: ThemeName) {
  const previousDark = document.documentElement.classList.contains("dark");
  const nextDark = theme === "dark";
  setThemeClasses(theme, true);

  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage can be unavailable. The class still updates for this view.
  }

  if (previousDark !== nextDark) {
    window.dispatchEvent(
      new CustomEvent("vinyaas:companion-theme", {
        detail: { theme },
      }),
    );
  }
}

/**
 * Re-applies the saved theme, or the system preference when nothing is saved.
 * It does not invent a preference and writes nothing to storage.
 */
export function syncDocumentTheme() {
  const stored = readStoredTheme();
  const theme = stored ?? preferredTheme();
  const root = document.documentElement;
  const wantsLight = stored === "light";

  // Only touch the classes when they differ, so the class observer in
  // ThemeSync does not loop.
  if (
    root.classList.contains("dark") !== (theme === "dark") ||
    root.classList.contains("light") !== wantsLight
  ) {
    setThemeClasses(theme, stored !== null);
  }
}
