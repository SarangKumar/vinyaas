import type { MetadataRoute } from "next";

import { components } from "@/components/component-meta";
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
          : path === "/themes" ||
              path === "/typeset" ||
              path === "/typeset/playground" ||
              path === "/theming"
            ? 0.9
            : 0.8,
    })),
    ...components.map((component) => ({
      url: `${siteUrl}/components/${component.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
