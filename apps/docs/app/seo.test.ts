import { describe, expect, it } from "vitest";

import robots from "./robots";
import sitemap from "./sitemap";
import { components } from "@/components/component-meta";

describe("SEO routes", () => {
  it("exposes a sitemap covering static pages and components", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://vinyaas.vercel.app");
    expect(urls).toContain("https://vinyaas.vercel.app/components");
    expect(urls).toContain("https://vinyaas.vercel.app/installation");
    expect(urls).toContain("https://vinyaas.vercel.app/themes");
    expect(urls).toContain("https://vinyaas.vercel.app/typeset");
    expect(urls).not.toContain("https://vinyaas.vercel.app/playground");
    expect(urls).toContain("https://vinyaas.vercel.app/components/chart");
    expect(urls).toContain("https://vinyaas.vercel.app/components/drawer");
    expect(urls.length).toBeGreaterThanOrEqual(components.length + 7);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("allows crawlers and points to the sitemap", () => {
    const result = robots();

    expect(result.sitemap).toBe("https://vinyaas.vercel.app/sitemap.xml");
    expect(result.host).toBe("https://vinyaas.vercel.app");
    expect(result.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userAgent: "*",
          allow: "/",
          disallow: ["/og/", "/api/"],
        }),
      ]),
    );
  });
});
