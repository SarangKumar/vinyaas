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
    "Install the Vinyaas CLI, run init for Tailwind v4 setup, discover components, and add them as source.",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function InstallationPage() {
  return (
    <DocsArticle
      title="Installation"
      description="Install the CLI, prepare a Tailwind v4 project, discover components, then add them as source."
    >
      <section className="flex flex-col gap-6">
        <h2 id="cli" className={sectionHeading}>
          CLI
        </h2>
        <p className="text-foreground text-base leading-7">
          Vinyaas is a registry-driven component library. The CLI installs
          components as source into your project—not as a runtime package. Add
          the CLI to a project, or run it without a global install.
        </p>
        <InstallCommand commands={packageInstallCommands("vinyaas")} />
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="init" className={sectionHeading}>
          init
        </h2>
        <p className="text-foreground text-base leading-7">
          <code>vinyaas init</code> prepares a supported React, Next.js, or Vite
          project for Tailwind CSS v4. It configures theme tokens in your global
          stylesheet, import aliases, PostCSS when needed,{" "}
          <code>components.json</code>, and <code>lib/utils.ts</code>. Init is
          idempotent: safe to run again. It does not overwrite an existing{" "}
          <code>components.json</code> or an existing utils file. Tailwind v3 is
          not supported.
        </p>
        <InstallCommand commands={cliCommands("init")} />
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="add" className={sectionHeading}>
          add
        </h2>
        <p className="text-foreground text-base leading-7">
          <code>vinyaas add</code> installs one or more registry components,
          resolves registry dependencies, and installs only npm packages the
          project does not already declare. Files land under{" "}
          <code className="font-mono">
            components/ui/&lt;name&gt;/index.tsx
          </code>
          . Supporting CSS is installed beside that entry when the component
          needs it.
        </p>
        <InstallCommand commands={cliCommands("add button")} />
        <h3 className="text-foreground text-base font-medium">
          Install multiple components
        </h3>
        <p className="text-foreground text-base leading-7">
          Pass more than one name to install them together. Shared packages are
          installed once. Components that are already installed are skipped;
          missing ones still install. Existing files are not overwritten unless
          you pass <code>--force</code>.
        </p>
        <InstallCommand commands={cliCommands("add button card dialog")} />
        <InstallCommand commands={cliCommands("add button --force")} />
        <h3 className="text-foreground text-base font-medium">
          Install form components
        </h3>
        <p className="text-foreground text-base leading-7">
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
        <h2 id="discover" className={sectionHeading}>
          Discover
        </h2>
        <p className="text-foreground text-base leading-7">
          Browse and inspect the registry without writing files. Each command
          accepts <code>--json</code> for machine-readable stdout.
        </p>
        <h3 className="text-foreground text-base font-medium">list</h3>
        <p className="text-foreground text-base leading-7">
          <code>vinyaas list</code> prints available installable components from
          the registry catalog.
        </p>
        <InstallCommand commands={cliCommands("list")} />
        <InstallCommand commands={cliCommands("list --json")} />
        <h3 className="text-foreground text-base font-medium">search</h3>
        <p className="text-foreground text-base leading-7">
          <code>vinyaas search</code> matches component names and descriptions.
        </p>
        <InstallCommand commands={cliCommands("search input")} />
        <InstallCommand commands={cliCommands("search form --json")} />
        <h3 className="text-foreground text-base font-medium">info</h3>
        <p className="text-foreground text-base leading-7">
          <code>vinyaas info</code> shows files, dependencies, registry
          dependencies, and documentation for one component before you install
          it.
        </p>
        <InstallCommand commands={cliCommands("info button")} />
        <InstallCommand commands={cliCommands("info toast --json")} />
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="structure" className={sectionHeading}>
          Installed file structure
        </h2>
        <p className="text-foreground text-base leading-7">
          Default installs look like this:
        </p>
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>{`components/ui/button/index.tsx
components/ui/toast/index.tsx
components/ui/toast/toast.css`}</code>
        </pre>
        <p className="text-foreground text-base leading-7">
          Import the directory, for example{" "}
          <code>{`import { Button } from "@/components/ui/button"`}</code>.
        </p>
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="registry" className={sectionHeading}>
          Registry
        </h2>
        <p className="text-foreground text-base leading-7">
          The new-york registry publishes one JSON item per component, plus a
          style catalog used by <code>list</code> and <code>search</code>. The
          CLI requests those items and writes their source files.
        </p>
      </section>
      <section className="flex flex-col gap-6">
        <h2 id="project" className={sectionHeading}>
          Project
        </h2>
        <p className="text-foreground text-base leading-7">
          The project needs Node.js 20 or newer, React, Tailwind CSS v4, a
          global stylesheet, an <code className="font-mono">@/*</code> path
          alias, and one package manager lockfile. The same{" "}
          <code>vinyaas init</code> and <code>vinyaas add</code> workflow
          applies to React, Next.js, and Vite.
        </p>
        <h3 className="text-foreground text-base font-medium">React</h3>
        <p className="text-foreground text-base leading-7">
          A React project needs <code>react</code>, <code>react-dom</code>, and
          Tailwind v4. <code>vinyaas init</code> reads{" "}
          <code className="font-mono">app/globals.css</code>,{" "}
          <code className="font-mono">src/app/globals.css</code>, or{" "}
          <code className="font-mono">src/index.css</code>, then writes theme
          tokens and <code>components.json</code>.
        </p>
        <h3 className="text-foreground text-base font-medium">Next.js</h3>
        <p className="text-foreground text-base leading-7">
          Next.js uses the same commands. The CLI looks for the stylesheet in{" "}
          <code className="font-mono">app/globals.css</code> or{" "}
          <code className="font-mono">src/app/globals.css</code> and keeps the{" "}
          <code className="font-mono">@/*</code> alias from{" "}
          <code>tsconfig.json</code>.
        </p>
        <h3 className="text-foreground text-base font-medium">Vite</h3>
        <p className="text-foreground text-base leading-7">
          A Vite + React app uses the same init and add commands. Point Tailwind
          at <code className="font-mono">src/index.css</code> and keep{" "}
          <code className="font-mono">@/*</code> in <code>tsconfig.json</code>{" "}
          or <code>jsconfig.json</code>.
        </p>
      </section>
    </DocsArticle>
  );
}
