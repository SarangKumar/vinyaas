"use client";

import { useEffect, useState } from "react";

import {
  codeLanguages,
  isCodeLanguage,
  type CodeLanguage,
} from "@/components/code-languages";
import { focusRing } from "@/components/focus-ring";

const storageKey = "vinyaas-code-language";
const changeEvent = "vinyaas-code-language-change";

export function rememberCodeLanguage(language: CodeLanguage) {
  window.sessionStorage.setItem(storageKey, language);
  window.dispatchEvent(new CustomEvent(changeEvent, { detail: language }));
}

export function useCodeLanguage() {
  const [language, setLanguage] = useState<CodeLanguage>("tsx");

  useEffect(() => {
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;

      if (isCodeLanguage(detail)) {
        setLanguage(detail);
      }
    };

    window.addEventListener(changeEvent, onChange);
    const timeout = window.setTimeout(() => {
      const stored = window.sessionStorage.getItem(storageKey);

      if (isCodeLanguage(stored)) {
        setLanguage(stored);
      }
    }, 0);

    return () => {
      window.removeEventListener(changeEvent, onChange);
      window.clearTimeout(timeout);
    };
  }, []);

  return language;
}

export function CodeLanguageSelect() {
  const language = useCodeLanguage();

  return (
    <select
      aria-label="Code language"
      className={`border-border bg-background text-foreground h-8 cursor-pointer rounded-md border px-2 text-xs ${focusRing}`}
      value={language}
      onChange={(event) => {
        if (isCodeLanguage(event.target.value)) {
          rememberCodeLanguage(event.target.value);
        }
      }}
    >
      {codeLanguages.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
