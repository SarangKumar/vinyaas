import Link from "next/link";
import type { ReactNode } from "react";

import { DocsArticle } from "@/components/docs-article";
import { InstallCommand } from "@/components/install-command";
import {
  cliCommands,
  packageInstallCommands,
} from "@/components/package-managers";
import { focusRing } from "@/components/focus-ring";
import type { InstallationFramework } from "@/lib/installation/frameworks";
import {
  componentsJsonPath,
  componentsPath,
  themesPath,
} from "@/components/docs-nav";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

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

      <section className="flex flex-col gap-4">
        <h2 id="prerequisites" className={sectionHeading}>
          Prerequisites
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          {framework.prerequisites.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {children}
        <p className={body}>
          Optional: install the CLI into the project, or use <code>npx</code> /{" "}
          <code>pnpm dlx</code> without a local install.
        </p>
        <InstallCommand commands={packageInstallCommands("vinyaas")} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="initialize" className={sectionHeading}>
          Initialize Vinyaas
        </h2>
        <p className={body}>
          <code>vinyaas init</code> prepares the project for the registry. It
          writes theme tokens into your global stylesheet (preferred path:{" "}
          <code className="font-mono">{framework.preferredCss}</code>
          ), configures aliases and PostCSS when needed, creates{" "}
          <code>components.json</code> when missing, and adds{" "}
          <code>lib/utils.ts</code> when missing. Init is idempotent and does
          not overwrite an existing <code>components.json</code> or utils file.
        </p>
        <InstallCommand commands={cliCommands("init")} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="add" className={sectionHeading}>
          Add components
        </h2>
        <p className={body}>
          <code>vinyaas add</code> copies registry source into{" "}
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
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>{importExample}</code>
        </pre>
        <p className={body}>Default file layout:</p>
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>{`components/ui/button/index.tsx
components/ui/toast/index.tsx
components/ui/toast/toast.css`}</code>
        </pre>
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
