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
      images: [siteOgImage],
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      images: [siteOgImage.url],
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
    });
    expect(findComponent("button")?.name).toBe("Button");
  });
});
