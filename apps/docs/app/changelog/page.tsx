import type { Metadata } from "next";
import { Suspense } from "react";

import { DocsArticle } from "@/components/docs-article";
import { pageMetadata } from "@/lib/page-metadata";

import {
  getChangelogVersion,
  latestChangelogVersionId,
  resolveChangelogVersionId,
} from "./changelog-data";
import { ChangelogVersionSelect } from "./changelog-version-select";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Release notes for Vinyaas through v1.3.0, including catalogs, accessibility, CLI, and registry updates.",
});

const heading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const subheading =
  "text-foreground scroll-mt-8 text-base font-medium tracking-tight";
const body = "text-foreground text-base leading-7";
const list = "text-foreground list-disc pl-5 text-base leading-7";

export default async function ChangelogPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.v) ? params.v[0] : params.v;
  const versionId = resolveChangelogVersionId(raw);
  const version = getChangelogVersion(versionId);

  return (
    <DocsArticle title="Changelog" description="What Vinyaas has shipped.">
      <section className="flex flex-col gap-4">
        <Suspense
          fallback={
            <div className="text-muted-foreground text-sm">
              Version {latestChangelogVersionId}
            </div>
          }
        >
          <ChangelogVersionSelect selectedId={versionId} />
        </Suspense>
      </section>
      <section
        className="flex flex-col gap-4"
        aria-labelledby="changelog-version-heading"
      >
        <h2 id="changelog-version-heading" className={heading}>
          {version.label}
        </h2>
        <p className={body}>{version.summary}</p>
        {version.sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h3
              id={`${version.id}-${section.title.toLowerCase()}`}
              className={subheading}
            >
              {section.title}
            </h3>
            <ul className={list}>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </DocsArticle>
  );
}
