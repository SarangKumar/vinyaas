import type { Metadata } from "next";

import { DocsArticle } from "@/components/docs-article";
import { FrameworkCard } from "@/components/installation/framework-card";
import {
  darkModeFrameworkHref,
  installationFrameworks,
} from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Dark Mode",
  description:
    "Add light and dark themes to Next.js, Vite, and React projects using the Vinyaas class strategy.",
  path: "/dark-mode",
});

export default function DarkModePage() {
  return (
    <DocsArticle
      title="Dark Mode"
      description="Choose your framework. Vinyaas theme tokens follow a dark class on the document root."
    >
      <section className="flex flex-col gap-5">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          Choose Your Framework
        </h2>
        <div className="grid w-full gap-4 sm:grid-cols-2">
          {installationFrameworks.map((framework) => (
            <FrameworkCard
              key={framework.id}
              framework={framework}
              href={darkModeFrameworkHref(framework.id)}
            />
          ))}
        </div>
      </section>
    </DocsArticle>
  );
}
