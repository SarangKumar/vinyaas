import Link from "next/link";

import {
  componentHref,
  componentIsNew,
  components,
} from "@/components/component-meta";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import { ComponentIcon } from "@/components/icons";
import { NewIndicator } from "@/components/new-indicator";

const heading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function ComponentsPage() {
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
      <section className="flex flex-col gap-4">
        <h2 id="all-components" className={heading}>
          All Components
        </h2>
        <p className="text-body text-base leading-7">
          The full catalog, in alphabetical order. Install one at a time with{" "}
          <code>vinyaas add</code>.
        </p>
        <ul className="divide-border border-border divide-y rounded-md border">
          {components.map((item) => (
            <li key={item.slug}>
              <Link
                href={componentHref(item.slug)}
                className={`hover:bg-muted flex cursor-pointer items-start gap-3 px-3 py-3 no-underline ${focusRing}`}
              >
                <ComponentIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="text-foreground flex items-center text-sm font-medium">
                    {item.name}
                    {componentIsNew(item) ? <NewIndicator /> : null}
                  </span>
                  <span className="text-muted-foreground text-sm leading-6">
                    {item.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
    </DocsArticle>
  );
}
