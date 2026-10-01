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
          Companions are a separate Vinyaas feature from registry UI components.
          Each companion has its own metadata, pixel assets, animation sets, and
          interaction definitions. The runtime and install CLI are still ahead —
          this page is the product showcase.
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
