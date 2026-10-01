import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import { companionJsonPath } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Custom Companion",
  description:
    "Planned workflow for creating custom Vinyaas companions with companion.json, assets, and animations.",
  path: "/companion/custom",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

export default function CompanionCustomPage() {
  return (
    <DocsArticle
      title="Custom Companion"
      description="How you will author your own companion species once registration ships."
    >
      <section className="flex flex-col gap-4">
        <h2 id="status" className={sectionHeading}>
          Current status
        </h2>
        <p className={body}>
          Custom companion loading and registration are{" "}
          <strong>not implemented yet</strong>. Built-in Ember and Soul assets
          demonstrate the intended folder layout.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="workflow" className={sectionHeading}>
          Planned workflow
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
            with identity, personality, and capabilities.
          </li>
          <li>
            Add sprite assets under <code>assets/</code>.
          </li>
          <li>
            Add animation frames under <code>animations/</code> (idle, happy,
            sleep, and more later).
          </li>
          <li>Register the companion with the future companion runtime.</li>
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
    └── sleep/`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="instances" className={sectionHeading}>
          Species vs instances
        </h2>
        <p className={body}>
          A companion folder describes a <em>species</em>. Future versions may
          support multiple <em>instances</em> of the same species with
          independent runtime state — similar to many creatures sharing one
          design but different personalities or moods.
        </p>
      </section>
    </DocsArticle>
  );
}
