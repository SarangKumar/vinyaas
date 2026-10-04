import type { Metadata } from "next";

import { components, currentVersion } from "@/components/component-meta";
import { DocsArticle } from "@/components/docs-article";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Release notes for Vinyaas through v1.3.0, including catalogs, accessibility, CLI, and registry updates.",
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
          v1.1.0 continues the catalog with focused foundation work, CLI project
          setup, registry discovery, and new components. It adds {v11.length}{" "}
          component{v11.length === 1 ? "" : "s"}.
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
          <li>
            <strong>Themes</strong> (<code>/themes</code>) is a website
            playground — not a registry component. Switch curated presets
            (Default, Yellow, Rose, Orange, Red, Green, Violet, Blue), adjust
            border radius, preview themes across real Vinyaas UI compositions,
            and open Code dialogs to inspect and copy each example&apos;s
            source. Theme selection stays scoped to the playground and does not
            change the docs site chrome.
          </li>
          <li>
            <strong>Typeset</strong> (<code>/typeset</code>) is a typography
            playground — not a registry component. Tune measure,
            heading/body/mono fonts, size, leading, and flow; shuffle curated
            typography presets; and preview realistic Markdown-style content
            with matching Code dialogs. Typography changes stay scoped to the
            page.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="v1.3.0" className={heading}>
          v1.3.0
        </h2>
        <p className="text-foreground text-base leading-7">
          v{currentVersion} lays the foundation for application and dashboard
          primitives: a release-wide accessibility contract, registry-owned
          component catalogs, CLI catalog install flows, dry-run installs, and
          stronger release verification for the production registry URL.
        </p>
        <h3
          id="v1.3.0-added"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Added
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            <strong>Resizable</strong> — horizontal and vertical panel layouts
            via <code>react-resizable-panels</code>, with keyboard-accessible
            handles, nested groups, and composite docs examples (dashboard, IDE
            workspace, analytics).
          </li>
          <li>
            New-component indicator in documentation navigation for components
            introduced in the current release (driven by{" "}
            <code>introducedIn</code> metadata), plus a New Components section
            on the components catalog page.
          </li>
          <li>
            <strong>Red</strong> theme preset — crimson design-system accent
            (distinct from Rose, Orange, and semantic destructive) with light
            and dark surfaces, charts, and radius support in the Themes
            playground.
          </li>
        </ul>
        <h3
          id="v1.3.0-improved"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Improved
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Resizable handle affordances: orientation-aware 6-dot grips
            (vertical separator → 2×3; horizontal → 3×2), orientation-aware
            cursors, expanded hit targets, and crossing-handle 2D resize cursors
            from the library.
          </li>
          <li>
            Themes and Typeset playground masonry restored to a 1 → 2 → 3 → 4 →
            5 column progression at project breakpoints.
          </li>
          <li>
            Homepage showcase vertical spacing aligned with the horizontal
            gutter (PlaygroundGrid gap only — no stacked card margins).
          </li>
          <li>
            Theme contrast polish: dark surfaces stay deep with a light primary
            tint (Default / Yellow / Violet pattern), <strong>Red</strong> uses
            a true red primary, and Progress fill follows{" "}
            <code>bg-primary</code> / <code>--primary</code>.
          </li>
          <li>
            Homepage showcase fixed at exactly 20 cards, with a compact
            Resizable sidebar | main example near the start of the masonry.
          </li>
        </ul>
        <h3
          id="v1.3.0-accessibility"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Accessibility
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Concise accessibility checklist for keyboard, focus, ARIA, disabled
            and loading states, touch targets, and reduced motion.
          </li>
          <li>
            Documented test convention for registry components (role/name
            queries, Escape/focus for overlays).
          </li>
        </ul>
        <h3
          id="v1.3.0-catalogs"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Catalogs
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Named catalogs owned by the registry (<code>form</code>,{" "}
            <code>dashboard</code>, <code>navigation</code>,{" "}
            <code>feedback</code>, <code>application</code>).
          </li>
          <li>
            Membership lists only currently installable component IDs; planned
            gaps are documented separately.
          </li>
          <li>
            Built to <code>/r/catalogs/</code> for CLI, docs, and future
            tooling.
          </li>
        </ul>
        <h3
          id="v1.3.0-cli"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          CLI
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            <code>vinyaas catalog list</code> and{" "}
            <code>vinyaas catalog info &lt;catalog&gt;</code>.
          </li>
          <li>
            <code>vinyaas add --catalog &lt;catalog&gt;</code> expands a catalog
            after confirmation (default Yes). Bare names never install catalogs.
          </li>
          <li>
            <code>--dry-run</code> prints components, files, dependencies, and
            registry dependencies without writing files.
          </li>
          <li>Suggestions for unknown components, catalogs, and commands.</li>
        </ul>
        <h3
          id="v1.3.0-tooling"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Developer tooling
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            <code>pnpm verify</code> runs typecheck, lint, and tests.
          </li>
          <li>
            Release build/check scripts reject localhost registry URLs and
            require the production path{" "}
            <code>https://vinyaas.vercel.app/r</code>.
          </li>
        </ul>
        <p className="text-foreground text-base leading-7">
          Remaining for later v1.3 increments: Drag &amp; Drop, sidebar,
          data-table, and the rest of the planned dashboard component set.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="v1.2.0" className={heading}>
          v1.2.0
        </h2>
        <p className="text-foreground text-base leading-7">
          v1.2.0 focuses on installation clarity, documentation polish, and
          Companions as a new docs feature. Framework-specific guides and
          project-state onboarding replace the single generic install page, and
          the site catalog presentation is cleaned up for that release.
        </p>
        <h3
          id="v1.2.0-installation"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Installation
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Framework-specific installation guides for Next.js, React + Vite,
            and React.
          </li>
          <li>
            An installation landing page that asks you to choose a framework
            before showing setup steps.
          </li>
          <li>
            Project-state onboarding on each guide: fresh project, existing
            project, or existing shadcn-style project.
          </li>
          <li>
            Framework-specific create-app commands for fresh Next.js and Vite
            setups, then a shared <code>vinyaas init</code> →{" "}
            <code>vinyaas add</code> flow.
          </li>
        </ul>
        <h3
          id="v1.2.0-companions"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Companions
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Companions land as a first-class docs feature: Ember, Soul, and Moss
            with <code>companion.json</code> metadata, pixel assets, and a
            global host that persists across navigation.
          </li>
          <li>
            Runtime interaction system v0.1: metadata-driven triggers (
            <code>click</code>, <code>double_click</code>,{" "}
            <code>idle_timeout</code>, drag/drop, <code>cursor_nearby</code>,{" "}
            <code>page_navigation</code>) and reusable actions (
            <code>play_animation</code>, <code>change_state</code>,{" "}
            <code>jump</code>, <code>sleep</code>, <code>move</code>).
          </li>
          <li>
            Personality instances and deterministic moods (<code>happy</code>,{" "}
            <code>neutral</code>, <code>sleepy</code>, <code>excited</code>)
            without AI. Instance profiles can override name, traits, and
            behavior preferences while sharing species assets.
          </li>
          <li>
            Docs for installation, <code>companion.json</code>, and custom
            companions. The homepage masonry includes one companion preview
            card; the full card grid lives on <code>/companion</code>.
          </li>
        </ul>
        <h3
          id="v1.2.0-docs"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Documentation
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Theming docs at <code>/theming</code> explain CSS variables,
            semantic tokens, radius, and customization. The Themes playground
            stays at <code>/themes</code>.
          </li>
          <li>
            Typeset docs at <code>/typeset</code> cover Markdown/content rhythm.
            The Typeset playground moves to <code>/typeset/playground</code>.
          </li>
          <li>
            Flat sidebar navigation: SECTIONS, COMPONENTS, and GET STARTED
            without nested framework children. CLI, Package Import, and Dark
            Mode are dedicated pages.
          </li>
          <li>
            Component documentation continues with examples, API notes, and
            install snippets aligned to the current registry layout.
          </li>
        </ul>
        <h3
          id="v1.2.0-components"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Components
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Catalog presentation no longer highlights temporary “new” markers;
            the full list is the primary browse surface.
          </li>
          <li>
            Documentation and example polish across existing registry
            components.
          </li>
        </ul>
        <h3
          id="v1.2.0-cli"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          CLI
        </h3>
        <ul className="text-foreground list-disc pl-5 text-base leading-7">
          <li>
            Published package metadata and README improved for npm
            discoverability (description, keywords, homepage).
          </li>
          <li>
            CLI package version aligned to v{currentVersion}. Commands:{" "}
            <code>init</code>, <code>doctor</code>, <code>add</code>,{" "}
            <code>list</code>, <code>search</code>, <code>info</code>,{" "}
            <code>status</code>, and <code>--version</code>.
          </li>
          <li>
            Category discovery and install: <code>vinyaas list --category</code>
            , <code>vinyaas search … --category</code>, and{" "}
            <code>vinyaas add --category</code>. Categories are registry
            metadata, not component collections.
          </li>
          <li>
            <code>vinyaas add --dry-run</code>, confirmation for multi-component
            and category installs (<code>--yes</code> to skip), and local
            install tracking in <code>.vinyaas/manifest.json</code> with{" "}
            <code>vinyaas status</code>.
          </li>
        </ul>
      </section>
    </DocsArticle>
  );
}
