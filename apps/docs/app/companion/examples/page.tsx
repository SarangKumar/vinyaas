import type { Metadata } from "next";
import Link from "next/link";

import { DocsArticle } from "@/components/docs-article";
import {
  companionCustomPath,
  companionGalleryPath,
  companionPath,
} from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = pageMetadata({
  title: "Companion Examples",
  description:
    "High-quality companion setups: perch surfaces, theme reactions, and instance profiles.",
  path: "/companion/examples",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

export default function CompanionExamplesPage() {
  return (
    <DocsArticle
      title="Examples"
      description="Minimal patterns that match what the docs host actually does — no unwired demos."
    >
      <section className="flex flex-col gap-4">
        <h2 id="perch" className={sectionHeading}>
          Declare a perch surface
        </h2>
        <p className={body}>
          Companions land on elements marked with{" "}
          <code>data-companion-surface</code>. Nested buttons inherit the
          surface.
        </p>
        <CodeBlock
          language="tsx"
          code={`<div
  data-companion-surface=""
  data-companion-surface-id="settings-card"
  className="rounded-md border p-4"
>
  <button type="button">Surface action</button>
</div>`}
        />
        <div
          data-companion-surface=""
          data-companion-surface-id="examples-perch"
          className="border-border bg-card text-card-foreground rounded-md border p-5"
        >
          <p className={body}>
            Spawn a companion from the{" "}
            <Link href={companionPath} className={linkClass}>
              gallery
            </Link>{" "}
            and drop it here.
          </p>
          <button
            type="button"
            className={`border-border bg-background mt-3 inline-flex h-9 items-center rounded-md border px-3 text-sm ${focusRing}`}
          >
            Surface action
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="theme" className={sectionHeading}>
          Theme-aware companion (Nyx)
        </h2>
        <p className={body}>
          Nyx declares a <code>theme_change</code> interaction that plays{" "}
          <code>glow</code>. The docs theme toggle dispatches{" "}
          <code>vinyaas:companion-theme</code>; the host maps it to the trigger.
        </p>
        <CodeBlock
          language="json"
          code={`{
  "id": "theme-shift",
  "trigger": "theme_change",
  "action": "play_animation",
  "animation": "glow",
  "cooldown": 1800,
  "duration": 2000
}`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="instances" className={sectionHeading}>
          Instance profiles
        </h2>
        <p className={body}>
          One species, multiple personalities — same sprites, different energy
          and mood bias. Ember uses Spark/Ash; Nyx uses Eclipse/Umbra. Authoring
          details:{" "}
          <Link href={companionCustomPath} className={linkClass}>
            Custom Companion
          </Link>
          .
        </p>
        <p className={body}>
          Browse every built-in species in the{" "}
          <Link href={companionGalleryPath} className={linkClass}>
            Gallery
          </Link>
          .
        </p>
      </section>
    </DocsArticle>
  );
}
