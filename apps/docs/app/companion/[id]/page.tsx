import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompanionDetailView } from "@/components/companion/companion-detail-view";
import { companionCatalog } from "@/components/companion/catalog";
import { DocsArticle } from "@/components/docs-article";
import { pageMetadata } from "@/lib/page-metadata";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return companionCatalog.map((entry) => ({ id: entry.meta.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = companionCatalog.find((item) => item.meta.id === id);
  if (!entry) {
    return pageMetadata({
      title: "Companion",
      description: "Companion detail",
      path: `/companion/${id}`,
    });
  }
  return pageMetadata({
    title: entry.meta.name,
    description: entry.meta.description,
    path: `/companion/${id}`,
  });
}

export default async function CompanionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const entry = companionCatalog.find((item) => item.meta.id === id);
  if (!entry) {
    notFound();
  }

  return (
    <DocsArticle
      title={entry.meta.name}
      description="Bond, unlocked moves, and type notes — a Pokédex-style companion sheet."
    >
      <CompanionDetailView companionId={id} />
    </DocsArticle>
  );
}
