import type { Metadata } from "next";

import { pageMetadata } from "@/lib/page-metadata";

import { TypesetPlayground } from "./typeset-playground";

export const metadata: Metadata = pageMetadata({
  title: "Typeset",
  description:
    "Experiment with measure, fonts, size, leading, and flow on realistic Markdown-style content. Typography stays scoped to this playground.",
  path: "/typeset",
});

export default function TypesetPage() {
  return (
    <article data-docs-article data-page="typeset">
      <TypesetPlayground />
    </article>
  );
}
