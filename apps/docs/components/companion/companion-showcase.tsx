import Link from "next/link";

import { CompanionCard } from "@/components/companion/companion-card";
import { companionCatalog } from "@/components/companion/catalog";
import {
  companionCustomPath,
  companionInstallationPath,
  companionJsonPath,
  companionPath,
} from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";

const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

/**
 * Compact homepage teaser that points to the Companion docs area.
 */
export function CompanionShowcase() {
  return (
    <section
      data-companion-showcase
      aria-labelledby="companions-heading"
      className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-14 text-center sm:pb-16"
    >
      <h2
        id="companions-heading"
        className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl"
      >
        Meet Vinyaas Companions
      </h2>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-6 sm:text-base sm:leading-7">
        Tiny customizable companions that bring your workspace to life.
      </p>

      <div
        data-companion-card-grid
        className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {companionCatalog.map((entry) => (
          <CompanionCard key={entry.meta.id} entry={entry} size={112} />
        ))}
      </div>

      <p className="text-muted-foreground mt-6 text-sm">
        Explore{" "}
        <Link href={companionPath} className={linkClass}>
          Companions
        </Link>
        ,{" "}
        <Link href={companionInstallationPath} className={linkClass}>
          installation
        </Link>
        ,{" "}
        <Link href={companionJsonPath} className={linkClass}>
          companion.json
        </Link>
        , and{" "}
        <Link href={companionCustomPath} className={linkClass}>
          custom companions
        </Link>
        .
      </p>
    </section>
  );
}
