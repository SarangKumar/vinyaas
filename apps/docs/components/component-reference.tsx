import type { ReactNode } from "react";

import { ApiTable, type ApiRow } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { ComponentDemo } from "@/components/component-demo";
import type { CodeLanguage, DemoCode } from "@/components/code-languages";
import { DocsArticle } from "@/components/docs-article";
import { InstallCommand } from "@/components/install-command";
import { cliCommands } from "@/components/package-managers";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const subsectionHeading =
  "text-foreground scroll-mt-8 text-base font-semibold tracking-tight";

export type ComponentExample = {
  id: string;
  title: string;
  description: string;
  preview: ReactNode;
  code: DemoCode;
  language?: CodeLanguage;
};

/** Realistic multi-component composition shown immediately before API. */
export type ComponentInPractice = {
  description: string;
  preview: ReactNode;
  code: DemoCode;
  language?: CodeLanguage;
};

/**
 * Shared layout for a component documentation page.
 *
 * Order: Preview → Installation → Usage → Examples → In practice → API →
 * Accessibility → Source. Optional sections stay out when unused.
 */
export function ComponentReference({
  title,
  description,
  overview,
  install,
  manual,
  usage,
  examples,
  inPractice,
  api,
  accessibility,
  source,
  children,
}: {
  title: string;
  description: string;
  overview?: ReactNode;
  install: string;
  manual?: ReactNode;
  usage: string;
  examples?: ComponentExample[];
  inPractice?: ComponentInPractice;
  api?: ApiRow[];
  accessibility?: ReactNode;
  source: string;
  children: ReactNode;
}) {
  return (
    <DocsArticle title={title} description={description}>
      {overview ? (
        <section className="flex flex-col gap-4">
          <h2 id="overview" className={sectionHeading}>
            Overview
          </h2>
          <div className="text-foreground flex flex-col gap-3 text-sm leading-6">
            {overview}
          </div>
        </section>
      ) : null}
      <section className="flex flex-col gap-4">
        <h2 id="preview" className={sectionHeading}>
          Preview
        </h2>
        <ComponentDemo preview={children} code={usage} />
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="installation" className={sectionHeading}>
          Installation
        </h2>
        <div className="flex flex-col gap-3">
          <h3 id="cli" className={subsectionHeading}>
            CLI
          </h3>
          <InstallCommand
            commands={cliCommands(install.replace(/^vinyaas\s+/, ""))}
          />
        </div>
        {manual ? (
          <div className="text-foreground flex flex-col gap-3 text-sm leading-6">
            <h3 id="manual" className={subsectionHeading}>
              Manual
            </h3>
            {manual}
          </div>
        ) : null}
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="usage" className={sectionHeading}>
          Usage
        </h2>
        <CodeBlock code={usage} language="tsx" />
      </section>
      {examples && examples.length > 0 ? (
        <section className="flex flex-col gap-10">
          <h2 id="examples" className={sectionHeading}>
            Examples
          </h2>
          {examples.map((example) => (
            <div key={example.id} className="flex flex-col gap-3">
              <h3 id={example.id} className={subsectionHeading}>
                {example.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-6">
                {example.description}
              </p>
              <ComponentDemo
                preview={example.preview}
                code={example.code}
                language={example.language}
              />
            </div>
          ))}
        </section>
      ) : null}
      {inPractice ? (
        <section className="flex flex-col gap-4">
          <h2 id="in-practice" className={sectionHeading}>
            In practice
          </h2>
          <p className="text-muted-foreground text-sm leading-6">
            {inPractice.description}
          </p>
          <ComponentDemo
            preview={inPractice.preview}
            code={inPractice.code}
            language={inPractice.language}
          />
        </section>
      ) : null}
      {api && api.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 id="api" className={sectionHeading}>
            API
          </h2>
          <p className="text-foreground text-sm leading-6">
            Other attributes for the underlying element are passed through.
          </p>
          <ApiTable rows={api} />
        </section>
      ) : null}
      {accessibility ? (
        <section className="text-foreground flex flex-col gap-4 text-sm leading-6">
          <h2 id="accessibility" className={sectionHeading}>
            Accessibility
          </h2>
          {accessibility}
        </section>
      ) : null}
      <section className="flex flex-col gap-4">
        <h2 id="source" className={sectionHeading}>
          Source
        </h2>
        <CodeBlock code={source} language="tsx" />
      </section>
    </DocsArticle>
  );
}
