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
    expect(urls).toContain("https://vinyaas.vercel.app/installation/nextjs");
    expect(urls).toContain("https://vinyaas.vercel.app/installation/vite");
    expect(urls).toContain("https://vinyaas.vercel.app/installation/react");
    expect(urls).toContain("https://vinyaas.vercel.app/cli");
    expect(urls).toContain("https://vinyaas.vercel.app/companion");
    expect(urls).toContain("https://vinyaas.vercel.app/companion/installation");
    expect(urls).toContain(
      "https://vinyaas.vercel.app/companion/configuration",
    );
    expect(urls).toContain("https://vinyaas.vercel.app/companion/custom");
    expect(urls).toContain("https://vinyaas.vercel.app/catalogs");
    expect(urls).toContain("https://vinyaas.vercel.app/accessibility");
    expect(urls).toContain("https://vinyaas.vercel.app/companion/animations");
    expect(urls).toContain("https://vinyaas.vercel.app/companion/interactions");
    expect(urls).toContain("https://vinyaas.vercel.app/companion/examples");
    expect(urls).toContain("https://vinyaas.vercel.app/companion/gallery");
    expect(urls).toContain("https://vinyaas.vercel.app/companion/nyx");
    expect(urls).toContain("https://vinyaas.vercel.app/theming");
    expect(urls).toContain("https://vinyaas.vercel.app/themes");
    expect(urls).toContain("https://vinyaas.vercel.app/package-import");
    expect(urls).toContain("https://vinyaas.vercel.app/dark-mode");
    expect(urls).toContain("https://vinyaas.vercel.app/dark-mode/nextjs");
    expect(urls).toContain("https://vinyaas.vercel.app/typeset");
    expect(urls).toContain("https://vinyaas.vercel.app/typeset/playground");
    expect(urls).not.toContain("https://vinyaas.vercel.app/playground");
    expect(urls).toContain("https://vinyaas.vercel.app/components/chart");
    expect(urls).toContain("https://vinyaas.vercel.app/components/drawer");
    expect(urls.length).toBeGreaterThanOrEqual(components.length + 10);
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
