import type { Metadata } from "next";
import Link from "next/link";

import {
  componentHref,
  components,
  currentVersion,
  type ComponentMeta,
} from "@/components/component-meta";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
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
  const catalog = [...components].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <DocsArticle
      title="Components"
      description={`${components.length} accessible primitives you install into your project as source.`}
    >
      <p className="text-muted-foreground text-sm leading-6">
        The catalog has {components.length} independently installable registry
        items on v{currentVersion}. Button is the v0.1 foundation; later
        releases expanded forms, overlays, feedback, and product UI. The CLI
        copies each component into your repository. Styles use Tailwind
        utilities and follow your theme tokens.
      </p>
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
          </Link>
        </li>
      ))}
    </ul>
  );
}
