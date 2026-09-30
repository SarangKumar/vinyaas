"use client";

import type { ReactNode } from "react";

import { Badge } from "@/registry/new-york/ui/badge";
import { Kbd } from "@/registry/new-york/ui/kbd";
import { Separator } from "@/registry/new-york/ui/separator";

const prose =
  "grid max-w-[min(100%,var(--typeset-measure))] gap-[var(--typeset-flow)]";
const h1 = {
  fontFamily: "var(--typeset-heading)",
  fontSize: "var(--typeset-h1)",
  lineHeight: 1.15,
} as const;
const h2 = {
  fontFamily: "var(--typeset-heading)",
  fontSize: "var(--typeset-h2)",
} as const;
const h3 = {
  fontFamily: "var(--typeset-heading)",
  fontSize: "var(--typeset-h3)",
} as const;
const mono = { fontFamily: "var(--typeset-mono)" } as const;
const codePad =
  "bg-muted overflow-x-auto rounded-lg p-4 text-[0.8125rem] leading-6 sm:p-5";

export type TypesetExample = {
  id: string;
  title: string;
  description?: string;
  preview: ReactNode;
};

export const typesetExamples: TypesetExample[] = [
  {
    id: "manifesto",
    title: "Design manifesto",
    preview: (
      <div className={prose}>
        <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
          Vinyaas
        </p>
        <h1 className="font-semibold tracking-tight" style={h1}>
          Source you can own
        </h1>
        <p className="text-muted-foreground">
          Install components as files — not black-box packages — then rewrite
          them like the rest of your app.
        </p>
        <p>
          The typeset playground exists so measure and leading feel inevitable
          before you commit tokens to <span style={mono}>globals.css</span>.
        </p>
      </div>
    ),
  },
  {
    id: "init-story",
    title: "Init narrative",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          What <span style={mono}>vinyaas init</span> promises
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Theme tokens land in your stylesheet once.</li>
          <li>
            Aliases resolve <span style={mono}>@/components/ui/…</span>.
          </li>
          <li>Re-running init stays idempotent.</li>
        </ol>
        <blockquote className="border-border text-muted-foreground border-l-2 pl-4 italic">
          Init is a handshake with Tailwind v4 — not a second design system.
        </blockquote>
      </div>
    ),
  },
  {
    id: "release-note",
    title: "Release note",
    preview: (
      <div className={prose}>
        <Badge className="w-fit">Docs</Badge>
        <h2 className="font-semibold tracking-tight" style={h1}>
          Themes &amp; Typeset land in v1.1
        </h2>
        <p className="text-muted-foreground">
          Playgrounds for presets and Markdown rhythm — still not registry
          components.
        </p>
        <p>
          Discover them from the navbar, then copy CSS when a combination feels
          right.
        </p>
      </div>
    ),
  },
  {
    id: "author-card",
    title: "Author bio",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Sarang Kumar
        </h2>
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          Maintainer · Vinyaas
        </p>
        <p>
          Building a registry you can fork without fighting the framework —
          Tailwind utilities first, Radix-free primitives where possible.
        </p>
        <p className="text-muted-foreground text-sm">
          Ships docs, CLI, and the new-york style catalog.
        </p>
      </div>
    ),
  },
  {
    id: "reading-rhythm",
    title: "Reading rhythm",
    preview: (
      <article className={prose}>
        <h1 className="font-semibold tracking-tight" style={h1}>
          Three knobs that matter
        </h1>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Measure
        </h2>
        <p>
          Keep body near 60–80ch. Wider lanes look “modern” until comprehension
          drops.
        </p>
        <h3 className="font-semibold tracking-tight" style={h3}>
          Leading &amp; flow
        </h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>Leading carries sentences; flow carries sections.</li>
          <li>
            Inline code stays mono:{" "}
            <code className="bg-muted rounded px-1 py-0.5" style={mono}>
              --typeset-leading
            </code>
            .
          </li>
        </ul>
      </article>
    ),
  },
  {
    id: "cli-cheatsheet",
    title: "CLI cheatsheet",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Muscle memory
        </h2>
        <p>
          Open search with <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>, then install what you need:
        </p>
        <pre className={codePad} style={mono}>
          {`npx vinyaas init
npx vinyaas add button dialog chart
npx vinyaas search drawer --json`}
        </pre>
      </div>
    ),
  },
  {
    id: "contrast-formula",
    title: "Contrast formula",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Relative luminance
        </h2>
        <p>For body text on a solid surface, aim for:</p>
        <div
          className={`${codePad} text-center tracking-wide`}
          role="math"
          aria-label="Contrast ratio greater than or equal to 4.5 to 1"
        >
          C<sub>r</sub> ≥ 4.5 : 1
        </div>
        <p className="text-muted-foreground text-sm">
          Large headings may use 3:1. Semantic tokens should already clear AA
          when you stick to <span style={mono}>foreground</span> on{" "}
          <span style={mono}>background</span>.
        </p>
      </div>
    ),
  },
  {
    id: "specimen-frame",
    title: "Type specimen",
    preview: (
      <figure className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Empty specimen
        </h2>
        <div
          className="border-border bg-muted/40 flex aspect-[5/3] w-full items-center justify-center rounded-lg border border-dashed"
          role="img"
          aria-label="Blank type specimen"
        >
          <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            Drop a PNG here
          </span>
        </div>
        <figcaption className="text-muted-foreground text-sm">
          Figure — Capture heading / body pairs at your chosen measure.
        </figcaption>
      </figure>
    ),
  },
  {
    id: "token-snippet",
    title: "Token snippet",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Copy-ready CSS
        </h2>
        <p>Shuffle until the page sings, then paste:</p>
        <pre className={codePad} style={mono}>
          {`:root {
  --typeset-measure: 70ch;
  --typeset-heading: Georgia, ui-serif, serif;
  --typeset-body: ui-sans-serif, system-ui, sans-serif;
  --typeset-leading: 1.6;
}`}
        </pre>
      </div>
    ),
  },
  {
    id: "outline",
    title: "Chapter outline",
    preview: (
      <nav className={prose} aria-label="Chapter outline">
        <h2 className="font-semibold tracking-tight" style={h2}>
          Outline
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <a href="#promise" className="underline underline-offset-4">
              The install promise
            </a>
          </li>
          <li>
            <a href="#tokens" className="underline underline-offset-4">
              Tokens vs components
            </a>
          </li>
          <li>
            <a href="#play" className="underline underline-offset-4">
              Playgrounds vs packages
            </a>
          </li>
        </ol>
      </nav>
    ),
  },
  {
    id: "callout-scoped",
    title: "Scoped warning",
    preview: (
      <aside className={prose}>
        <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
          Warning
        </p>
        <h3 className="font-semibold tracking-tight" style={h3}>
          Do not write playground CSS into globals
        </h3>
        <p>
          Themes mutate a wrapper. Typeset mutates{" "}
          <span style={mono}>--typeset-*</span>. The rest of the docs stay
          untouched.
        </p>
        <Separator />
        <p className="text-muted-foreground text-sm">
          Copy code when you are ready to promote a preset into a real app.
        </p>
      </aside>
    ),
  },
  {
    id: "glossary",
    title: "Mini glossary",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Vocabulary
        </h2>
        <dl className="grid gap-3">
          <div>
            <dt className="font-medium">Preset</dt>
            <dd className="text-muted-foreground">
              A curated ThemeConfig — not a free-form color picker.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Measure</dt>
            <dd className="text-muted-foreground">
              Line length in <span style={mono}>ch</span> for long-form
              Markdown.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Registry item</dt>
            <dd className="text-muted-foreground">
              Something <span style={mono}>vinyaas add</span> can install.
              Playgrounds are not items.
            </dd>
          </div>
        </dl>
      </div>
    ),
  },
  {
    id: "pull-quote",
    title: "Pull quote",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          On shipping source
        </h2>
        <blockquote className="border-border border-l-2 pl-4">
          <p className="italic">
            If you cannot delete half the file, it was never really yours.
          </p>
          <footer className="text-muted-foreground mt-3 text-sm not-italic">
            — Internal Vinyaas review note
          </footer>
        </blockquote>
      </div>
    ),
  },
  {
    id: "preflight",
    title: "Preflight list",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Before you merge
        </h2>
        <ul className="space-y-2">
          {[
            "Phone width: one column, no horizontal scroll",
            "Copy code sits bottom-right on phones",
            "Charts clip inside their cards",
            "No Calendar / missing registry fakes",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="text-muted-foreground">
                ☐
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "http-example",
    title: "HTTP example",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          <span style={mono}>GET</span> /r/new-york/button.json
        </h2>
        <p>
          Registry payloads are plain JSON. Docs playgrounds never appear in
          that index.
        </p>
        <pre className={codePad} style={mono}>
          {`{
  "name": "button",
  "type": "registry:ui",
  "files": [{ "path": "ui/button/index.tsx" }]
}`}
        </pre>
      </div>
    ),
  },
  {
    id: "scale-table",
    title: "Type scale",
    preview: (
      <div className={`${prose} min-w-0`}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Size presets
        </h2>
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[16rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="py-2 pr-3 font-medium">Role</th>
                <th className="py-2 pr-3 font-medium">S</th>
                <th className="py-2 pr-3 font-medium">M</th>
                <th className="py-2 font-medium">L</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-border border-b">
                <td className="py-2 pr-3">Body</td>
                <td className="py-2 pr-3">0.94rem</td>
                <td className="py-2 pr-3">1rem</td>
                <td className="py-2">1.13rem</td>
              </tr>
              <tr>
                <td className="py-2 pr-3">H1</td>
                <td className="py-2 pr-3">1.75rem</td>
                <td className="py-2 pr-3">2.25rem</td>
                <td className="py-2">2.75rem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "footnote",
    title: "Footnote",
    preview: (
      <div className={prose}>
        <p>
          Playgrounds are discovery tools<sup>1</sup> — they preview tokens,
          they do not replace <span style={mono}>vinyaas add</span>.
        </p>
        <Separator />
        <p className="text-muted-foreground text-xs leading-5">
          <sup>1</sup> Same idea as the homepage masonry: compositions over
          isolated knobs.
        </p>
      </div>
    ),
  },
  {
    id: "colophon",
    title: "Colophon",
    preview: (
      <div className={prose}>
        <h2 className="font-semibold tracking-tight" style={h2}>
          Colophon
        </h2>
        <p>
          Set in system UI fonts by default. Shuffle to Georgia for editorial
          drafts. Mono falls back to Menlo / Consolas.
        </p>
        <p className="text-muted-foreground text-sm">
          Built with the Vinyaas docs app · Tailwind CSS v4 · no Calendar
          component required.
        </p>
      </div>
    ),
  },
];
