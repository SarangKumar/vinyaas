import type { Metadata } from "next";

import { components } from "@/components/component-meta";

const site = "Vinyaas";

export function pageMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} · ${site}`,
      description,
      type: "website",
    },
  };
}

export function componentPageMetadata(slug: string): Metadata {
  const component = components.find((item) => item.slug === slug);

  if (!component) {
    return pageMetadata({
      title: "Component",
      description: "Installable Vinyaas component documentation.",
    });
  }

  return pageMetadata({
    title: component.name,
    description: `${component.description} Install with vinyaas add ${component.slug}.`,
  });
}
