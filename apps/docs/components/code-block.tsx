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
import { tsxToJsx } from "@/components/tsx-to-jsx";
import { useCodeLanguage, useSetCodeLanguage } from "@/lib/store/hooks";
import { Button } from "@/registry/new-york/ui/button";

const collapseAfterLines = 16;

export type CodeSource = Partial<Record<CodeLanguage, string>>;

/**
 * Renders a code sample.
 * TSX/JSX strings and dual sources follow the shared Redux language.
 * Bash, JSON, CSS, and other languages stay fixed: no language switch.
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
  const dual = expandSwitchableSource(code, language, source);

  if (dual) {
    return (
      <SwitchableCodeBlock
        source={dual}
        choices={[...codeLanguages]}
        attached={attached}
        leading={leading}
      />
    );
  }

  const choices = sourceLanguages(source);
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

/**
 * Every TSX/JSX example becomes a dual source so Redux can switch presentation.
 * Non-TSX/JSX languages return null and stay fixed.
 */
function expandSwitchableSource(
  code: string | undefined,
  language: string | undefined,
  source: CodeSource | undefined,
): Record<CodeLanguage, string> | null {
  if (source?.tsx !== undefined && source.jsx !== undefined) {
    return { tsx: source.tsx, jsx: source.jsx };
  }

  if (source?.tsx !== undefined) {
    return { tsx: source.tsx, jsx: tsxToJsx(source.tsx) };
  }

  if (source?.jsx !== undefined) {
    return { tsx: source.jsx, jsx: source.jsx };
  }

  if (code !== undefined && isSourceLanguage(language)) {
    if (language === "tsx") {
      return { tsx: code, jsx: tsxToJsx(code) };
    }

    return { tsx: code, jsx: code };
  }

  return null;
}

function SwitchableCodeBlock({
  source,
  choices,
  attached,
  leading,
}: {
  source: Record<CodeLanguage, string>;
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
      code={source[selected]}
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
                : `text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md px-2 py-1 text-xs ${focusRing}`
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

/** Collapsed peek height; expanded code scrolls inside this max. */
const collapsedMaxClass = "max-h-44";
const expandedMaxClass = "max-h-80";

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
          ? "border-border bg-card/70 text-card-foreground overflow-hidden border-t shadow-[inset_0_-12px_24px_-18px_oklch(0_0_0/0.35)]"
          : "border-border bg-card/70 text-card-foreground overflow-hidden rounded-md border shadow-[inset_0_-12px_24px_-18px_oklch(0_0_0/0.35)]"
      }
    >
      <div className="border-border bg-muted/40 flex items-center justify-between gap-3 border-b px-3 py-1.5">
        {leading ? (
          leading
        ) : language ? (
          <span className="text-muted-foreground font-mono text-xs">
            {language}
          </span>
        ) : (
          <span />
        )}
        <CopyButton value={code} />
      </div>
      <div
        data-code-panel={
          collapsed ? "collapsed" : expanded ? "expanded" : "open"
        }
        className={
          collapsed
            ? "bg-card/50 relative"
            : expanded
              ? "bg-card/80 relative"
              : "bg-card relative"
        }
      >
        <pre
          tabIndex={expanded ? 0 : undefined}
          className={
            collapsed
              ? `m-0 ${collapsedMaxClass} overflow-hidden font-mono text-[13px] leading-6`
              : expanded
                ? numbered
                  ? `m-0 ${expandedMaxClass} overflow-auto font-mono text-[13px] leading-6`
                  : `m-0 ${expandedMaxClass} overflow-auto px-0 py-4 font-mono text-[13px] leading-6`
                : numbered
                  ? "m-0 overflow-x-auto font-mono text-[13px] leading-6"
                  : "m-0 overflow-x-auto px-0 py-4 font-mono text-[13px] leading-6"
          }
        >
          {numbered ? (
            <NumberedSource code={code} language={language} />
          ) : (
            <code data-language={language} className="block px-5 font-mono">
              {highlightCode(code, language) ?? code}
            </code>
          )}
        </pre>
        {collapsed ? (
          <div
            data-code-fade
            className="from-background/90 via-background/45 pointer-events-none absolute inset-x-0 bottom-0 flex h-28 items-end justify-center bg-gradient-to-t to-transparent pb-3 shadow-[0_10px_24px_-12px_oklch(0_0_0/0.45)]"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={false}
              aria-label="View full code example"
              className="bg-background/90 pointer-events-auto shadow-sm"
              onClick={() => setExpanded(true)}
            >
              View code
            </Button>
          </div>
        ) : null}
        {expanded ? (
          <div
            aria-hidden="true"
            data-code-fade="expanded"
            className="from-background/70 pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent"
          />
        ) : null}
      </div>
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
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div className="flex min-w-full items-stretch">
      <div
        data-line-numbers
        aria-hidden="true"
        className="text-muted-foreground border-border bg-muted sticky left-0 shrink-0 self-stretch border-r py-0 pr-2 pl-3 text-right tabular-nums select-none"
      >
        {lines.map((_, index) => (
          <div key={index} className="h-6 leading-6">
            {index + 1}
          </div>
        ))}
      </div>
      <code
        data-language={language}
        className="block min-w-max flex-1 pr-3 pl-3 font-mono whitespace-pre"
      >
        {highlightCode(code.replace(/\n$/, ""), language) ??
          code.replace(/\n$/, "")}
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
