import type { Metadata } from "next";

import { describe, expect, it } from "vitest";

import { components } from "@/components/component-meta";
import { componentOgPath, findComponent, siteOgImage } from "@/lib/og";
import { componentPageMetadata, pageMetadata } from "@/lib/page-metadata";

describe("page metadata", () => {
  it("builds page titles and descriptions with the site OG image", () => {
    const meta = pageMetadata({
      title: "Installation",
      description: "Install the CLI.",
    }) as Metadata;

    expect(meta.title).toBe("Installation");
    expect(meta.description).toBe("Install the CLI.");
    expect(meta.openGraph).toMatchObject({
      title: "Installation · Vinyaas",
      description: "Install the CLI.",
      siteName: "Vinyaas",
      locale: "en_US",
      images: [siteOgImage],
    });
    expect(meta.robots).toMatchObject({
      index: true,
      follow: true,
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      images: [siteOgImage.url],
    });
  });

  it("adds canonical and Open Graph URLs when a path is provided", () => {
    const meta = pageMetadata({
      title: "Themes",
      description: "Theme playground.",
      path: "/themes",
    }) as Metadata;

    expect(meta.alternates).toMatchObject({ canonical: "/themes" });
    expect(meta.openGraph).toMatchObject({
      url: "/themes",
      title: "Themes · Vinyaas",
    });
  });

  it("builds component metadata with a per-component OG image", () => {
    const button = components.find((item) => item.slug === "button");
    const meta = componentPageMetadata("button") as Metadata;

    expect(button).toBeDefined();
    expect(meta.title).toBe("Button");
    expect(meta.description).toContain(button?.description ?? "missing");
    expect(meta.description).toContain("vinyaas add button");
    expect(meta.openGraph).toMatchObject({
      images: [
        {
          url: componentOgPath("button"),
          width: 1200,
          height: 630,
          alt: "Button — Vinyaas",
        },
      ],
      url: "/components/button",
    });
    expect(meta.alternates).toMatchObject({
      canonical: "/components/button",
    });
    expect(findComponent("button")?.name).toBe("Button");
  });
});
