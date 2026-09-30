import type { Metadata } from "next";

import { components } from "@/components/component-meta";
import { componentOgPath, siteOgImage } from "@/lib/og";
import { siteName } from "@/lib/site";

export function pageMetadata({
  title,
  description,
  path,
  image = siteOgImage,
}: {
  title: string;
  description: string;
  /** Site path used for canonical + Open Graph URL (e.g. `/themes`). */
  path?: string;
  image?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
}): Metadata {
  const canonical = path ?? undefined;

  return {
    title,
    description,
    ...(canonical
      ? {
          alternates: {
            canonical,
          },
        }
      : {}),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: `${title} · ${siteName}`,
      description,
      type: "website",
      siteName,
      locale: "en_US",
      ...(path ? { url: path } : {}),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteName}`,
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
    path: `/components/${component.slug}`,
    image: {
      url: componentOgPath(component.slug),
      width: 1200,
      height: 630,
      alt: `${component.name} — ${siteName}`,
    },
  });
}
