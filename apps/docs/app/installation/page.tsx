import type { Metadata } from "next";

import { DocsArticle } from "@/components/docs-article";
import { InstallCommand } from "@/components/install-command";
import {
  cliCommands,
  packageInstallCommands,
} from "@/components/package-managers";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Installation",
  description:
    "Install the Vinyaas CLI, initialize a React, Next.js, or Vite project, and add components as source.",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function InstallationPage() {
  return (
    <DocsArticle
      title="Installation"
      description="Install the CLI, initialize a React, Next.js, or Vite project, then add a component."
    >
      <section className="flex flex-col gap-6">
        <h2 id="cli" className={sectionHeading}>
          CLI
        </h2>
        <p className="text-body text-base leading-7">
          Add the CLI to a project, or run it without a global install.
        </p>
        <InstallCommand commands={packageInstallCommands("vinyaas")} />
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
          <code>vinyaas add</code> copies a component into the project and
          installs only the packages that component declares.
        </p>
        <InstallCommand commands={cliCommands("add button")} />
        <h3 className="text-foreground text-base font-medium">
          Install multiple components
        </h3>
        <p className="text-body text-base leading-7">
          Pass more than one name to install them together. Shared packages are
          installed once.
        </p>
        <InstallCommand commands={cliCommands("add button card badge")} />
        <h3 className="text-foreground text-base font-medium">
          Install form components
        </h3>
        <p className="text-body text-base leading-7">
          These primitives cover a form and the status around it: fields,
          choices, a slider, a spinner, and a skeleton. Add them in one command.
        </p>
        <InstallCommand
          commands={cliCommands(
            "add button checkbox radio-group input textarea label input-group native-select slider spinner skeleton",
          )}
        />
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
          The project needs Node.js 20 or newer, React, Tailwind CSS, a global
          stylesheet, an <code className="font-mono">@/*</code> path alias, and
          one package manager lockfile. The same <code>vinyaas init</code> and{" "}
          <code>vinyaas add</code> workflow applies to React, Next.js, and Vite.
        </p>
        <h3 className="text-foreground text-base font-medium">React</h3>
        <p className="text-body text-base leading-7">
          A React project needs <code>react</code>, <code>react-dom</code>, and
          Tailwind. <code>vinyaas init</code> reads{" "}
          <code className="font-mono">app/globals.css</code>,{" "}
          <code className="font-mono">src/app/globals.css</code>, or{" "}
          <code className="font-mono">src/index.css</code>, then writes{" "}
          <code>components.json</code>.
        </p>
        <h3 className="text-foreground text-base font-medium">Next.js</h3>
        <p className="text-body text-base leading-7">
          Next.js uses the same commands. The CLI looks for the stylesheet in{" "}
          <code className="font-mono">app/globals.css</code> or{" "}
          <code className="font-mono">src/app/globals.css</code> and keeps the{" "}
          <code className="font-mono">@/*</code> alias from{" "}
          <code>tsconfig.json</code>.
        </p>
        <h3 className="text-foreground text-base font-medium">Vite</h3>
        <p className="text-body text-base leading-7">
          A Vite + React app uses the same init and add commands. Point Tailwind
          at <code className="font-mono">src/index.css</code> and keep{" "}
          <code className="font-mono">@/*</code> in <code>tsconfig.json</code>{" "}
          or <code>jsconfig.json</code>.
        </p>
      </section>
    </DocsArticle>
  );
}
