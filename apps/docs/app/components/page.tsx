import type { Metadata } from "next";
import Link from "next/link";

import {
  componentHref,
  components,
  currentVersion,
  isNewComponent,
  newComponents,
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
  const newlyIntroduced = newComponents();

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
      {newlyIntroduced.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 id="new-components" className={heading}>
            New Components
          </h2>
          <p className="text-muted-foreground text-sm leading-6">
            Introduced in v{currentVersion}. Sidebar links for these components
            show a subtle new indicator.
          </p>
          <ul className="flex flex-col gap-3">
            {newlyIntroduced.map((item) => (
              <li key={item.slug}>
                <Link
                  href={componentHref(item.slug)}
                  className={`border-border hover:bg-muted flex flex-col gap-1 rounded-md border px-3 py-3 no-underline ${focusRing}`}
                >
                  <span className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                    {item.name}
                    <span
                      data-nav-indicator="new"
                      className="bg-foreground/70 size-1.5 shrink-0 rounded-full"
                      aria-label="New"
                    />
                    <span className="text-muted-foreground text-xs font-normal">
                      v{item.introducedIn}
                    </span>
                  </span>
                  <span className="text-muted-foreground text-sm leading-6">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
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
            className={`text-foreground hover:bg-muted flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm no-underline ${focusRing}`}
          >
            <span className="min-w-0 truncate">{item.name}</span>
            {isNewComponent(item) ? (
              <span
                data-nav-indicator="new"
                className="bg-foreground/70 size-1.5 shrink-0 rounded-full"
                aria-label="New"
              />
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
