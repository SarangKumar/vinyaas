import type { Metadata } from "next";

import { describe, expect, it } from "vitest";

import { components } from "@/components/component-meta";
import { componentPageMetadata, pageMetadata } from "@/lib/page-metadata";

describe("page metadata", () => {
  it("builds page titles and descriptions", () => {
    const meta = pageMetadata({
      title: "Installation",
      description: "Install the CLI.",
    }) as Metadata;

    expect(meta.title).toBe("Installation");
    expect(meta.description).toBe("Install the CLI.");
    expect(meta.openGraph).toMatchObject({
      title: "Installation · Vinyaas",
      description: "Install the CLI.",
    });
  });

  it("builds component metadata from the catalog", () => {
    const button = components.find((item) => item.slug === "button");
    const meta = componentPageMetadata("button") as Metadata;

    expect(button).toBeDefined();
    expect(meta.title).toBe("Button");
    expect(meta.description).toContain(button?.description ?? "missing");
    expect(meta.description).toContain("vinyaas add button");
  });
});
