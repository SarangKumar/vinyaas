"use client";

import { type ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { type CodeLanguage, type DemoCode } from "@/components/code-languages";

/**
 * One preview and its source. String and dual TSX/JSX sources both follow the
 * shared Redux preference inside CodeBlock. Bash and other languages stay fixed.
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
      <div className="bg-background flex min-h-40 items-center justify-center px-4 py-8 text-sm sm:min-h-48 sm:px-6 sm:py-10">
        <div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-center gap-3 overflow-x-auto">
          {preview}
        </div>
      </div>
      {typeof code === "string" ? (
        <CodeBlock attached code={code} language={language} />
      ) : (
        <CodeBlock attached source={code} />
      )}
    </div>
  );
}
