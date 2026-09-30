import type { Metadata } from "next";

import { DocsArticle } from "@/components/docs-article";
import { FrameworkCard } from "@/components/installation/framework-card";
import { InstallCommand } from "@/components/install-command";
import { cliCommands } from "@/components/package-managers";
import { installationFrameworks } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Installation",
  description:
    "Install Vinyaas components in Next.js, React, and Vite projects with Tailwind CSS v4.",
  path: "/installation",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export default function InstallationPage() {
  return (
    <DocsArticle
      title="Installation"
      description="Scaffold with the CLI, then choose a framework guide for fresh, existing, or shadcn-style projects."
    >
      <section className="flex flex-col gap-4">
        <h2 id="cli" className={sectionHeading}>
          Use the CLI
        </h2>
        <p className={body}>
          Use the CLI to scaffold and configure a Vinyaas project directly from
          your terminal.
        </p>
        <InstallCommand commands={cliCommands("init")} />
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>vinyaas init</code> detects the project framework when
            possible.
          </li>
          <li>Configures Tailwind CSS v4 theme tokens in your CSS entry.</li>
          <li>
            Creates <code>components.json</code> when missing.
          </li>
          <li>Installs required utility dependencies when needed.</li>
          <li>
            Prepares the project for <code>vinyaas add</code>.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="existing" className={sectionHeading}>
          Existing Project
        </h2>
        <p className={body}>
          If you already have an application, select your framework below and
          follow the framework-specific setup. Existing shadcn-style projects
          can keep their current structure and run <code>vinyaas init</code>{" "}
          when you need Vinyaas configuration.
        </p>
        <InstallCommand commands={cliCommands("init")} />
      </section>

      <section className="flex flex-col gap-5">
        <h2 id="framework" className={sectionHeading}>
          Choose Your Framework
        </h2>
        <div className="grid w-full gap-4 sm:grid-cols-2">
          {installationFrameworks.map((framework) => (
            <FrameworkCard key={framework.id} framework={framework} />
          ))}
        </div>
      </section>
    </DocsArticle>
  );
}
