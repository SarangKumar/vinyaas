import type { Metadata } from "next";

import { DocsArticle } from "@/components/docs-article";
import { FrameworkCard } from "@/components/installation/framework-card";
import { InstallCommand } from "@/components/install-command";
import {
  cliCommands,
  packageInstallCommands,
} from "@/components/package-managers";
import { installationFrameworks } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Installation",
  description:
    "Install the Vinyaas CLI globally, initialize a Tailwind CSS v4 project, and add components as source.",
  path: "/installation",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export default function InstallationPage() {
  return (
    <DocsArticle
      title="Installation"
      description="Install the CLI once globally, initialize your project, then pick a framework guide."
    >
      <section className="flex flex-col gap-4">
        <h2 id="install-cli" className={sectionHeading}>
          Install the CLI
        </h2>
        <p className={body}>
          Prefer a global install so you can run <code>vinyaas</code> from any
          project. Requires Node.js 20+.
        </p>
        <InstallCommand commands={packageInstallCommands("vinyaas")} />
        <p className={body}>
          One-off without installing: <code>npx vinyaas</code>,{" "}
          <code>pnpm dlx vinyaas</code>, <code>yarn dlx vinyaas</code>, or{" "}
          <code>bunx vinyaas</code>.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="cli" className={sectionHeading}>
          Initialize and add
        </h2>
        <p className={body}>
          From an existing React, Next.js, or Vite project with Tailwind CSS v4:
        </p>
        <InstallCommand commands={cliCommands("init")} />
        <InstallCommand commands={cliCommands("add button")} />
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>vinyaas init</code> detects the framework when possible and
            creates <code>components.json</code> / theme tokens / utils when
            missing.
          </li>
          <li>
            Run <code>vinyaas doctor</code> to validate without writing files.
          </li>
          <li>
            Then <code>vinyaas add</code> copies component source — see the{" "}
            <a
              href="/cli"
              className="text-primary underline underline-offset-4"
            >
              CLI guide
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="existing" className={sectionHeading}>
          Existing projects
        </h2>
        <p className={body}>
          Already have an app? Choose your framework below. Existing
          shadcn-style projects can keep their structure and run{" "}
          <code>vinyaas init</code> only when Vinyaas configuration is needed.
        </p>
      </section>

      <section className="flex flex-col gap-5">
        <h2 id="framework" className={sectionHeading}>
          Choose your framework
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
