import type { Metadata } from "next";
import Link from "next/link";

import {
  componentHref,
  componentIsNew,
  components,
  currentVersion,
  newComponents,
  type ComponentMeta,
} from "@/components/component-meta";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import { NewIndicator } from "@/components/new-indicator";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Components",
  description:
    "Browse the Vinyaas catalog of accessible UI primitives you install as source with the CLI.",
});

const heading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

const nameGrid =
  "grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 md:grid-cols-3";

export default function ComponentsPage() {
  const added = [...newComponents()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const catalog = [...components].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <DocsArticle
      title="Components"
      description={`${components.length} accessible primitives you install into your project as source.`}
    >
      <p className="text-muted-foreground text-sm leading-6">
        The catalog has {components.length} independently installable registry
        items. Button is the v0.1 foundation. v1.0.0 added the bulk of the
        catalog. Components marked new were introduced in v{currentVersion}. The
        CLI copies each component into your repository. Styles use Tailwind
        utilities and follow your theme tokens.
      </p>
      <section className="flex flex-col gap-4">
        <h2 id="new" className={heading}>
          New Components
        </h2>
        <p className="text-muted-foreground text-sm leading-6">
          Components introduced in the current release.
        </p>
        <NameGrid items={added} />
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="all-components" className={heading}>
          All Components
        </h2>
        <NameGrid items={catalog} />
      </section>
    </DocsArticle>
  );
}

function NameGrid({ items }: { items: readonly ComponentMeta[] }) {
  return (
    <ul className={nameGrid}>
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={componentHref(item.slug)}
            className={`text-foreground hover:bg-muted flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm no-underline ${focusRing}`}
          >
            {item.name}
            {componentIsNew(item) ? <NewIndicator /> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
