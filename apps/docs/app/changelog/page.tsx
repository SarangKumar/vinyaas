import type { Metadata } from "next";

import { components, currentVersion } from "@/components/component-meta";
import { DocsArticle } from "@/components/docs-article";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Release notes for Vinyaas v0.1, v1.0.0, and v1.1.0, including the components shipped in each version.",
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
  const v11 = components.filter(
    (component) => component.introducedIn === "1.1.0",
  );

  return (
    <DocsArticle title="Changelog" description="What Vinyaas has shipped.">
      <section className="flex flex-col gap-4">
        <h2 id="v0.1" className={heading}>
          v0.1
        </h2>
        <p className="text-foreground text-base leading-7">
          v0.1 is the foundation. It ships {v01.length} component:{" "}
          {v01.map((component) => component.name).join(", ")}.
        </p>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
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
        <p className="text-foreground text-base leading-7">
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
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            {v01.length + v10.length} components shipped through v1.0.0. Button
            remains the v0.1 foundation; the other {v10.length} were introduced
            in v1.0.0. The full catalog now has {components.length} items.
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
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
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
        <p className="text-foreground text-base leading-7">
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
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          {v10.map((component) => (
            <li key={component.slug}>{component.name}</li>
          ))}
        </ul>
        <p className="text-foreground text-base leading-7">
          A plain HTML select is used where a menu is enough. A custom popup
          Select is not part of the catalog. Native Select remains a component.
        </p>
        <h3
          id="planned"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Planned
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
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
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>A custom popup Select.</li>
          <li>Swipe-to-dismiss toasts.</li>
          <li>
            Theme CSS written into a consumer project by{" "}
            <code>vinyaas init</code>.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="v1.1.0" className={heading}>
          v1.1.0
        </h2>
        <p className="text-foreground text-base leading-7">
          v{currentVersion} continues the catalog with focused foundation work,
          CLI project setup, registry discovery, and new components. It adds{" "}
          {v11.length} component
          {v11.length === 1 ? "" : "s"}.
        </p>
        <h3
          id="v1.1.0-cli"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          CLI
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            <code>vinyaas init</code> prepares a Tailwind CSS v4 project: theme
            tokens in the global stylesheet, aliases, PostCSS when needed,{" "}
            <code>components.json</code>, and <code>lib/utils.ts</code>. Init is
            idempotent.
          </li>
          <li>
            <code>vinyaas add</code> installs one or many components, resolves
            registry dependencies, and skips already-installed components unless{" "}
            <code>--force</code> is set.
          </li>
          <li>
            Discovery commands: <code>vinyaas list</code>,{" "}
            <code>vinyaas search</code>, and <code>vinyaas info</code>, each
            with optional <code>--json</code> output.
          </li>
          <li>
            Clearer install summaries, typo suggestions for unknown names, and
            concise CLI errors for expected failures.
          </li>
        </ul>
        <h3
          id="v1.1.0-catalog"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Component catalog
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          {v11.map((component) => (
            <li key={component.slug}>{component.name}</li>
          ))}
        </ul>
        <h3
          id="v1.1.0-registry"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Components and registry
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Installed components use{" "}
            <code>components/ui/&lt;name&gt;/index.tsx</code>. Supporting CSS
            files stay beside the entry file when a component needs them.
          </li>
          <li>
            Registry-driven discovery through a generated style catalog (
            <code>index.json</code>) used by <code>list</code> and{" "}
            <code>search</code>.
          </li>
        </ul>
        <h3
          id="v1.1.0-tailwind"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Tailwind support
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Consumer theme tokens stay in <code>globals.css</code> with Tailwind
            v4 <code>@theme</code> mappings. Components use semantic utilities
            such as <code>bg-card</code>, <code>border-border</code>, and{" "}
            <code>text-muted-foreground</code>.
          </li>
          <li>
            Docs and registry examples lean on responsive width, sizing, and
            overflow utilities so installs fit natural Tailwind layouts without
            extra CSS files for most components.
          </li>
          <li>
            Minimal chart tokens (<code>--chart-1</code> through{" "}
            <code>--chart-5</code>) support themed charts without restoring a
            large legacy theme file.
          </li>
        </ul>
        <h3
          id="v1.1.0-docs"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Documentation and website
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Component pages keep production-oriented examples, In practice
            sections, and the current <code>index.tsx</code> install paths.
          </li>
          <li>
            Homepage showcase, theme tokens, accessibility notes, and SEO
            metadata (Open Graph, robots, sitemap) stay aligned with the v1.1
            catalog.
          </li>
          <li>
            Installation docs cover init, multi-component add, skip/force
            behavior, and discovery commands.
          </li>
        </ul>
      </section>
    </DocsArticle>
  );
}
