"use client";

import { useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { focusRing } from "@/components/focus-ring";

const collapseAfterLines = 16;

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const collapsible = code.split("\n").length > collapseAfterLines;
  const [expanded, setExpanded] = useState(false);
  const collapsed = collapsible && !expanded;

  return (
    <div className="border-border bg-card text-card-foreground overflow-hidden rounded-md border">
      <div className="border-border flex items-center justify-between gap-3 border-b px-3 py-1.5">
        {language ? (
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
        <code>{code}</code>
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
