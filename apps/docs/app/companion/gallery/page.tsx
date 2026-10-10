import type { Metadata } from "next";
import Link from "next/link";

import { CompanionCard } from "@/components/companion/companion-card";
import { companionCatalog } from "@/components/companion/catalog";
import { DocsArticle } from "@/components/docs-article";
import { companionPath } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Companion Gallery",
  description:
    "Every built-in Vinyaas companion — spawn, inspect Bond, and try type badges.",
  path: "/companion/gallery",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

export default function CompanionGalleryPage() {
  return (
    <DocsArticle
      title="Gallery"
      description="All built-in companions in one place. One instance per type on screen."
    >
      <section className="flex flex-col gap-4">
        <h2 id="roster" className={sectionHeading}>
          Roster
        </h2>
        <p className={body}>
          Prefer the guided intro? Start at{" "}
          <Link href={companionPath} className={linkClass}>
            Companions
          </Link>
          . Here you can spawn any species — including Nyx (dark).
        </p>
        <div
          data-companion-card-grid
          className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {companionCatalog.map((entry) => (
            <CompanionCard key={entry.meta.id} entry={entry} size={96} />
          ))}
        </div>
      </section>
    </DocsArticle>
  );
}
