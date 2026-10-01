import type { Metadata } from "next";
import Link from "next/link";

import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import {
  componentsPath,
  themingPath,
  typesetPlaygroundPath,
} from "@/components/docs-nav";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Typeset",
  description:
    "Markdown-first content typography: rhythm, measure, prose styling, and documentation layouts. Distinct from the Typography component and the Typeset playground.",
  path: "/typeset",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export default function TypesetPage() {
  return (
    <DocsArticle
      title="Typeset"
      description="A content styling system for Markdown and long-form HTML — headings, paragraphs, lists, code, and document layouts — driven by a small set of rhythm tokens."
    >
      <section className="flex flex-col gap-4">
        <h2 id="purpose" className={sectionHeading}>
          Purpose
        </h2>
        <p className={body}>
          Rendered Markdown is plain HTML. Typeset styles that HTML inside a
          content container so docs, articles, and chat-like surfaces share one
          readable rhythm. It is not the{" "}
          <Link
            href={`${componentsPath}/typography`}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Typography
          </Link>{" "}
          component (semantic React text primitives for UI), and it is not the
          color{" "}
          <Link
            href={themingPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            theme
          </Link>{" "}
          system.
        </p>
        <p className={body}>
          Experiment visually in the{" "}
          <Link
            href={typesetPlaygroundPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Typeset playground
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="rhythm" className={sectionHeading}>
          Typography rhythm
        </h2>
        <p className={body}>
          Most of the reading rhythm comes from three controls:
        </p>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>--typeset-size</code> — base text size
          </li>
          <li>
            <code>--typeset-leading</code> — line height
          </li>
          <li>
            <code>--typeset-flow</code> — space between blocks
          </li>
        </ul>
        <p className={body}>
          Heading sizes, list indents, and gaps around rules derive from those
          values so you do not tune every element by hand.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="measure" className={sectionHeading}>
          Content width
        </h2>
        <p className={body}>
          Typeset does not force a maximum measure. Your layout owns width. Use
          a wrapper <code>max-width</code> (for example <code>65ch</code>–
          <code>75ch</code>) when you want a comfortable reading column for
          documentation or articles.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="prose" className={sectionHeading}>
          Prose styling
        </h2>
        <p className={body}>
          Wrap rendered Markdown in a typeset container (and an optional preset
          class):
        </p>
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>{`<div className="typeset typeset-docs">
  <YourMarkdownRenderer>{content}</YourMarkdownRenderer>
</div>`}</code>
        </pre>
        <p className={body}>
          Colors, fonts, and radius follow your app theme. Dark mode uses the
          same tokens — no separate invert palette.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="elements" className={sectionHeading}>
          Lists, code, and layouts
        </h2>
        <p className={body}>
          Typeset styles the common Markdown elements: headings, paragraphs,
          lists, blockquotes, inline code, fenced code blocks, links, and
          tables. Documentation layouts usually combine a measured column with a
          typeset preset; product UI copy should prefer Typography components
          instead.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="playground" className={sectionHeading}>
          Playground
        </h2>
        <p className={body}>
          The{" "}
          <Link
            href={typesetPlaygroundPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Typeset playground
          </Link>{" "}
          lets you tune measure, fonts, size, leading, and flow on realistic
          Markdown-style examples, then copy the CSS when you are ready.
        </p>
      </section>
    </DocsArticle>
  );
}
