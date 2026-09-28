"use client";

import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import type { CodeLanguage } from "@/components/code-languages";
import {
  isCodeLanguage,
  setCodeLanguage,
} from "@/lib/store/slices/code-language";
import type { AppDispatch, RootState } from "@/lib/store/store";

export const codeLanguageStorageKey = "vinyaas-code-language";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useCodeLanguage() {
  return useAppSelector((state) => state.codeLanguage.value);
}

export function useSetCodeLanguage() {
  const dispatch = useAppDispatch();

  return (language: CodeLanguage) => {
    dispatch(setCodeLanguage(language));
    window.sessionStorage.setItem(codeLanguageStorageKey, language);
  };
}

export function readStoredCodeLanguage(): CodeLanguage | null {
  const stored = window.sessionStorage.getItem(codeLanguageStorageKey);

  return isCodeLanguage(stored) ? stored : null;
}
