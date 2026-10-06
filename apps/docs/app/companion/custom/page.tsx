import type { Metadata } from "next";
import Link from "next/link";

import { companionCatalog } from "@/components/companion/catalog";
import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import {
  companionAnimationsPath,
  companionJsonPath,
  companionPath,
} from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Custom Companion",
  description:
    "How to author a custom Vinyaas companion with companion.json, sprites, and animation clips.",
  path: "/companion/custom",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

export default function CompanionCustomPage() {
  const roster = companionCatalog.map((entry) => entry.meta.name).join(", ");

  return (
    <DocsArticle
      title="Custom Companion"
      description="Author your own companion species with the same folder layout as the built-ins."
    >
      <section className="flex flex-col gap-4">
        <h2 id="status" className={sectionHeading}>
          Current status
        </h2>
        <p className={body}>
          Built-in companions ({roster}) already demonstrate the full folder
          layout,{" "}
          <Link href={companionJsonPath} className={linkClass}>
            companion.json
          </Link>
          , pixel clips, and runtime interactions. Browse them on the{" "}
          <Link href={companionPath} className={linkClass}>
            Companions
          </Link>{" "}
          page or open a Know more sheet for Bond and type notes. Project-level
          registration for custom companions (CLI install + host discovery) is{" "}
          <strong>not shipped yet</strong> — this page documents the layout the
          runtime expects when that lands.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="workflow" className={sectionHeading}>
          Folder workflow
        </h2>
        <ol className={`${body} list-decimal space-y-3 pl-5`}>
          <li>
            Create a companion folder (for example{" "}
            <code>companion/my-buddy/</code>).
          </li>
          <li>
            Add a{" "}
            <Link href={companionJsonPath} className={linkClass}>
              companion.json
            </Link>{" "}
            with identity, personality, capabilities, and interactions.
          </li>
          <li>
            Add a static idle sprite under <code>assets/</code>.
          </li>
          <li>
            Add animation frames under <code>animations/</code> — at minimum{" "}
            <code>idle</code>, <code>happy</code>, <code>sleep</code>,{" "}
            <code>fall</code>, and <code>puff</code>. See{" "}
            <Link href={companionAnimationsPath} className={linkClass}>
              Animations
            </Link>{" "}
            for clip tables.
          </li>
          <li>
            Wire the species into the companion catalog (today: docs catalog;
            later: project registration via CLI).
          </li>
        </ol>
        <CodeBlock
          language="bash"
          code={`companion/my-buddy/
├── companion.json
├── assets/
│   └── idle.png
└── animations/
    ├── idle/
    ├── happy/
    ├── sleep/
    ├── fall/
    └── puff/`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="instances" className={sectionHeading}>
          Species vs instances
        </h2>
        <p className={body}>
          A companion folder describes a <em>species</em>. The live host spawns
          instances of that species onto the page (max one of each type today).
          Future versions may support multiple instances of the same species
          with independent Bond, mood, and personality — same design, different
          characters.
        </p>
      </section>
    </DocsArticle>
  );
}
