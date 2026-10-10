"use client";

import { useSearchParams } from "next/navigation";

import {
  getChangelogVersion,
  resolveChangelogVersionId,
  type ChangelogVersion,
} from "./changelog-data";
import { ChangelogVersionSelect } from "./changelog-version-select";

const heading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const subheading =
  "text-foreground scroll-mt-8 text-base font-medium tracking-tight";
const body = "text-foreground text-base leading-7";
const list = "text-foreground list-disc pl-5 text-base leading-7";

/** One release's summary and sections. Pure markup, safe as a static fallback. */
export function ChangelogVersionContent({
  version,
}: {
  version: ChangelogVersion;
}) {
  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby="changelog-version-heading"
    >
      <h2 id="changelog-version-heading" className={heading}>
        {version.label}
      </h2>
      <p className={body}>{version.summary}</p>
      {version.sections.map((section) => {
        const sectionId = `${version.id}-${section.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`;
        return (
          <div key={section.title} className="flex flex-col gap-3">
            <h3 id={sectionId} className={subheading}>
              {section.title}
            </h3>
            <ul className={list}>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

/**
 * Reads `?v=` in the browser so the page itself stays static (no server
 * function per view). Unknown or missing versions fall back to the latest.
 */
export function ChangelogView() {
  const searchParams = useSearchParams();
  const versionId = resolveChangelogVersionId(
    searchParams.get("v") ?? undefined,
  );

  return (
    <>
      <section className="flex flex-col gap-4">
        <ChangelogVersionSelect selectedId={versionId} />
      </section>
      <ChangelogVersionContent version={getChangelogVersion(versionId)} />
    </>
  );
}
