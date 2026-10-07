import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import { InstallCommand } from "@/components/install-command";
import { packageInstallCommands } from "@/components/package-managers";
import { componentsJsonPath, installationPath } from "@/components/docs-nav";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "CLI",
  description:
    "Vinyaas CLI v1.3.1: init, doctor, add by name/catalog/category, catalogs, status, list, search, and info.",
  path: "/cli",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export default function CliPage() {
  return (
    <DocsArticle
      title="CLI"
      description="The vinyaas package on npm (v1.3.1) installs UI as editable source. Framework create-app flows live on Installation."
    >
      <section className="flex flex-col gap-4">
        <h2 id="overview" className={sectionHeading}>
          What the CLI is
        </h2>
        <p className={body}>
          Vinyaas is registry-driven. The CLI copies component source into your
          project, installs missing npm dependencies, and leaves the files
          editable. Configuration for aliases and Tailwind paths lives in{" "}
          <Link
            href={componentsJsonPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            components.json
          </Link>
          . Framework-specific scaffolding is covered under{" "}
          <Link
            href={installationPath}
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Installation
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="install-cli" className={sectionHeading}>
          Install the CLI
        </h2>
        <p className={body}>
          Install globally (recommended), then invoke{" "}
          <code>vinyaas &lt;command&gt;</code>. Or run once with{" "}
          <code>npx</code> / <code>pnpm dlx</code> / <code>yarn dlx</code> /{" "}
          <code>bunx</code>. Requires Node.js 20+.
        </p>
        <InstallCommand commands={packageInstallCommands("vinyaas")} />
        <CodeBlock language="bash" code="vinyaas --version" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="setup" className={sectionHeading}>
          Setup
        </h2>
        <h3
          id="init"
          className="text-foreground scroll-mt-8 text-base font-semibold"
        >
          init
        </h3>
        <p className={body}>
          Run from the project root. <code>vinyaas init</code> detects the
          framework when possible, finds a CSS entry, and creates{" "}
          <code>components.json</code>, theme tokens, aliases, and utils when
          missing. It is safe to re-run: it does not overwrite an existing{" "}
          <code>components.json</code> or utils file. Existing shadcn-style
          projects can keep their layout and run init only when Vinyaas config
          is needed.
        </p>
        <CodeBlock language="bash" code="vinyaas init" />
        <CodeBlock language="bash" code="vinyaas init --yes" />

        <h3
          id="doctor"
          className="text-foreground scroll-mt-8 text-base font-semibold"
        >
          doctor
        </h3>
        <p className={body}>
          <code>vinyaas doctor</code> validates an existing project without
          writing files. Use it after init, before adding components, or when
          installs fail. It reports grouped checks and suggested fixes; it does
          not apply fixes automatically.
        </p>
        <CodeBlock language="bash" code="vinyaas doctor" />
        <CodeBlock language="bash" code="vinyaas doctor --json" />
        <p className={body}>Groups:</p>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <strong>Project</strong> — <code>components.json</code>, aliases,
            utils.
          </li>
          <li>
            <strong>Styling</strong> — Tailwind v4, global CSS, theme tokens.
          </li>
          <li>
            <strong>Dependencies</strong> — <code>clsx</code>,{" "}
            <code>tailwind-merge</code>, <code>tailwindcss</code>, and{" "}
            <code>@tailwindcss/postcss</code> when applicable.
          </li>
          <li>
            <strong>Registry</strong> — configured registry URL and
            reachability.
          </li>
        </ul>
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
        <h2 id="install" className={sectionHeading}>
          Install
        </h2>
        <h3
          id="add"
          className="text-foreground scroll-mt-8 text-base font-semibold"
        >
          add
        </h3>
        <p className={body}>
          Copies registry source into{" "}
          <code className="font-mono">components/ui/&lt;name&gt;/</code>. Files
          stay editable. Registry dependencies resolve automatically; only
          missing npm packages are installed. Successful installs update{" "}
          <code>.vinyaas/manifest.json</code>.
        </p>
        <CodeBlock language="bash" code="vinyaas add button" />
        <CodeBlock language="bash" code="vinyaas add button card badge" />
        <CodeBlock language="bash" code="vinyaas add button card --yes" />

        <h3
          id="catalog-install"
          className="text-foreground scroll-mt-8 text-base font-semibold"
        >
          Catalog installation
        </h3>
        <p className={body}>
          Catalog installs require an explicit <code>--catalog</code> option.
          Catalogs are owned by the registry (see{" "}
          <Link
            href="/catalogs"
            className={`text-primary underline underline-offset-4 ${focusRing}`}
          >
            Catalogs
          </Link>
          ). The CLI lists the members, asks for confirmation with{" "}
          <code>[Y/n]</code> (default Yes), and only then installs through the
          same component pipeline. Pass <code>--yes</code> to skip the prompt.
          Declining cancels with no file changes. A bare{" "}
          <code>vinyaas add form</code> never installs a catalog — it looks for
          a component named <code>form</code> and, if missing, suggests{" "}
          <code>--catalog form</code>.
        </p>
        <CodeBlock language="bash" code="vinyaas add --catalog form" />
        <CodeBlock
          language="bash"
          code="vinyaas add --catalog dashboard --dry-run"
        />
        <CodeBlock
          language="bash"
          code="vinyaas add --catalog application --yes"
        />

        <h3
          id="force"
          className="text-foreground scroll-mt-8 text-base font-semibold"
        >
          --force
        </h3>
        <p className={body}>
          Already-installed components are skipped by default. Pass{" "}
          <code>--force</code> to overwrite existing component files with
          registry content.
        </p>
        <CodeBlock language="bash" code="vinyaas add button --force" />

        <h3
          id="dry-run"
          className="text-foreground scroll-mt-8 text-base font-semibold"
        >
          --dry-run
        </h3>
        <p className={body}>
          Resolves the install plan and prints components, files, npm
          dependencies, and registry dependencies without writing files,
          installing packages, or updating the manifest. Works with named
          components, catalogs, and categories.
        </p>
        <CodeBlock language="bash" code="vinyaas add button --dry-run" />
        <CodeBlock
          language="bash"
          code="vinyaas add --catalog dashboard --dry-run"
        />
        <CodeBlock
          language="bash"
          code="vinyaas add --category forms --dry-run"
        />

        <h3
          id="category"
          className="text-foreground scroll-mt-8 text-base font-semibold"
        >
          Category installation
        </h3>
        <p className={body}>
          Categories are registry metadata for discovery and group install. They
          are <strong>not</strong> component collections or packages. Category
          expansion feeds the same install pipeline as named components.
        </p>
        <CodeBlock language="bash" code="vinyaas add --category forms" />
        <CodeBlock language="bash" code="vinyaas add --category forms --yes" />
        <p className={body}>
          Current categories: <code>forms</code>, <code>layout</code>,{" "}
          <code>navigation</code>, <code>feedback</code>,{" "}
          <code>data-display</code>, <code>typography</code>,{" "}
          <code>charts</code>, <code>utilities</code>.
        </p>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            Multi-component and category installs prompt for confirmation unless
            you pass <code>--yes</code>.
          </li>
          <li>
            Explicit component names take precedence:{" "}
            <code>vinyaas add button --category forms</code> installs only{" "}
            <code>button</code> and ignores <code>--category</code>.
          </li>
          <li>Unknown categories fail and list the available names.</li>
        </ul>

        <h3
          id="status"
          className="text-foreground scroll-mt-8 text-base font-semibold"
        >
          status
        </h3>
        <p className={body}>
          Shows components recorded locally after successful installs. Vinyaas
          tracks installed components to support future update/remove workflows.
        </p>
        <CodeBlock language="bash" code="vinyaas status" />
        <CodeBlock language="bash" code="vinyaas status --json" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="discover" className={sectionHeading}>
          Discover
        </h2>
        <p className={body}>
          Browse without writing files. Use <code>list</code> to scan
          components, <code>catalog</code> for named groups, <code>search</code>{" "}
          to find by name or description, and <code>info</code> to inspect one
          component before installing.
        </p>
        <CodeBlock language="bash" code="vinyaas catalog list" />
        <CodeBlock language="bash" code="vinyaas catalog info form" />
        <CodeBlock language="bash" code="vinyaas list" />
        <CodeBlock language="bash" code="vinyaas list --category forms" />
        <CodeBlock language="bash" code="vinyaas search button" />
        <CodeBlock
          language="bash"
          code="vinyaas search input --category forms"
        />
        <CodeBlock language="bash" code="vinyaas info button" />
        <p className={body}>
          <code>catalog info</code> shows membership and which members are
          already installed when a project manifest is available. Component{" "}
          <code>list</code> / <code>search</code> output can include category,
          description, docs URL, files, and dependencies. Filter with{" "}
          <code>--category</code>.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="json" className={sectionHeading}>
          JSON output
        </h2>
        <p className={body}>
          Discovery, doctor, and status accept <code>--json</code> for
          machine-readable stdout.
        </p>
        <CodeBlock language="bash" code="vinyaas list --json" />
        <CodeBlock language="bash" code="vinyaas search input --json" />
        <CodeBlock language="bash" code="vinyaas info button --json" />
        <CodeBlock language="bash" code="vinyaas doctor --json" />
        <CodeBlock language="bash" code="vinyaas status --json" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="safety" className={sectionHeading}>
          Errors and safety
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            Existing component files are skipped unless <code>--force</code>.
          </li>
          <li>
            <code>--dry-run</code> never mutates the project or the manifest.
          </li>
          <li>
            Category and multi-component installs confirm before writing unless{" "}
            <code>--yes</code> is set.
          </li>
          <li>
            Failed installs roll back snapshotted project files (including
            package lockfiles and the install manifest when they were part of
            the mutation).
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="registry" className={sectionHeading}>
          Registry
        </h2>
        <p className={body}>
          The CLI reads a registry catalog, then individual component items
          (metadata and source files). Items may include name, type,
          description, category, files, dependencies, registry dependencies, and
          docs. Override the registry root with <code>REGISTRY_BASE_PATH</code>{" "}
          (preferred) or legacy <code>REGISTRY_BASE_URL</code>.
        </p>
        <CodeBlock
          language="bash"
          code="REGISTRY_BASE_PATH=https://vinyaas.vercel.app/r vinyaas list"
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="version" className={sectionHeading}>
          Version
        </h2>
        <p className={body}>
          Print the installed CLI version (currently v1.3.1).
        </p>
        <CodeBlock language="bash" code="vinyaas --version" />
      </section>
    </DocsArticle>
  );
}
