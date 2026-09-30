import type { Metadata } from "next";

import { DocsArticle } from "@/components/docs-article";
import { FrameworkCard } from "@/components/installation/framework-card";
import { installationFrameworks } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Install Vinyaas",
  description:
    "Install Vinyaas components in Next.js, React, and Vite projects with Tailwind CSS v4.",
  path: "/installation",
});

export default function InstallationPage() {
  return (
    <DocsArticle
      title="Install Vinyaas"
      description="Choose your framework, then follow the matching guide. The CLI installs components as source into your project."
    >
      <section className="flex flex-col gap-5">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          Choose your framework
        </h2>
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          {installationFrameworks.map((framework) => (
            <FrameworkCard key={framework.id} framework={framework} />
          ))}
        </div>
      </section>
    </DocsArticle>
  );
}
