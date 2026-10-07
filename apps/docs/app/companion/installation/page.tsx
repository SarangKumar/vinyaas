import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import {
  companionCustomPath,
  companionJsonPath,
  companionPath,
} from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Companion Installation",
  description:
    "Minimal setup for Vinyaas companions: folder layout, companion.json, and host wiring. CLI companion add is planned.",
  path: "/companion/installation",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

export default function CompanionInstallationPage() {
  return (
    <DocsArticle
      title="Companion Installation"
      description="Companions are local assets + metadata — separate from registry UI components."
    >
      <section className="flex flex-col gap-4">
        <h2 id="status" className={sectionHeading}>
          Status
        </h2>
        <p className={body}>
          <code>vinyaas companion add</code> is{" "}
          <strong>not available yet</strong>. Built-in species (Ember, Soul,
          Moss, Flint, Bubble, Rime, Jab, Volt, Drake, Nyx) ship with the docs
          host today. Explore them on{" "}
          <Link href={companionPath} className={linkClass}>
            Companions
          </Link>
          .
        </p>
        <CodeBlock language="bash" code="vinyaas companion add ember" />
        <p className={body}>
          That command is planned only. Current CLI: <code>init</code>,{" "}
          <code>add</code>, <code>doctor</code>, discovery, catalogs, and{" "}
          <code>status</code>.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="minimal" className={sectionHeading}>
          Minimal manual setup
        </h2>
        <p className={body}>
          To author or vendor a companion in your own app (same shape the docs
          use):
        </p>
        <ol className={`${body} list-decimal space-y-2 pl-5`}>
          <li>
            Create <code>companion/&lt;id&gt;/</code> with{" "}
            <code>companion.json</code>, <code>assets/idle.png</code> (32×32),
            and <code>animations/&lt;clip&gt;/N.png</code> frames.
          </li>
          <li>
            Validate metadata against the{" "}
            <Link href={companionJsonPath} className={linkClass}>
              companion.json
            </Link>{" "}
            schema (id, capabilities, interactions, animations).
          </li>
          <li>
            Register the species in your catalog (imports + clip map) and mount
            a companion host/provider once at the app shell.
          </li>
          <li>
            Mark perch targets with <code>data-companion-surface</code>.
          </li>
        </ol>
        <CodeBlock
          language="bash"
          code={`companion/nyx/
  companion.json
  assets/idle.png
  animations/idle/1.png
  animations/happy/1.png
  animations/glow/1.png
  …`}
        />
        <p className={body}>
          Full authoring notes:{" "}
          <Link href={companionCustomPath} className={linkClass}>
            Custom Companion
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="what-installs" className={sectionHeading}>
          What will install later
        </h2>
        <p className={body}>
          When CLI companion install ships, expect <code>companion.json</code>,
          sprites, and animation frames — not React UI primitives from the
          component registry.
        </p>
      </section>
    </DocsArticle>
  );
}
