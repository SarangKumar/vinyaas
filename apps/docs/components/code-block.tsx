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
    <div className="border-border bg-card text-card-foreground relative rounded-md border">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton value={code} />
      </div>
      {language ? <span className="sr-only">{language}</span> : null}
      <pre
        className={
          collapsed
            ? "max-h-72 overflow-hidden px-4 py-3 pr-12 text-[13px] leading-6"
            : "overflow-x-auto px-4 py-3 pr-12 text-[13px] leading-6"
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
            className={`text-muted-foreground hover:text-foreground w-full cursor-pointer px-4 py-2 text-center text-sm ${focusRing}`}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "Hide code" : "View code"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
