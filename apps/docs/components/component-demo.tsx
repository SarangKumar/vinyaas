"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { focusRing } from "@/components/focus-ring";
import {
  codeLanguageLabel,
  codeLanguages,
  resolveDemoCode,
  type CodeLanguage,
  type DemoCode,
} from "@/components/code-languages";

const storageKey = "vinyaas-code-language";

/**
 * One preview and its complete source. `data-language` on the code element is
 * the hook a highlighter can use later without changing this API.
 * TSX and JSX are chosen on this demo when both sources exist. The choice is
 * stored for the next demo, and it does not update demos that are already open.
 * CodeBlock only renders the language it is given.
 */
export function ComponentDemo({
  preview,
  code,
  language = "tsx",
}: {
  preview: ReactNode;
  code: DemoCode;
  language?: CodeLanguage;
}) {
  const choices = demoLanguages(code);
  const chosen = useRef(false);
  const [selected, setSelected] = useState<CodeLanguage>(
    choices.includes(language) ? language : (choices[0] ?? language),
  );
  const resolved = resolveDemoCode(
    code,
    language,
    choices.length > 1 ? selected : (choices[0] ?? language),
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (chosen.current) {
        return;
      }

      const stored = window.sessionStorage.getItem(storageKey);

      if (isCodeLanguage(stored) && demoLanguages(code).includes(stored)) {
        setSelected(stored);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [code]);

  function choose(next: CodeLanguage) {
    chosen.current = true;
    setSelected(next);
    window.sessionStorage.setItem(storageKey, next);
  }

  return (
    <div className="border-border overflow-hidden rounded-md border">
      <div className="bg-background flex min-h-32 items-center justify-center px-6 py-8">
        <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-3">
          {preview}
        </div>
      </div>
      {choices.length > 1 ? (
        <div
          role="tablist"
          aria-label="Component example language"
          className="border-border flex flex-wrap gap-1 border-t px-3 py-2"
        >
          {choices.map((item) => {
            const active = selected === item;

            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                className={
                  active
                    ? `bg-muted text-foreground cursor-pointer rounded-md px-2 py-1 text-xs font-medium ${focusRing}`
                    : `text-subtle-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md px-2 py-1 text-xs ${focusRing}`
                }
                onClick={() => choose(item)}
              >
                {codeLanguageLabel(item)}
              </button>
            );
          })}
        </div>
      ) : null}
      <CodeBlock attached code={resolved.code} language={resolved.language} />
    </div>
  );
}

function demoLanguages(code: DemoCode): CodeLanguage[] {
  if (typeof code === "string") {
    return [];
  }

  return codeLanguages.filter((item) => Boolean(code[item]));
}

function isCodeLanguage(value: string | null): value is CodeLanguage {
  return value === "tsx" || value === "jsx";
}
