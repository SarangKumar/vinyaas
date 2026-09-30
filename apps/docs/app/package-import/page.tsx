import type { Metadata } from "next";
import Link from "next/link";

import { DocsArticle } from "@/components/docs-article";
import { CodeBlock } from "@/components/code-block";
import { focusRing } from "@/components/focus-ring";
import { componentsJsonPath, installationPath } from "@/components/docs-nav";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Package Import",
  description:
    "How to import Vinyaas components after install using project aliases and local source paths.",
  path: "/package-import",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

const importExample = {
  tsx: `import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Actions() {
  return (
    <Card>
      <Button>Save</Button>
    </Card>
  );
}
`,
  jsx: `import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Actions() {
  return (
    <Card>
      <Button>Save</Button>
    </Card>
  );
}
`,
};

export default function PackageImportPage() {
  return (
    <DocsArticle
      title="Package Import"
      description="Vinyaas components are source in your repository. Import them like any other local module — not from an npm UI package."
    >
      <section className="flex flex-col gap-4">
        <h2 id="source" className={sectionHeading}>
          Source you own
        </h2>
        <p className={body}>
          After{" "}
          <Link
            href={installationPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Installation
          </Link>
          , <code>vinyaas add</code> writes files under{" "}
          <code className="font-mono">components/ui/&lt;name&gt;/</code>. The{" "}
          <code>vinyaas</code> npm package is the CLI only. UI lives in your
          project.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="aliases" className={sectionHeading}>
          Aliases
        </h2>
        <p className={body}>
          Imports use the aliases from{" "}
          <Link
            href={componentsJsonPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            components.json
          </Link>
          , typically <code>@/components/ui</code>. Keep the same paths in{" "}
          <code>tsconfig.json</code> / <code>jsconfig.json</code> so TypeScript
          and the bundler resolve them.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="import" className={sectionHeading}>
          Import path
        </h2>
        <p className={body}>
          Import the component directory (its <code>index</code> file):
        </p>
        <CodeBlock source={importExample} />
        <p className={body}>Default layout after add:</p>
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>{`components/ui/button/index.tsx
components/ui/toast/index.tsx
components/ui/toast/toast.css`}</code>
        </pre>
      </section>
    </DocsArticle>
  );
}
