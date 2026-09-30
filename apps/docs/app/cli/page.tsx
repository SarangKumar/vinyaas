import type { Metadata } from "next";
import Link from "next/link";

import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import { InstallCommand } from "@/components/install-command";
import {
  cliCommands,
  packageInstallCommands,
} from "@/components/package-managers";
import { installationPath } from "@/components/docs-nav";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "CLI",
  description:
    "Use the Vinyaas CLI to initialize projects, add components as source, and discover the catalog.",
  path: "/cli",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export default function CliPage() {
  return (
    <DocsArticle
      title="CLI"
      description="The vinyaas package on npm provides init, add, and discovery commands. Framework-specific setup lives on Installation."
    >
      <section className="flex flex-col gap-4">
        <h2 id="install" className={sectionHeading}>
          Install
        </h2>
        <p className={body}>
          Use the CLI via <code>npx</code> / <code>pnpm dlx</code>, or install
          it into the project. For framework create-app flows and project-state
          guidance, start at{" "}
          <Link
            href={installationPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Installation
          </Link>
          .
        </p>
        <InstallCommand commands={packageInstallCommands("vinyaas")} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="init" className={sectionHeading}>
          Initialize
        </h2>
        <p className={body}>
          Run from the project root. Init detects the framework when possible,
          finds a CSS entry, and creates <code>components.json</code>, theme
          tokens, aliases, and utils when missing. It does not overwrite an
          existing <code>components.json</code>.
        </p>
        <InstallCommand commands={cliCommands("init")} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="add" className={sectionHeading}>
          Add components
        </h2>
        <p className={body}>
          Copies registry source into{" "}
          <code className="font-mono">components/ui/&lt;name&gt;/</code>. Files
          stay editable. Registry dependencies resolve automatically; only
          missing npm packages are installed. Pass multiple names together; use{" "}
          <code>--force</code> to overwrite existing files.
        </p>
        <InstallCommand commands={cliCommands("add button")} />
        <InstallCommand commands={cliCommands("add button card dialog")} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="discover" className={sectionHeading}>
          Discover
        </h2>
        <p className={body}>
          Browse the catalog without writing files. Each command accepts{" "}
          <code>--json</code>.
        </p>
        <InstallCommand commands={cliCommands("list")} />
        <InstallCommand commands={cliCommands("search input")} />
        <InstallCommand commands={cliCommands("info button")} />
      </section>
    </DocsArticle>
  );
}
