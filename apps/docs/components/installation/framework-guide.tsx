import Link from "next/link";
import type { ReactNode } from "react";

import { DocsArticle } from "@/components/docs-article";
import { FrameworkIconBadge } from "@/components/installation/framework-icon";
import { InstallCommand } from "@/components/install-command";
import {
  cliCommands,
  packageInstallCommands,
} from "@/components/package-managers";
import { focusRing } from "@/components/focus-ring";
import type {
  InstallationFramework,
  ProjectSetupOption,
} from "@/lib/installation/frameworks";
import {
  componentsJsonPath,
  componentsPath,
  themesPath,
} from "@/components/docs-nav";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const subsectionHeading =
  "text-foreground scroll-mt-8 text-base font-medium tracking-tight";
const body = "text-foreground text-base leading-7";

function BashBlock({ code }: { code: string }) {
  return (
    <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
      <code>{code}</code>
    </pre>
  );
}

function SetupCard({ setup }: { setup: ProjectSetupOption }) {
  return (
    <div
      id={`setup-${setup.id}`}
      className="border-border bg-card flex flex-col gap-4 rounded-xl border p-5"
    >
      <div className="flex flex-col gap-1.5">
        <h3 className={subsectionHeading}>{setup.title}</h3>
        <p className="text-muted-foreground text-sm leading-6">
          {setup.summary}
        </p>
      </div>
      {setup.preludeCommands ? (
        <BashBlock code={setup.preludeCommands} />
      ) : null}
      <InstallCommand commands={cliCommands("init")} />
      <ul className={`${body} list-disc space-y-2 pl-5 text-sm`}>
        {setup.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function FrameworkGuide({
  framework,
  children,
}: {
  framework: InstallationFramework;
  children?: ReactNode;
}) {
  const importExample = `import { Button } from "@/components/ui/button"`;

  return (
    <DocsArticle
      title={`Install Vinyaas with ${framework.name}`}
      description={`Install Vinyaas components in ${framework.name} projects with Tailwind CSS v4. Components are copied in as source you own and edit.`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <FrameworkIconBadge id={framework.id} />
        <div className="flex min-w-0 flex-col gap-3">
          <p className={body}>{framework.description}</p>
          <p className={body}>
            Choose another guide from{" "}
            <Link
              href="/installation"
              className={`text-primary underline underline-offset-4 ${focusRing}`}
            >
              Installation
            </Link>
            . The CLI package is on npm as{" "}
            <a
              href="https://www.npmjs.com/package/vinyaas"
              target="_blank"
              rel="noreferrer"
              className={`text-primary underline underline-offset-4 ${focusRing}`}
            >
              vinyaas
            </a>
            .
          </p>
          {children}
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 id="prerequisites" className={sectionHeading}>
          Prerequisites
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          {framework.prerequisites.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={body}>
          Optional: install the CLI into the project, or use <code>npx</code> /{" "}
          <code>pnpm dlx</code> without a local install.
        </p>
        <InstallCommand commands={packageInstallCommands("vinyaas")} />
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 id="setup" className={sectionHeading}>
            Choose your setup
          </h2>
          <p className={body}>
            Pick the path that matches your project. Every path ends with{" "}
            <code>vinyaas init</code>, which prepares theme tokens (preferred
            CSS: <code className="font-mono">{framework.preferredCss}</code>
            ), aliases, <code>components.json</code>, and utils when missing.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {framework.setups.map((setup) => (
            <SetupCard key={setup.id} setup={setup} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="add" className={sectionHeading}>
          Add components
        </h2>
        <p className={body}>
          After init, <code>vinyaas add</code> copies registry source into{" "}
          <code className="font-mono">components/ui/&lt;name&gt;/</code>. Files
          stay editable. Registry dependencies resolve automatically and only
          missing npm packages are installed. Pass multiple names to install
          together; use <code>--force</code> to overwrite existing files.
        </p>
        <InstallCommand commands={cliCommands("add button")} />
        <InstallCommand commands={cliCommands("add button card dialog")} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="import" className={sectionHeading}>
          Import components
        </h2>
        <p className={body}>Import the component directory after install:</p>
        <BashBlock code={importExample} />
        <p className={body}>Default file layout:</p>
        <BashBlock
          code={`components/ui/button/index.tsx
components/ui/toast/index.tsx
components/ui/toast/toast.css`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="discover" className={sectionHeading}>
          Discover components
        </h2>
        <p className={body}>
          Browse the catalog without writing files. Useful before you decide
          what to add. Each command accepts <code>--json</code>.
        </p>
        <InstallCommand commands={cliCommands("list")} />
        <InstallCommand commands={cliCommands("search input")} />
        <InstallCommand commands={cliCommands("info button")} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="continue" className={sectionHeading}>
          Continue building
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <Link
              href={componentsPath}
              className={`text-primary underline underline-offset-4 ${focusRing}`}
            >
              Components
            </Link>{" "}
            — previews, API, and install snippets.
          </li>
          <li>
            <Link
              href={componentsJsonPath}
              className={`text-primary underline underline-offset-4 ${focusRing}`}
            >
              components.json
            </Link>{" "}
            — style, aliases, and Tailwind path.
          </li>
          <li>
            <Link
              href={themesPath}
              className={`text-primary underline underline-offset-4 ${focusRing}`}
            >
              Themes
            </Link>{" "}
            — curated presets to try after install.
          </li>
        </ul>
      </section>
    </DocsArticle>
  );
}
