"use client";

import { useState, type ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { focusRing } from "@/components/focus-ring";
import {
  codeLanguageLabel,
  codeLanguages,
  resolveDemoCode,
  type CodeLanguage,
  type DemoCode,
} from "@/components/code-languages";

/**
 * One preview and its complete source. `data-language` on the code element is
 * the hook a highlighter can use later without changing this API.
 * TSX and JSX are chosen here when both sources exist. CodeBlock only renders.
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
  const [selected, setSelected] = useState<CodeLanguage>(
    choices.includes(language) ? language : (choices[0] ?? language),
  );
  const resolved = resolveDemoCode(
    code,
    language,
    choices.length > 1 ? selected : (choices[0] ?? language),
  );

  return (
    <div className="border-border overflow-hidden rounded-md border">
      <div className="bg-background flex min-h-32 items-center justify-center px-6 py-8">
        <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-3">
          {preview}
        </div>
      </div>
      <CodeBlock
        attached
        code={resolved.code}
        language={resolved.language}
        leading={
          choices.length > 1 ? (
            <div
              role="group"
              aria-label="Component example language"
              className="flex items-center gap-0.5"
            >
              {choices.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected === item}
                  className={`cursor-pointer rounded-sm px-1.5 py-0.5 font-mono text-xs ${
                    selected === item
                      ? "text-foreground"
                      : "text-subtle-foreground hover:text-foreground"
                  } ${focusRing}`}
                  onClick={() => setSelected(item)}
                >
                  {codeLanguageLabel(item)}
                </button>
              ))}
            </div>
          ) : undefined
        }
      />
    </div>
  );
}

function demoLanguages(code: DemoCode): CodeLanguage[] {
  if (typeof code === "string") {
    return [];
  }

  return codeLanguages.filter((item) => Boolean(code[item]));
}
