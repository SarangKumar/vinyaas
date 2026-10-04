import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import { cliPath, componentsPath } from "@/components/docs-nav";
import { pageMetadata } from "@/lib/page-metadata";
import { componentCatalogs, plannedCatalogGaps } from "@/registry/catalogs";

export const metadata: Metadata = pageMetadata({
  title: "Catalogs",
  description:
    "Named Vinyaas component catalogs owned by the registry for CLI and docs discovery.",
  path: "/catalogs",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export default function CatalogsPage() {
  return (
    <DocsArticle
      title="Catalogs"
      description="Registry-owned groups of installable component IDs. Catalogs are not packages and do not invent missing components."
    >
      <section className="flex flex-col gap-4">
        <h2 id="overview" className={sectionHeading}>
          Overview
        </h2>
        <p className={body}>
          Catalogs live in the registry source and are published to{" "}
          <code>/r/catalogs/</code>. The CLI and docs both consume that payload.
          Membership is a list of registry component IDs — component metadata is
          not duplicated. See the{" "}
          <Link
            href={cliPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            CLI guide
          </Link>{" "}
          for install commands and the{" "}
          <Link
            href={componentsPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            components index
          </Link>{" "}
          for the full installable set.
        </p>
        <CodeBlock language="bash" code="vinyaas catalog list" />
        <CodeBlock language="bash" code="vinyaas catalog info form" />
        <CodeBlock language="bash" code="vinyaas add form" />
        <CodeBlock language="bash" code="vinyaas add dashboard --dry-run" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="available" className={sectionHeading}>
          Available catalogs
        </h2>
        {componentCatalogs.map((catalog) => (
          <div key={catalog.id} className="flex flex-col gap-2">
            <h3
              id={catalog.id}
              className="text-foreground scroll-mt-8 text-base font-semibold"
            >
              {catalog.name}{" "}
              <code className="text-muted-foreground font-mono text-sm">
                {catalog.id}
              </code>
            </h3>
            <p className={body}>{catalog.description}</p>
            <p className={`${body} text-muted-foreground`}>
              {catalog.components.length} installable components:{" "}
              {catalog.components.join(", ")}.
            </p>
            {(plannedCatalogGaps[catalog.id]?.length ?? 0) > 0 ? (
              <p className={`${body} text-muted-foreground`}>
                Planned (not yet installable):{" "}
                {plannedCatalogGaps[catalog.id]?.join(", ")}.
              </p>
            ) : null}
          </div>
        ))}
      </section>
    </DocsArticle>
  );
}
