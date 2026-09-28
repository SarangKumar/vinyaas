"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { Provider, useDispatch } from "react-redux";
import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { codeLanguages, type CodeLanguage } from "@/components/code-languages";

export const codeLanguageStorageKey = "vinyaas-code-language";

type CodeLanguageState = {
  value: CodeLanguage;
};

const codeLanguageSlice = createSlice({
  name: "codeLanguage",
  initialState: { value: "tsx" } as CodeLanguageState,
  reducers: {
    setCodeLanguage(state, action: PayloadAction<CodeLanguage>) {
      state.value = action.payload;
    },
  },
});

export const { setCodeLanguage } = codeLanguageSlice.actions;

export const store = configureStore({
  reducer: {
    codeLanguage: codeLanguageSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function useCodeLanguage() {
  return useSyncExternalStore(
    store.subscribe,
    () => store.getState().codeLanguage.value,
    () => "tsx" as CodeLanguage,
  );
}

export function useSetCodeLanguage() {
  return (language: CodeLanguage) => {
    store.dispatch(setCodeLanguage(language));

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(codeLanguageStorageKey, language);
    }
  };
}

export function isCodeLanguage(value: string | null): value is CodeLanguage {
  return codeLanguages.some((language) => language === value);
}

function CodeLanguageHydrator() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = window.sessionStorage.getItem(codeLanguageStorageKey);

      if (isCodeLanguage(stored)) {
        dispatch(setCodeLanguage(stored));
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [dispatch]);

  return null;
}

export function CodeLanguageProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <CodeLanguageHydrator />
      {children}
    </Provider>
  );
}
