"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";

import { readStoredCodeLanguage } from "@/lib/store/hooks";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

/**
 * Restores the session language after mount so the server render stays TSX.
 * sessionStorage is not read inside the reducer.
 */
function CodeLanguageHydrator() {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = readStoredCodeLanguage();

      if (stored) {
        store.dispatch(setCodeLanguage(stored));
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  return null;
}

export function DocsStoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <CodeLanguageHydrator />
      {children}
    </Provider>
  );
}
