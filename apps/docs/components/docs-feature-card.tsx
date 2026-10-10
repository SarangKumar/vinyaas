import Link from "next/link";

import {
  componentHref,
  currentVersion,
  newComponents,
} from "@/components/component-meta";
import { changelogPath, companionPath } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";

// Links here use prefetch={false}: the card lists ~25 routes on every page and
// prefetching them all would dominate the first-load traffic.

/** Companions introduced after the v1.2 Ember / Soul / Moss set. */
const NEW_COMPANIONS = [
  { id: "flint", name: "Flint" },
  { id: "bubble", name: "Bubble" },
  { id: "rime", name: "Rime" },
  { id: "jab", name: "Jab" },
  { id: "volt", name: "Volt" },
  { id: "drake", name: "Drake" },
] as const;

const inlineLink = `text-foreground underline underline-offset-4 ${focusRing} rounded-sm`;

/**
 * Compact right-rail card listing current-release components and companions.
 * Uses the same newComponents() source as nav indicators.
 */
export function DocsFeatureCard() {
  const newlyIntroduced = newComponents();

  return (
    <div
      data-docs-feature-card
      className="bg-secondary/70 hover:bg-secondary rounded-xl p-6 transition-colors"
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-foreground/80 text-[calc(0.875rem+2px)] leading-snug font-semibold">
          What&apos;s new
        </p>
        <p className="text-muted-foreground text-xs">v{currentVersion}</p>
      </div>
      {newlyIntroduced.length > 0 ? (
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          New components:{" "}
          {newlyIntroduced.map((component, index) => (
            <span key={component.slug}>
              {index > 0 ? ", " : null}
              <Link
                prefetch={false}
                href={componentHref(component.slug)}
                className={inlineLink}
              >
                {component.name}
              </Link>
            </span>
          ))}
          .
        </p>
      ) : (
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          No new components in this release.
        </p>
      )}
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        New companions:{" "}
        {NEW_COMPANIONS.map((companion, index) => (
          <span key={companion.id}>
            {index > 0 ? ", " : null}
            <Link
              prefetch={false}
              href={`${companionPath}/${companion.id}`}
              className={inlineLink}
            >
              {companion.name}
            </Link>
          </span>
        ))}
        .{" "}
        <Link prefetch={false} href={companionPath} className={inlineLink}>
          Meet them all
        </Link>
        .
      </p>
      <Link
        prefetch={false}
        href={changelogPath}
        className={`text-muted-foreground hover:text-foreground mt-2.5 inline-flex text-xs underline underline-offset-4 ${focusRing} rounded-sm`}
      >
        View changelog
      </Link>
    </div>
  );
}
