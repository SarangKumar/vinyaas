"use client";

import { type ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { type CodeLanguage, type DemoCode } from "@/components/code-languages";

/**
 * One preview and its source. TSX and JSX share the Redux preference inside
 * CodeBlock, so every eligible example switches together. A string source and
 * bash blocks stay on the language they are given.
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
  return (
    <div className="border-border overflow-hidden rounded-md border">
      <div className="bg-background flex min-h-48 items-center justify-center px-6 py-10">
        <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-3">
          {preview}
        </div>
      </div>
      {typeof code === "string" ? (
        <CodeBlock attached code={code} language={language} />
      ) : (
        <CodeBlock attached source={code} language={language} />
      )}
    </div>
  );
}
