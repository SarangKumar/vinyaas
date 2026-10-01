import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import { companionCustomPath } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";
import emberMeta from "@/companion/ember/companion.json";

export const metadata: Metadata = pageMetadata({
  title: "companion.json",
  description:
    "Configure companion identity, animations, personality, capabilities, and interactions in companion.json.",
  path: "/companion/configuration",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

const example = JSON.stringify(emberMeta, null, 2);

export default function CompanionConfigurationPage() {
  return (
    <DocsArticle
      title="companion.json"
      description="Local metadata that describes a companion species — separate from components.json."
    >
      <section className="flex flex-col gap-4">
        <h2 id="role" className={sectionHeading}>
          Role
        </h2>
        <p className={body}>
          <code>companion.json</code> identifies a companion type (species), not
          a running instance. Future runtimes may create multiple instances of
          the same species with different state. The schema will evolve; keep
          fields minimal for now.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="fields" className={sectionHeading}>
          Fields
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>id</code> / <code>name</code> / <code>type</code> — identity
            and species kind (for example <code>flame</code> or{" "}
            <code>ghost</code>).
          </li>
          <li>
            <code>description</code> — short human-readable summary.
          </li>
          <li>
            <code>personalityTraits</code> — light personality tags for
            presentation and future behavior.
          </li>
          <li>
            <code>capabilities</code> — declared abilities such as floating or
            click reactions (not implemented in a runtime yet).
          </li>
          <li>
            <code>interactions</code> — metadata for possible behaviors (idle,
            wave, sleep, and more). Descriptions only; no runtime yet.
          </li>
          <li>
            <code>assets</code> / <code>animations</code> — relative paths to
            sprite files and frame sequences.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="example" className={sectionHeading}>
          Example
        </h2>
        <p className={body}>
          Ember&apos;s built-in metadata (paths are relative to the companion
          folder):
        </p>
        <CodeBlock
          code={example}
          leading={
            <span className="text-muted-foreground font-mono text-xs">
              json
            </span>
          }
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="custom" className={sectionHeading}>
          Custom companions
        </h2>
        <p className={body}>
          For a future authoring workflow, see{" "}
          <Link href={companionCustomPath} className={linkClass}>
            Custom Companion
          </Link>
          .
        </p>
      </section>
    </DocsArticle>
  );
}
