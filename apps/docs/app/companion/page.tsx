import type { Metadata } from "next";
import Link from "next/link";

import { CompanionCard } from "@/components/companion/companion-card";
import { companionCatalog } from "@/components/companion/catalog";
import { DocsArticle } from "@/components/docs-article";
import {
  companionCustomPath,
  companionInstallationPath,
  companionJsonPath,
} from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Companions",
  description:
    "Meet Vinyaas Companions — tiny customizable companions that bring your workspace to life.",
  path: "/companion",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

export default function CompanionPage() {
  return (
    <DocsArticle
      title="Meet Vinyaas Companions"
      description="Tiny customizable companions that bring your workspace to life."
    >
      <section className="flex flex-col gap-4">
        <h2 id="showcase" className={sectionHeading}>
          Built-in companions
        </h2>
        <p className={body}>
          Click a companion card to spawn it on the page. You can have up to two
          instances of each type at once. Dead companions still hold their slot
          until they respawn.
        </p>
        <div
          data-companion-card-grid
          className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {companionCatalog.map((entry) => (
            <CompanionCard key={entry.meta.id} entry={entry} size={128} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="surfaces" className={sectionHeading}>
          Landing surfaces
        </h2>
        <p className={body}>
          Companions land on declared surfaces and interactive chrome — buttons,
          selects, code blocks, cards, and playground panels. Plain text and
          layout wrappers are not valid perches. While dragging, a valid surface
          highlights softly; invalid areas do not accept a landing.
        </p>
        <div
          data-companion-surface=""
          data-companion-surface-id="docs-demo-perch"
          className="border-border bg-card text-card-foreground rounded-md border p-5"
        >
          <p className={body}>
            Drop a companion on this panel to perch. Nested controls inherit the
            surface from this parent — you do not need to mark every child.
          </p>
          <button
            type="button"
            className={`border-border bg-background mt-3 inline-flex h-8 items-center rounded-md border px-3 text-sm ${focusRing}`}
          >
            Surface action
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="interactions" className={sectionHeading}>
          Interactions
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <strong className="font-medium">Spawn</strong> — click a companion
            card. A third of the same type is rejected with a short cue.
          </li>
          <li>
            <strong className="font-medium">React</strong> — click or tap an
            existing companion for a bounce/happy reaction (keyboard: Enter or
            Space).
          </li>
          <li>
            <strong className="font-medium">Drag</strong> — place on a declared
            surface or interactive control. Drop below 80% of the viewport
            height to puff out, stay gone for about 5 seconds, then respawn.
          </li>
          <li>
            <strong className="font-medium">Tusk</strong> — the elephant perch
            sentinel. Notices clicks on the surface it sits on (
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
              surface_action
            </code>
            ), and glances on scroll.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="learn" className={sectionHeading}>
          Learn more
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <Link href={companionInstallationPath} className={linkClass}>
              Installation
            </Link>{" "}
            — how companions will be added to a project.
          </li>
          <li>
            <Link href={companionJsonPath} className={linkClass}>
              companion.json
            </Link>{" "}
            — identity, animations, personality, capabilities, and interactions.
          </li>
          <li>
            <Link href={companionCustomPath} className={linkClass}>
              Custom Companion
            </Link>{" "}
            — future workflow for shipping your own companions.
          </li>
        </ul>
      </section>
    </DocsArticle>
  );
}
