import type { Metadata } from "next";

import { pageMetadata } from "@/lib/page-metadata";

import { ThemesPlayground } from "./themes-playground";

export const metadata: Metadata = pageMetadata({
  title: "Themes",
  description:
    "Preview curated Vinyaas theme presets and border radius across real UI compositions. Theme changes stay scoped to this playground.",
  path: "/themes",
});

export default function ThemesPage() {
  return (
    <article data-docs-article data-page="themes">
      <ThemesPlayground />
    </article>
  );
}
