"use client";

import { useState, type ReactNode } from "react";

import { highlightCode } from "@/components/code-highlight";
import {
  codeLanguageLabel,
  codeLanguages,
  type CodeLanguage,
} from "@/components/code-languages";
import { CopyButton } from "@/components/copy-button";
import { focusRing } from "@/components/focus-ring";
import { useCodeLanguage, useSetCodeLanguage } from "@/lib/store/hooks";
import { Button } from "@/registry/new-york/ui/button/button";

const collapseAfterLines = 16;

export type CodeSource = Partial<Record<CodeLanguage, string>>;

/**
 * Renders a code sample.
 * `source` with both TSX and JSX follows the shared Redux language.
 * `code` with `language="bash"` stays a terminal block: no language switch,
 * no line numbers.
 */
export function CodeBlock({
  code,
  language,
  source,
  attached = false,
  leading,
}: {
  code?: string;
  language?: string;
  source?: CodeSource;
  /** Drops the outer frame so a parent demo can share one border. */
  attached?: boolean;
  /** Replaces the language label. `language` still sets data-language. */
  leading?: ReactNode;
}) {
  const choices = sourceLanguages(source);

  if (choices.length > 1 && source) {
    return (
      <SwitchableCodeBlock
        source={source}
        choices={choices}
        attached={attached}
        leading={leading}
      />
    );
  }

  const single = choices[0];
  const resolvedCode = single && source ? (source[single] ?? "") : (code ?? "");
  const resolvedLanguage = single ?? language;

  return (
    <CodeFrame
      code={resolvedCode}
      language={resolvedLanguage}
      numbered={isSourceLanguage(resolvedLanguage)}
      attached={attached}
      leading={leading}
    />
  );
}

function SwitchableCodeBlock({
  source,
  choices,
  attached,
  leading,
}: {
  source: CodeSource;
  choices: CodeLanguage[];
  attached: boolean;
  leading?: ReactNode;
}) {
  const preference = useCodeLanguage();
  const setLanguage = useSetCodeLanguage();
  const selected = choices.includes(preference)
    ? preference
    : (choices[0] ?? "tsx");

  return (
    <CodeFrame
      code={source[selected] ?? ""}
      language={selected}
      numbered
      attached={attached}
      leading={
        leading ?? (
          <LanguageTabs
            choices={choices}
            selected={selected}
            onSelect={setLanguage}
          />
        )
      }
    />
  );
}

function LanguageTabs({
  choices,
  selected,
  onSelect,
}: {
  choices: CodeLanguage[];
  selected: CodeLanguage;
  onSelect: (language: CodeLanguage) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Component example language"
      className="flex flex-wrap gap-1"
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
            onClick={() => onSelect(item)}
          >
            {codeLanguageLabel(item)}
          </button>
        );
      })}
    </div>
  );
}

function CodeFrame({
  code,
  language,
  numbered,
  attached,
  leading,
}: {
  code: string;
  language?: string;
  numbered: boolean;
  attached: boolean;
  leading?: ReactNode;
}) {
  const collapsible = code.split("\n").length > collapseAfterLines;
  const [expanded, setExpanded] = useState(false);
  const collapsed = collapsible && !expanded;

  return (
    <div
      className={
        attached
          ? "border-border bg-secondary text-secondary-foreground overflow-hidden border-t"
          : "border-border bg-secondary text-secondary-foreground overflow-hidden rounded-md border"
      }
    >
      <div className="border-border flex items-center justify-between gap-3 border-b px-3 py-1.5">
        {leading ? (
          leading
        ) : language ? (
          <span className="text-subtle-foreground font-mono text-xs">
            {language}
          </span>
        ) : (
          <span />
        )}
        <CopyButton value={code} />
      </div>
      <div className="relative">
        <pre
          className={
            collapsed
              ? "max-h-72 overflow-hidden py-2 text-[13px] leading-6"
              : numbered
                ? "overflow-x-auto py-2 text-[13px] leading-6"
                : "overflow-x-auto py-4 text-[13px] leading-6"
          }
        >
          {numbered ? (
            <NumberedSource code={code} language={language} />
          ) : (
            <code data-language={language} className="block px-5">
              {highlightCode(code, language) ?? code}
            </code>
          )}
        </pre>
        {collapsed ? (
          <div
            data-code-fade
            className="from-secondary absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-gradient-to-t to-transparent pb-3"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={false}
              onClick={() => setExpanded(true)}
            >
              View code
            </Button>
          </div>
        ) : null}
      </div>
      {expanded ? (
        <div className="border-border flex justify-center border-t px-4 py-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded
            onClick={() => setExpanded(false)}
          >
            Hide code
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function NumberedSource({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const lines = code.split("\n");

  return (
    <div className="flex min-w-full">
      <div
        data-line-numbers
        aria-hidden="true"
        className="text-secondary-foreground/60 border-border bg-secondary sticky left-0 shrink-0 border-r pr-2 pl-3 text-right tabular-nums select-none"
      >
        {lines.map((_, index) => (
          <div key={index} className="min-h-6 leading-6">
            {index + 1}
          </div>
        ))}
      </div>
      <code
        data-language={language}
        className="block min-w-max flex-1 pr-3 pl-3 whitespace-pre"
      >
        {highlightCode(code, language) ?? code}
      </code>
    </div>
  );
}

function sourceLanguages(source: CodeSource | undefined): CodeLanguage[] {
  if (!source) {
    return [];
  }

  return codeLanguages.filter((language) => Boolean(source[language]));
}

function isSourceLanguage(language: string | undefined) {
  return language === "tsx" || language === "jsx";
}
