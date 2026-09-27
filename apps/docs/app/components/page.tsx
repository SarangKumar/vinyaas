import Link from "next/link";

import { docsNav } from "@/components/docs-nav";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import { NewIndicator } from "@/components/new-indicator";

const heading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function ComponentsPage() {
  const components =
    docsNav.find((group) => group.title === "Components")?.items ?? [];

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
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 id="available-components" className={heading}>
            Available Components
          </h2>
          <p className="text-body text-base leading-7">
            These are the primitives you can install today. Each name links to
            its documentation.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3
            id="forms"
            className="text-foreground scroll-mt-8 text-base font-medium tracking-tight"
          >
            Forms
          </h3>
          <p className="text-body text-base leading-7">
            Buttons and form controls. Install one at a time with{" "}
            <code>vinyaas add</code>.
          </p>
          <ul className="flex flex-col">
            {components.map((item) => {
              const id = item.href.split("/").pop() ?? item.title;

              return (
                <li key={item.href} className="border-border border-b">
                  <Link
                    href={item.href}
                    aria-label={item.isNew ? `${item.title}, new` : undefined}
                    className={`hover:bg-muted flex cursor-pointer flex-col gap-1 rounded-md px-2 py-4 no-underline ${focusRing}`}
                  >
                    <span className="flex items-center">
                      <h3
                        id={id}
                        className="text-foreground scroll-mt-8 text-sm font-medium"
                      >
                        {item.title}
                      </h3>
                      {item.isNew ? <NewIndicator /> : null}
                    </span>
                    {item.description ? (
                      <p className="text-muted-foreground text-sm leading-6">
                        {item.description}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="using-components" className={heading}>
          Using Components
        </h2>
        <div className="text-body flex flex-col gap-3 text-base leading-7">
          <p>
            Run <code>vinyaas init</code>, then add the component you need. The
            files land in your project. Edit them there. Semantic color
            utilities such as <code>bg-background</code> and{" "}
            <code>text-foreground</code> follow the theme variables in your
            stylesheet.
          </p>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="whats-next" className={heading}>
          What&apos;s Next
        </h2>
        <p className="text-body text-base leading-7">
          The introduction at the site root stays a short start page. A later
          homepage can showcase these components, combinations of them, and
          reusable blocks. That catalog is not part of this page.
        </p>
      </section>
    </DocsArticle>
  );
}
