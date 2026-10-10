import type { Metadata } from "next";
import { Suspense } from "react";

import { DocsArticle } from "@/components/docs-article";
import { pageMetadata } from "@/lib/page-metadata";

import {
  getChangelogVersion,
  latestChangelogVersionId,
} from "./changelog-data";
import { ChangelogVersionContent, ChangelogView } from "./changelog-view";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Release notes for Vinyaas through v1.4.0, including catalogs, accessibility, CLI, and registry updates.",
});

/**
 * Static page: the latest release is prerendered as the Suspense fallback and
 * ChangelogView swaps in the `?v=` release on the client.
 */
export default function ChangelogPage() {
  return (
    <DocsArticle title="Changelog" description="What Vinyaas has shipped.">
      <Suspense
        fallback={
          <ChangelogVersionContent
            version={getChangelogVersion(latestChangelogVersionId)}
          />
        }
      >
        <ChangelogView />
      </Suspense>
    </DocsArticle>
  );
}
