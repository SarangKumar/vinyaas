"use client";

import { useEffect, useState } from "react";

import { focusRing } from "@/components/focus-ring";
import { applyTheme, type ThemeName } from "@/components/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const label =
    theme === "dark"
      ? "Switch to light mode"
      : theme === "light"
        ? "Switch to dark mode"
        : "Toggle color theme";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`text-sidebar-foreground hover:bg-muted hover:text-foreground flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-md sm:size-9 ${focusRing}`}
      onClick={() => {
        const next: ThemeName = document.documentElement.classList.contains(
          "dark",
        )
          ? "light"
          : "dark";

        applyTheme(next);
        setTheme(next);
      }}
    >
      <MoonIcon />
      <SunIcon />
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-theme-icon="sun"
      className="block size-5 sm:size-4 dark:hidden"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-theme-icon="moon"
      className="hidden size-5 sm:size-4 dark:block"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
    </svg>
  );
}
