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

export function writeThemeCookie(theme: ThemeName) {
  document.cookie = `${themeStorageKey}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function applyTheme(theme: ThemeName) {
  const previousDark = document.documentElement.classList.contains("dark");
  const nextDark = theme === "dark";
  document.documentElement.classList.toggle("dark", nextDark);

  try {
    localStorage.setItem(themeStorageKey, theme);
    writeThemeCookie(theme);
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
 * It does not invent a preference. A saved choice is mirrored into the cookie
 * so the next server render keeps the same class.
 */
export function syncDocumentTheme() {
  const stored = readStoredTheme();
  const theme = preferredTheme();
  const dark = theme === "dark";

  if (document.documentElement.classList.contains("dark") !== dark) {
    document.documentElement.classList.toggle("dark", dark);
  }

  if (stored) {
    writeThemeCookie(stored);
  }
}
