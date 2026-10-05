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
    <div className="border-border rounded-md border">
      <div className="bg-background flex min-h-40 items-center justify-center overflow-visible px-4 py-8 text-sm sm:min-h-48 sm:px-6 sm:py-10">
        {/* Avoid min-w-0/flex-wrap so single-row controls like Pagination are not clipped */}
        <div className="flex w-full items-center justify-center overflow-visible p-1">
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
