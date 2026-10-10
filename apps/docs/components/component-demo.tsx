"use client";

import { type ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { type CodeLanguage, type DemoCode } from "@/components/code-languages";

/**
 * One preview and its source. String and dual TSX/JSX sources both follow the
 * shared docs-store preference inside CodeBlock. Bash and other languages stay fixed.
 *
 * Preview chrome centers content horizontally and vertically. Full-bleed demos
 * (tables, sidebars, forms) should set `w-full` on their root; compact widgets
 * (calendar, buttons) stay centered via `w-fit` / default shrink.
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
    <div
      className="border-border rounded-md border"
      data-companion-surface=""
      data-companion-surface-id="component-demo"
    >
      {/* Top corners follow the frame radius (minus its 1px border) so the preview fill never pokes past it. */}
      <div className="bg-background flex min-h-40 w-full items-center justify-center overflow-x-auto overflow-y-visible rounded-t-[calc(var(--radius-md)-1px)] px-4 py-8 text-sm sm:min-h-48 sm:px-6 sm:py-10">
        <div className="flex w-full max-w-full flex-col items-center justify-center overflow-visible p-1 [&_[data-demo-align=start]]:w-full [&_[data-demo-align=start]]:items-stretch [&_[data-demo-align=start]]:self-stretch">
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
