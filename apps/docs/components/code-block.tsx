"use client";

import { useState, type ReactNode } from "react";

import { CopyButton } from "@/components/copy-button";
import { focusRing } from "@/components/focus-ring";

const collapseAfterLines = 16;

/**
 * Renders plain text. `language` is part of the API so a highlighter can be
 * added later without changing call sites.
 */

export function CodeBlock({
  code,
  language,
  attached = false,
  leading,
}: {
  code: string;
  language?: string;
  /** Drops the outer frame so a parent demo can share one border. */
  attached?: boolean;
  /** Replaces the language label. `language` still sets data-language. */
  leading?: ReactNode;
}) {
  const collapsible = code.split("\n").length > collapseAfterLines;
  const [expanded, setExpanded] = useState(false);
  const collapsed = collapsible && !expanded;

  return (
    <div
      className={
        attached
          ? "border-border bg-card text-card-foreground overflow-hidden border-t"
          : "border-border bg-card text-card-foreground overflow-hidden rounded-md border"
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
      <pre
        className={
          collapsed
            ? "max-h-72 overflow-x-auto overflow-y-hidden px-4 py-3 text-[13px] leading-6"
            : "overflow-x-auto px-4 py-3 text-[13px] leading-6"
        }
      >
        <code data-language={language}>{code}</code>
      </pre>
      {collapsible ? (
        <div className="border-border relative border-t">
          {collapsed ? (
            <div className="from-card pointer-events-none absolute inset-x-0 -top-12 h-12 bg-gradient-to-t to-transparent" />
          ) : null}
          <button
            type="button"
            aria-expanded={expanded}
            className={`text-subtle-foreground hover:text-foreground w-full cursor-pointer px-4 py-2.5 text-center text-sm ${focusRing}`}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "Hide code" : "View code"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
