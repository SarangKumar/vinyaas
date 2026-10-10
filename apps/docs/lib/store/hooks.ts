"use client";

import { useSyncExternalStore } from "react";

import type { CodeLanguage } from "@/components/code-languages";
import {
  isCodeLanguage,
  setCodeLanguage,
} from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

export const codeLanguageStorageKey = "vinyaas-code-language";

// Server and first client render use TSX; the hydrator restores the session choice.
const serverLanguage = (): CodeLanguage => "tsx";

export function useCodeLanguage() {
  return useSyncExternalStore(
    store.subscribe,
    () => store.getState().codeLanguage.value,
    serverLanguage,
  );
}

export function useSetCodeLanguage() {
  return (language: CodeLanguage) => {
    store.dispatch(setCodeLanguage(language));
    window.sessionStorage.setItem(codeLanguageStorageKey, language);
  };
}

export function readStoredCodeLanguage(): CodeLanguage | null {
  const stored = window.sessionStorage.getItem(codeLanguageStorageKey);

  return isCodeLanguage(stored) ? stored : null;
}
