"use client";

import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { useCodeLanguage } from "@/components/code-language";
import {
  resolveDemoCode,
  type CodeLanguage,
  type DemoCode,
} from "@/components/code-languages";

/**
 * One preview and its complete source. `data-language` on the code element is
 * the hook a highlighter can use later without changing this API.
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
  const preference = useCodeLanguage();
  const resolved = resolveDemoCode(code, language, preference);

  return (
    <div className="border-border overflow-hidden rounded-md border">
      <div className="bg-background flex min-h-32 items-center justify-center px-6 py-8">
        <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-3">
          {preview}
        </div>
      </div>
      <CodeBlock attached code={resolved.code} language={resolved.language} />
    </div>
  );
}
