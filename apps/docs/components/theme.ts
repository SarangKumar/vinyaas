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

export function applyTheme(theme: ThemeName) {
  document.documentElement.classList.toggle("dark", theme === "dark");

  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage can be unavailable. The class still updates for this view.
  }
}

/**
 * Runs while the HTML is parsed, before the body paints.
 * It only sets the class. The user's choice is stored later, on toggle.
 */
export const themeInitScript = `(function(){try{var stored=localStorage.getItem(${JSON.stringify(themeStorageKey)});var theme=stored==="light"||stored==="dark"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.classList.toggle("dark",theme==="dark");}catch(e){}})();`;
