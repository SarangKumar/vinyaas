import Link from "next/link";

import {
  componentHref,
  currentVersion,
  newComponents,
} from "@/components/component-meta";
import { changelogPath } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";

/**
 * Compact right-rail card listing current-release components.
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
      <p className="text-muted-foreground mt-1.5 text-sm leading-snug">
        {newlyIntroduced.length} components shipped in this release.
      </p>
      {newlyIntroduced.length > 0 ? (
        <ul className="mt-2.5 flex flex-col gap-1">
          {newlyIntroduced.map((component) => (
            <li key={component.slug}>
              <Link
                href={componentHref(component.slug)}
                className={`text-muted-foreground hover:text-foreground/80 inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline ${focusRing} rounded-sm`}
              >
                <span
                  data-nav-indicator="new"
                  className="bg-foreground/70 size-1.5 shrink-0 rounded-full"
                  aria-hidden="true"
                />
                {component.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href={changelogPath}
        className={`text-muted-foreground hover:text-foreground mt-2.5 inline-flex text-xs underline-offset-4 hover:underline ${focusRing} rounded-sm`}
      >
        View changelog
      </Link>
    </div>
  );
}
