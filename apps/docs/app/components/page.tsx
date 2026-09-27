import Link from "next/link";

import {
  componentHref,
  components,
  newComponents,
  type ComponentMeta,
} from "@/components/component-meta";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import { NewIndicator } from "@/components/new-indicator";

const heading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

const gridClass = "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3";

export default function ComponentsPage() {
  const recent = newComponents();

  return (
    <DocsArticle
      title="Components"
      description="Accessible primitives you install into your project as source."
    >
      <section className="flex flex-col gap-4">
        <h2 id="overview" className={heading}>
          Overview
        </h2>
        <div className="text-body flex flex-col gap-3 text-base leading-7">
          <p>
            Vinyaas components are accessible UI primitives. The CLI copies each
            one into your repository, so the source stays yours. Styles use
            Tailwind utilities and follow your theme tokens. There is no runtime
            package to upgrade.
          </p>
          <p>
            Components are meant to be composed. A label names an input. A radio
            group holds its options. You keep the markup.
          </p>
        </div>
      </section>
      {recent.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 id="new-components" className={heading}>
            New Components
          </h2>
          <p className="text-body text-base leading-7">
            Components added in the current docs pass.
          </p>
          <ComponentGrid items={recent} />
        </section>
      ) : null}
      <section className="flex flex-col gap-4">
        <h2 id="all-components" className={heading}>
          All Components
        </h2>
        <p className="text-body text-base leading-7">
          The full catalog, in alphabetical order. Install one at a time with{" "}
          <code>vinyaas add</code>.
        </p>
        <ComponentGrid items={components} />
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="using-components" className={heading}>
          Using Components
        </h2>
        <p className="text-body text-base leading-7">
          Run <code>vinyaas init</code>, then add the component you need. The
          files land in your project. Edit them there. Semantic color utilities
          such as <code>bg-background</code> and <code>text-foreground</code>{" "}
          follow the theme variables in your stylesheet.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="whats-next" className={heading}>
          What&apos;s Next
        </h2>
        <p className="text-body text-base leading-7">
          The introduction lives at <code>/introduction</code>. The homepage is
          reserved for a later showcase of components, combinations, and
          reusable blocks. That showcase is not part of this page.
        </p>
      </section>
    </DocsArticle>
  );
}

function ComponentGrid({ items }: { items: readonly ComponentMeta[] }) {
  return (
    <ul className={gridClass}>
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={componentHref(item.slug)}
            className={`border-border hover:bg-muted flex h-full cursor-pointer flex-col gap-1 rounded-md border px-3 py-3 no-underline ${focusRing}`}
          >
            <span className="text-foreground flex items-center text-sm font-medium">
              {item.name}
              {item.isNew ? <NewIndicator /> : null}
            </span>
            <span className="text-muted-foreground text-sm leading-6">
              {item.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
