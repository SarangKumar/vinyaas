import type { Metadata } from "next";
import Link from "next/link";

import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import {
  componentsJsonPath,
  darkModePath,
  themesPath,
} from "@/components/docs-nav";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Theming",
  description:
    "How Vinyaas theming works: CSS variables, semantic colors, radius, dark mode, and customization.",
  path: "/theming",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export default function ThemingPage() {
  return (
    <DocsArticle
      title="Theming"
      description="Vinyaas uses CSS variables for semantic theme tokens. Components read those tokens so you can retheme without rewriting class names."
    >
      <section className="flex flex-col gap-4">
        <h2 id="overview" className={sectionHeading}>
          Overview
        </h2>
        <p className={body}>
          After <code>vinyaas init</code>, theme tokens are written into your
          CSS entry under <code>:root</code> and <code>.dark</code>. Tailwind
          maps them to utilities such as <code>bg-background</code>,{" "}
          <code>text-foreground</code>, and <code>border-border</code>.
        </p>
        <p className={body}>
          Prefer changing tokens over hard-coding colors on individual
          components. For a visual preview of curated presets, open the{" "}
          <Link
            href={themesPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Themes playground
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="css-variables" className={sectionHeading}>
          CSS variables
        </h2>
        <p className={body}>
          Keep <code>tailwind.cssVariables</code> enabled in{" "}
          <Link
            href={componentsJsonPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            components.json
          </Link>
          . That is the default for Vinyaas projects.
        </p>
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>{`<div className="bg-background text-foreground" />`}</code>
        </pre>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="token-convention" className={sectionHeading}>
          Token convention
        </h2>
        <p className={body}>
          Tokens use semantic background / foreground pairs. The base token is
          the surface; the <code>-foreground</code> token is the text or icon
          color that sits on that surface. Example: <code>primary</code> pairs
          with <code>primary-foreground</code>.
        </p>
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>{`<div className="bg-primary text-primary-foreground">Save</div>`}</code>
        </pre>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="theme-tokens" className={sectionHeading}>
          Theme tokens
        </h2>
        <p className={body}>
          These tokens live in your CSS under <code>:root</code> and{" "}
          <code>.dark</code>:
        </p>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>background</code> / <code>foreground</code> — page shell and
            default text
          </li>
          <li>
            <code>card</code> / <code>popover</code> — elevated and floating
            surfaces
          </li>
          <li>
            <code>primary</code> / <code>secondary</code> / <code>accent</code>{" "}
            /<code>muted</code> — emphasis levels and supporting UI
          </li>
          <li>
            <code>destructive</code> — error and destructive actions
          </li>
          <li>
            <code>border</code>, <code>input</code>, <code>ring</code> — edges
            and focus outlines
          </li>
          <li>
            <code>chart-1</code> … <code>chart-5</code> — chart palette
          </li>
          <li>
            <code>sidebar-*</code> — sidebar surfaces when used
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="radius" className={sectionHeading}>
          Radius
        </h2>
        <p className={body}>
          <code>--radius</code> is the base corner size. Derived scales (
          <code>--radius-sm</code>, <code>--radius-md</code>,{" "}
          <code>--radius-lg</code>, <code>--radius-xl</code>) keep components
          consistent when you change one value.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="typography-tokens" className={sectionHeading}>
          Typography tokens
        </h2>
        <p className={body}>
          Init maps <code>--font-sans</code> and <code>--font-mono</code> for UI
          text and code. Content rhythm for Markdown layouts is covered
          separately on{" "}
          <Link
            href="/typeset"
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Typeset
          </Link>
          . Component-level text styles use the Typography component.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="dark-mode" className={sectionHeading}>
          Dark mode
        </h2>
        <p className={body}>
          Dark mode overrides the same tokens inside <code>.dark</code>. Toggle
          the class on the document root — see{" "}
          <Link
            href={darkModePath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Dark Mode
          </Link>{" "}
          for framework-specific wiring.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="customize" className={sectionHeading}>
          Customizing themes
        </h2>
        <p className={body}>
          Edit the CSS variables in your global stylesheet, or start from a
          curated look in the Themes playground and copy the generated CSS into
          the project. Keep light and dark pairs readable together when you
          change primary, accent, or surface colors.
        </p>
        <p className={body}>
          To add a token, define it under <code>:root</code> and{" "}
          <code>.dark</code>, then expose it with <code>@theme inline</code> so
          Tailwind utilities can use it.
        </p>
      </section>
    </DocsArticle>
  );
}
