import { DocsArticle } from "@/components/docs-article";
import { InstallCommand } from "@/components/install-command";
import {
  cliCommands,
  packageInstallCommands,
} from "@/components/package-managers";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function InstallationPage() {
  return (
    <DocsArticle
      title="Installation"
      description="Install the CLI, initialize a Next.js project, then add a component."
    >
      <section className="flex flex-col gap-6">
        <h2 id="cli" className={sectionHeading}>
          CLI
        </h2>
        <p className="text-body text-base leading-7">
          Add the CLI to a project, or run it without a global install.
        </p>
        <InstallCommand commands={packageInstallCommands("@vinyaas/cli")} />
        <InstallCommand commands={cliCommands("init")} />
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="project" className={sectionHeading}>
          Project
        </h2>
        <p className="text-body text-base leading-7">
          The project needs Node.js 20 or newer, Next.js, React, Tailwind CSS, a
          global stylesheet at{" "}
          <code className="font-mono">app/globals.css</code> or{" "}
          <code className="font-mono">src/app/globals.css</code>, an{" "}
          <code className="font-mono">@/*</code> path alias, and one package
          manager lockfile.
        </p>
        <InstallCommand commands={cliCommands("add button")} />
      </section>
    </DocsArticle>
  );
}
