import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { ComponentPreview } from "@/components/component-preview";
import { DocsArticle } from "@/components/docs-article";
import { InstallCommand } from "@/components/install-command";

/**
 * Shared layout for a component documentation page.
 * Live examples are children. Installation, usage, and source are text.
 */
export function ComponentReference({
  title,
  description,
  install,
  usage,
  source,
  children,
}: {
  title: string;
  description: string;
  install: string;
  usage: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <DocsArticle title={title} description={description}>
      <section className="flex flex-col gap-3">
        <h2
          id="preview"
          className="scroll-mt-8 text-lg font-semibold tracking-tight"
        >
          Preview
        </h2>
        <ComponentPreview>{children}</ComponentPreview>
      </section>
      <section className="flex flex-col gap-3">
        <h2
          id="installation"
          className="scroll-mt-8 text-lg font-semibold tracking-tight"
        >
          Installation
        </h2>
        <InstallCommand command={install} />
      </section>
      <section className="flex flex-col gap-3">
        <h2
          id="usage"
          className="scroll-mt-8 text-lg font-semibold tracking-tight"
        >
          Usage
        </h2>
        <CodeBlock code={usage} language="tsx" />
      </section>
      <section className="flex flex-col gap-3">
        <h2
          id="source"
          className="scroll-mt-8 text-lg font-semibold tracking-tight"
        >
          Source
        </h2>
        <CodeBlock code={source} language="tsx" />
      </section>
    </DocsArticle>
  );
}
