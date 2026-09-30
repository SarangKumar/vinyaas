import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import { InstallCommand } from "@/components/install-command";
import { packageInstallCommands } from "@/components/package-managers";
import { installationPath } from "@/components/docs-nav";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "CLI",
  description:
    "Use the Vinyaas CLI (v1.2.0) to initialize projects, run doctor, add components as source, check install status, and discover the catalog by category.",
  path: "/cli",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export default function CliPage() {
  return (
    <DocsArticle
      title="CLI"
      description="The vinyaas package on npm (v1.2.0) provides setup, component, and discovery commands. Framework-specific setup lives on Installation."
    >
      <section className="flex flex-col gap-4">
        <h2 id="install" className={sectionHeading}>
          Install
        </h2>
        <p className={body}>
          Install the CLI into the project, or run it with <code>npx</code> /{" "}
          <code>pnpm dlx</code> without a local install. After install, invoke
          commands as <code>vinyaas &lt;command&gt;</code>. For framework
          create-app flows and project-state guidance, start at{" "}
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
        <h2 id="setup" className={sectionHeading}>
          Setup
        </h2>
        <p className={body}>
          Run from the project root. <code>vinyaas init</code> detects the
          framework when possible, finds a CSS entry, and creates{" "}
          <code>components.json</code>, theme tokens, aliases, and utils when
          missing. It does not overwrite an existing{" "}
          <code>components.json</code>.
        </p>
        <CodeBlock language="bash" code="vinyaas init" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="doctor" className={sectionHeading}>
          Doctor
        </h2>
        <p className={body}>
          <code>vinyaas doctor</code> validates an existing project without
          writing files. Run it after <code>init</code>, before adding
          components, or when installs fail unexpectedly.
        </p>
        <CodeBlock language="bash" code="vinyaas doctor" />
        <p className={body}>It checks:</p>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            Project config: <code>components.json</code>, aliases, and utils.
          </li>
          <li>Styling: Tailwind v4, global CSS, and theme tokens.</li>
          <li>
            Dependencies: <code>clsx</code>, <code>tailwind-merge</code>,{" "}
            <code>tailwindcss</code>, and <code>@tailwindcss/postcss</code> when
            applicable.
          </li>
          <li>Registry URL configuration and reachability.</li>
        </ul>
        <p className={body}>
          When something fails, the report includes an actionable fix—usually{" "}
          <code>vinyaas init</code>.
        </p>
        <CodeBlock
          language="text"
          code={`✓ Vinyaas doctor

Project
  ✓ components.json
  ✓ aliases configured
  ✓ utils file found

Styling
  ✓ Tailwind v4
  ✓ global CSS
  ✓ theme tokens

Dependencies
  ✓ clsx
  ✓ tailwind-merge
  ✓ tailwindcss
  ✓ @tailwindcss/postcss

Registry
  ✓ https://vinyaas.vercel.app/r

No issues found.`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="components" className={sectionHeading}>
          Components
        </h2>
        <p className={body}>
          Copies registry source into{" "}
          <code className="font-mono">components/ui/&lt;name&gt;/</code>. Files
          stay editable. Registry dependencies resolve automatically; only
          missing npm packages are installed. Pass multiple names together; use{" "}
          <code>--force</code> to overwrite existing files.
        </p>
        <CodeBlock language="bash" code="vinyaas add button" />
        <CodeBlock language="bash" code="vinyaas add button card" />
        <CodeBlock language="bash" code="vinyaas add button --yes" />
        <CodeBlock language="bash" code="vinyaas add button --dry-run" />
        <CodeBlock language="bash" code="vinyaas add button --force" />
        <CodeBlock language="bash" code="vinyaas add --category forms" />
        <CodeBlock language="bash" code="vinyaas add --category forms --yes" />
        <p className={body}>
          Pass component names for a precise install. Use{" "}
          <code>--category</code> to install every component in a registry group
          (forms, layout, navigation, feedback, data-display, typography,
          charts, utilities). Multi-component and category installs prompt for
          confirmation unless you pass <code>--yes</code>. Dry-run prints the
          plan without writing files.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="status" className={sectionHeading}>
          Status
        </h2>
        <p className={body}>
          <code>vinyaas status</code> lists components recorded in{" "}
          <code>.vinyaas/manifest.json</code> after successful installs. Vinyaas
          tracks installed components locally to support future update/remove
          workflows.
        </p>
        <CodeBlock language="bash" code="vinyaas status" />
        <CodeBlock language="bash" code="vinyaas status --json" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="discovery" className={sectionHeading}>
          Discovery
        </h2>
        <p className={body}>
          Browse the catalog without writing files. Components include an
          optional category shown in list, search, and info output. Filter with{" "}
          <code>--category</code> when you want one group.
        </p>
        <CodeBlock language="bash" code="vinyaas list" />
        <CodeBlock language="bash" code="vinyaas list --category forms" />
        <CodeBlock language="bash" code="vinyaas search button" />
        <CodeBlock
          language="bash"
          code="vinyaas search input --category forms"
        />
        <CodeBlock language="bash" code="vinyaas info button" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="output" className={sectionHeading}>
          Output
        </h2>
        <p className={body}>
          Discovery and doctor commands accept <code>--json</code> for
          machine-readable stdout. Status also supports <code>--json</code>.
        </p>
        <CodeBlock language="bash" code="vinyaas list --json" />
        <CodeBlock language="bash" code="vinyaas info button --json" />
        <CodeBlock language="bash" code="vinyaas doctor --json" />
        <CodeBlock language="bash" code="vinyaas status --json" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="version" className={sectionHeading}>
          Version
        </h2>
        <p className={body}>
          Print the installed CLI version (currently v1.2.0).
        </p>
        <CodeBlock language="bash" code="vinyaas --version" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="local-development" className={sectionHeading}>
          Local development
        </h2>
        <p className={body}>
          If you are testing the CLI directly from the repository after building
          it:
        </p>
        <CodeBlock
          language="bash"
          code="node packages/cli/dist/index.js init"
        />
        <p className={body}>
          The executable path already represents the <code>vinyaas</code>{" "}
          command, so do not add <code>vinyaas</code> after it.
        </p>
      </section>
    </DocsArticle>
  );
}
