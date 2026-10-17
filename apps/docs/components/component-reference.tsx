import type { ReactNode } from "react";

import { ApiTable, type ApiRow } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { ComponentDemoWithAutoControls } from "@/components/component-demo-auto";
import {
  ComponentDemo,
  type ControlDef,
  type ControlValues,
} from "@/components/component-demo";
import type { ControlOverride } from "@/components/control-schema";
import type { CodeLanguage, DemoCode } from "@/components/code-languages";
import { DocsArticle } from "@/components/docs-article";
import {
  docsBodyClassName,
  docsMutedBodyClassName,
} from "@/components/docs-prose";
import { InstallCommand } from "@/components/install-command";
import { InstallTabs } from "@/components/install-tabs";
import { cliCommands } from "@/components/package-managers";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

/** "User Cursor" → "UserCursor", "Data Table" → "DataTable" */
function tagFromTitle(title: string): string {
  return title
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}
const subsectionHeading =
  "text-foreground scroll-mt-8 text-base font-semibold tracking-tight";
export type ComponentExample = {
  id: string;
  title: string;
  description: string;
  preview: ReactNode | ((values: ControlValues) => ReactNode);
  code: DemoCode | ((values: ControlValues) => DemoCode);
  language?: CodeLanguage;
  controls?: ControlDef[];
};

/** Realistic multi-component composition shown immediately before API. */
export type ComponentInPractice = {
  description: string;
  preview: ReactNode | ((values: ControlValues) => ReactNode);
  code: DemoCode | ((values: ControlValues) => DemoCode);
  language?: CodeLanguage;
  controls?: ControlDef[];
};

/**
 * Shared layout for a component documentation page.
 *
 * Order: Preview → Installation → Usage → Examples → In practice → API →
 * Accessibility. Optional sections stay out when unused.
 *
 * Installation is a CLI/Manual toggle group: the CLI tab holds the `vinyaas
 * add` command, the Manual tab holds the dependency and placement notes plus
 * the component source, so the source is no longer a trailing section.
 */
export function ComponentReference({
  title,
  description,
  overview,
  install,
  manual,
  usage,
  examples,
  examplesSlot,
  previewSection,
  livePreview: LivePreview,
  controlOverrides,
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
  /**
   * Manual-installation notes: which npm packages and registry items the
   * component needs and where its files belong. Rendered above the source in
   * the Manual tab.
   */
  manual?: ReactNode;
  usage: string;
  examples?: ComponentExample[];
  /** Rendered in the Examples section in place of generated example cards. */
  examplesSlot?: ReactNode;
  /**
   * Replaces the entire Preview section content. Useful when the demo needs
   * its own bespoke setup (e.g. Beam's interactive example).
   */
  previewSection?: ReactNode;
  /**
   * A `"use client"` component that receives `{ values: ControlValues }` and
   * renders the component with the current control values. When provided,
   * `ComponentDemoWithAutoControls` derives the controls from `api` and
   * updates both the preview and Code tab in real time.
   */
  livePreview?: React.ComponentType<{ values: ControlValues }>;
  /**
   * Per-prop tuning forwarded to `controlsFromApi`, e.g. turning a CSS-variable
   * string into a color picker. Only needed when the type string is not enough.
   */
  controlOverrides?: Record<string, ControlOverride>;
  inPractice?: ComponentInPractice;
  api?: ApiRow[];
  accessibility?: ReactNode;
  source: string;
  /** Static preview shown when neither `previewSection` nor `livePreview` is provided. */
  children?: ReactNode;
}) {
  return (
    <DocsArticle
      title={title}
      description={description}
      breadcrumbs={[
        { label: "Components", href: "/components" },
        { label: title },
      ]}
    >
      {overview ? (
        <section className="flex flex-col gap-4">
          <h2 id="overview" className={sectionHeading}>
            Overview
          </h2>
          <div className={`${docsBodyClassName} flex flex-col gap-3`}>
            {overview}
          </div>
        </section>
      ) : null}
      <section className="flex flex-col gap-4">
        <h2 id="preview" className={sectionHeading}>
          Preview
        </h2>
        {previewSection ?? (
          <ComponentDemoWithAutoControls
            api={api ?? []}
            usage={usage}
            componentTag={tagFromTitle(title)}
            LivePreview={LivePreview}
            controlOverrides={controlOverrides}
          >
            {children}
          </ComponentDemoWithAutoControls>
        )}
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="installation" className={sectionHeading}>
          Installation
        </h2>
        <InstallTabs
          cli={
            <>
              <p className={docsMutedBodyClassName}>
                Add the component with the CLI. It copies the files in and
                installs anything they depend on.
              </p>
              <InstallCommand
                commands={cliCommands(install.replace(/^vinyaas\s+/, ""))}
              />
            </>
          }
          manual={
            <>
              {manual ? (
                <div className={`${docsBodyClassName} flex flex-col gap-3`}>
                  {manual}
                </div>
              ) : null}
              <p className={docsMutedBodyClassName}>
                Copy and paste the following code into your project.
              </p>
              <CodeBlock code={source} language="tsx" />
            </>
          }
        />
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="usage" className={sectionHeading}>
          Usage
        </h2>
        <CodeBlock code={usage} language="tsx" />
      </section>
      {examplesSlot ? (
        <section className="flex flex-col gap-10">
          <h2 id="examples" className={sectionHeading}>
            Examples
          </h2>
          {examplesSlot}
        </section>
      ) : examples && examples.length > 0 ? (
        <section className="flex flex-col gap-10">
          <h2 id="examples" className={sectionHeading}>
            Examples
          </h2>
          {examples.map((example) => (
            <div key={example.id} className="flex flex-col gap-3">
              <h3 id={example.id} className={subsectionHeading}>
                {example.title}
              </h3>
              <p className={docsMutedBodyClassName}>{example.description}</p>
              <ComponentDemo
                preview={example.preview}
                code={example.code}
                language={example.language}
                controls={example.controls}
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
          <p className={docsMutedBodyClassName}>{inPractice.description}</p>
          <ComponentDemo
            preview={inPractice.preview}
            code={inPractice.code}
            language={inPractice.language}
            controls={inPractice.controls}
          />
        </section>
      ) : null}
      {api && api.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 id="api" className={sectionHeading}>
            API
          </h2>
          <p className={docsBodyClassName}>
            Other attributes for the underlying element are passed through.
          </p>
          <ApiTable rows={api} />
        </section>
      ) : null}
      {accessibility ? (
        <section className={`${docsBodyClassName} flex flex-col gap-4`}>
          <h2 id="accessibility" className={sectionHeading}>
            Accessibility
          </h2>
          {accessibility}
        </section>
      ) : null}
    </DocsArticle>
  );
}
