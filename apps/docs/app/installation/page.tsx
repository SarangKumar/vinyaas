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
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="init" className={sectionHeading}>
          init
        </h2>
        <p className="text-body text-base leading-7">
          <code>vinyaas init</code> writes <code>components.json</code> and{" "}
          <code>lib/utils.ts</code>. It does not overwrite either file.
        </p>
        <InstallCommand commands={cliCommands("init")} />
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="add" className={sectionHeading}>
          add
        </h2>
        <p className="text-body text-base leading-7">
          <code>vinyaas add</code> copies one component into the project and
          installs only the packages that component declares.
        </p>
        <InstallCommand commands={cliCommands("add button")} />
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="registry" className={sectionHeading}>
          Registry
        </h2>
        <p className="text-body text-base leading-7">
          The new-york registry publishes one JSON item per component. The CLI
          requests that item and writes its source file.
        </p>
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
      </section>
    </DocsArticle>
  );
}
