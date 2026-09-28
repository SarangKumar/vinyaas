import type { Metadata } from "next";

import { components } from "@/components/component-meta";
import { componentOgPath, siteOgImage } from "@/lib/og";

const site = "Vinyaas";

export function pageMetadata({
  title,
  description,
  image = siteOgImage,
}: {
  title: string;
  description: string;
  image?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} · ${site}`,
      description,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site}`,
      description,
      images: [image.url],
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
    image: {
      url: componentOgPath(component.slug),
      width: 1200,
      height: 630,
      alt: `${component.name} — Vinyaas`,
    },
  });
}
