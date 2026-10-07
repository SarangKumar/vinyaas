import type { MetadataRoute } from "next";

import { components } from "@/components/component-meta";
import { companionCatalog } from "@/components/companion/catalog";
import {
  darkModeFrameworkPaths,
  installationFrameworkPaths,
} from "@/lib/installation/frameworks";
import { siteUrl } from "@/lib/site";

const staticRoutes = [
  "/",
  "/introduction",
  "/installation",
  ...installationFrameworkPaths(),
  "/cli",
  "/catalogs",
  "/accessibility",
  "/companion",
  "/companion/installation",
  "/companion/configuration",
  "/companion/animations",
  "/companion/interactions",
  "/companion/custom",
  "/companion/examples",
  "/companion/gallery",
  "/components",
  "/components-json",
  "/theming",
  "/themes",
  "/typeset",
  "/typeset/playground",
  "/package-import",
  "/dark-mode",
  ...darkModeFrameworkPaths(),
  "/changelog",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority:
        path === "/"
          ? 1
          : path === "/installation" ||
              path === "/introduction" ||
              path === "/components"
            ? 0.95
            : path === "/themes" ||
                path === "/typeset" ||
                path === "/typeset/playground" ||
                path === "/theming" ||
                path === "/cli"
              ? 0.9
              : 0.8,
    })),
    ...components.map((component) => ({
      url: `${siteUrl}/components/${component.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...companionCatalog.map((entry) => ({
      url: `${siteUrl}/companion/${entry.meta.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
