import { DocsArticle } from "@/components/docs-article";
import { CodeBlock } from "@/components/code-block";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

const example = `{
  "$schema": "https://vinyaas.vercel.app/schema/registry-item.json",
  "style": "new-york",
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  }
}
`;

export default function ComponentsJsonPage() {
  return (
    <DocsArticle
      title="components.json"
      description="The local config file that tells the CLI where to put installed source."
    >
      <section className="flex flex-col gap-4">
        <h2 id="what-it-is" className={sectionHeading}>
          What it is
        </h2>
        <p className="text-body text-base leading-7">
          <code>components.json</code> lives in the consumer project, not in the
          Vinyaas registry. It records the style name, whether the project uses
          TypeScript, which Tailwind stylesheet to expect, and the path aliases
          the installed files import.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="why" className={sectionHeading}>
          Why it exists
        </h2>
        <p className="text-body text-base leading-7">
          Installed components import <code>cn</code> from{" "}
          <code>@/lib/utils</code> and sit under <code>components/ui</code>. The
          CLI reads <code>components.json</code> so those paths match the
          project instead of a fixed template.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="fields" className={sectionHeading}>
          Fields
        </h2>
        <ul className="text-body list-disc space-y-2 pl-5 text-base leading-7">
          <li>
            <code>$schema</code> — optional JSON Schema URL for editor
            validation.
          </li>
          <li>
            <code>style</code> — the registry style to request. Vinyaas ships{" "}
            <code>new-york</code>.
          </li>
          <li>
            <code>tsx</code> — whether installed files use TypeScript.
          </li>
          <li>
            <code>tailwind</code> — CSS entry path and related Tailwind
            settings. The CLI does not write theme CSS into that file today.
          </li>
          <li>
            <code>aliases</code> — import aliases for components, utils, ui, and
            lib.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="example" className={sectionHeading}>
          Example
        </h2>
        <p className="text-body text-base leading-7">
          A realistic Next.js app config:
        </p>
        <CodeBlock
          code={example.trim()}
          leading={
            <span className="text-subtle-foreground font-mono text-xs">
              json
            </span>
          }
        />
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="registry" className={sectionHeading}>
          Registry vs components.json
        </h2>
        <p className="text-body text-base leading-7">
          The registry publishes one JSON item per component. That item is the
          source of truth for the component file and its npm dependencies.{" "}
          <code>components.json</code> is local project configuration. It does
          not list every component and it is not published with the registry.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="init" className={sectionHeading}>
          How init uses it
        </h2>
        <p className="text-body text-base leading-7">
          <code>vinyaas init</code> creates <code>components.json</code> when
          the file is missing. A later init does not overwrite an existing file.{" "}
          <code>vinyaas add</code> reads the aliases and style from that file.
          Future init improvements may write more defaults, but they will keep
          the same local-config role.
        </p>
      </section>
    </DocsArticle>
  );
}
