import type { Metadata } from "next";

import { pageMetadata } from "@/lib/page-metadata";

import { TypesetPlayground } from "../typeset-playground";

export const metadata: Metadata = pageMetadata({
  title: "Typeset playground",
  description:
    "Experiment with measure, fonts, size, leading, and flow on Markdown-style content. Changes stay scoped to this playground.",
  path: "/typeset/playground",
});

export default function TypesetPlaygroundPage() {
  return (
    <article data-docs-article data-page="typeset-playground">
      <TypesetPlayground />
    </article>
  );
}
