import type { Metadata } from "next";
import Link from "next/link";

import { CompanionCard } from "@/components/companion/companion-card";
import { companionCatalog } from "@/components/companion/catalog";
import { DocsArticle } from "@/components/docs-article";
import {
  companionAnimationsPath,
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
          Spawn one companion of each type onto the page. Use{" "}
          <strong className="font-medium">Know more</strong> for a Pokédex-style
          sheet (Bond, unlocked moves, type). Fatal falls puff the companion out
          — Bond stats stay in local storage.
        </p>
        <div
          data-companion-card-grid
          className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          {companionCatalog.map((entry) => (
            <CompanionCard key={entry.meta.id} entry={entry} size={112} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="surfaces" className={sectionHeading}>
          Landing surfaces
        </h2>
        <p className={body}>
          Companions land on declared surfaces and interactive chrome — buttons,
          selects, code blocks, cards, and playground panels. Dropping from more
          than 70vh above the surface beneath causes a fall, then a puff on
          impact. Perched companions scroll with their surface and tip off when
          it hits the top of the viewport.
        </p>
        <div
          data-companion-surface=""
          data-companion-surface-id="docs-demo-perch"
          className="border-border bg-card text-card-foreground rounded-md border p-5"
        >
          <p className={body}>
            Drop a companion on this panel to perch. Nested controls inherit the
            surface from this parent.
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
            <strong className="font-medium">Spawn</strong> — primary button on
            each card (one of each type on screen).
          </li>
          <li>
            <strong className="font-medium">Know more</strong> — opens the
            companion sheet with Bond and move unlocks (Ember first).
          </li>
          <li>
            <strong className="font-medium">Idle</strong> — after ~30 seconds
            without interaction, ambient idle/sleep may fire.
          </li>
          <li>
            <strong className="font-medium">Flint</strong> — rock-type pebble
            with a spark still stuck in its cracks.
          </li>
          <li>
            <strong className="font-medium">Bubble</strong> — water-type float
            with a shiny soap-bubble look.
          </li>
          <li>
            <strong className="font-medium">Rime</strong> — ice-type fox with a
            glittering tail tip.
          </li>
          <li>
            <strong className="font-medium">Jab</strong> — fighting-type spar
            buddy in red gloves.
          </li>
          <li>
            <strong className="font-medium">Volt</strong> — electric-type mouse
            with spark cheeks.
          </li>
        </ul>
        <p className={body}>
          Full clip and move tables live on{" "}
          <Link href={companionAnimationsPath} className={linkClass}>
            Animations
          </Link>
          .
        </p>
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
