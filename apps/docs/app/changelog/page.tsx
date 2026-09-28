import type { Metadata } from "next";

import { components, currentVersion } from "@/components/component-meta";
import { DocsArticle } from "@/components/docs-article";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Release notes for Vinyaas v0.1 and v1.0.0, including the components shipped in each version.",
});

const heading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function ChangelogPage() {
  const v01 = components.filter(
    (component) => component.introducedIn === "0.1",
  );
  const v10 = components.filter(
    (component) => component.introducedIn === "1.0.0",
  );

  return (
    <DocsArticle title="Changelog" description="What Vinyaas has shipped.">
      <section className="flex flex-col gap-4">
        <h2 id="v0.1" className={heading}>
          v0.1
        </h2>
        <p className="text-body text-base leading-7">
          v0.1 is the foundation. It ships {v01.length} component:{" "}
          {v01.map((component) => component.name).join(", ")}.
        </p>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          <li>
            A pnpm workspace with a docs app and the <code>@vinyaas/cli</code>{" "}
            package.
          </li>
          <li>
            A new-york registry. Each component is one installable JSON item.
            <code> vinyaas init</code> writes <code>components.json</code> and{" "}
            <code>lib/utils.ts</code>. <code>vinyaas add</code> copies that
            component&apos;s source.
          </li>
          <li>Light and dark themes, stored in the browser.</li>
          <li>
            An installation flow that records the package manager for the
            session: npm, pnpm, yarn, or bun.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="v1.0.0" className={heading}>
          v1.0.0
        </h2>
        <p className="text-body text-base leading-7">
          v1.0.0 is the major production-focused catalog release. It adds{" "}
          {v10.length} components. Together with v0.1, the catalog has{" "}
          {components.length} independently installable registry items. It
          expands forms, overlays, feedback, layout, navigation, data display,
          and utilities, with documentation, CLI, and production-oriented
          examples built around the full set.
        </p>
        <h3
          id="catalog"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Component catalog
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          <li>
            {components.length} components in total. Button remains the v0.1
            foundation; the other {v10.length} are introduced in{" "}
            {currentVersion}.
          </li>
          <li>
            Each catalog entry is an independently installable registry item.
          </li>
          <li>
            Components are composable primitives with production-oriented
            examples, light and dark theme support, and responsive behavior.
          </li>
        </ul>
        <h3
          id="documentation"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Documentation
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          <li>
            Component pages cover API reference, installation, usage examples,
            composition, accessibility notes, and registry source.
          </li>
          <li>
            Examples can switch between TSX and JSX. Source blocks are
            syntax-highlighted, line-numbered when shown as registry source, and
            long snippets collapse behind an expand control.
          </li>
          <li>
            Installation snippets stay bash. Documentation search opens with
            Cmd/Ctrl+K. The shell is responsive for desktop and mobile.
          </li>
          <li>
            Site and per-component Open Graph images, plus the homepage
            playground showcase.
          </li>
        </ul>
        <h3
          id="cli"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          CLI
        </h3>
        <p className="text-body text-base leading-7">
          The CLI installs one or many components in a single call. Shared
          packages install once:
        </p>
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>npx vinyaas add button card badge</code>
        </pre>
        <h3
          id="implemented"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Released
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          {v10.map((component) => (
            <li key={component.slug}>{component.name}</li>
          ))}
        </ul>
        <p className="text-body text-base leading-7">
          A plain HTML select is used where a menu is enough. A custom popup
          Select is not part of the catalog. Native Select remains a component.
        </p>
        <h3
          id="planned"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Planned
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          <li>
            Publishing this registry and CLI is separate from the work in the
            working tree.
          </li>
        </ul>
        <h3
          id="not-in-this-version"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Not in this version
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          <li>A custom popup Select.</li>
          <li>Swipe-to-dismiss toasts.</li>
          <li>
            Theme CSS written into a consumer project by{" "}
            <code>vinyaas init</code>.
          </li>
        </ul>
      </section>
    </DocsArticle>
  );
}
