import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { components, currentVersion } from "@/components/component-meta";
import { focusRing } from "@/components/focus-ring";
import { InstallCommand } from "@/components/install-command";
import { cliCommands } from "@/components/package-managers";
import { pageMetadata } from "@/lib/page-metadata";
import { Button } from "@/registry/new-york/ui/button/button";
import { Input } from "@/registry/new-york/ui/input/input";
import { Label } from "@/registry/new-york/ui/label/label";

export const metadata: Metadata = pageMetadata({
  title: "Introduction",
  description:
    "Learn how Vinyaas installs accessible React components into your repository as source you own and edit.",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-body text-base leading-7";
const actionLink = `inline-flex h-9 cursor-pointer items-center rounded-md px-4 text-sm font-medium ${focusRing}`;

const usageExample = {
  tsx: `import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";

export function SaveName() {
  return (
    <form className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Ada Lovelace" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
`,
  jsx: `import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";

export function SaveName() {
  return (
    <form className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Ada Lovelace" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
`,
};

export default function IntroductionPage() {
  const v01Count = components.filter(
    (component) => component.introducedIn === "0.1",
  ).length;
  const v10Count = components.filter(
    (component) => component.introducedIn === currentVersion,
  ).length;

  return (
    <article
      data-docs-article
      className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-16 px-6 pt-12 pb-24"
    >
      <header className="flex flex-col gap-6">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Introduction
        </p>
        <h1 className="text-foreground max-w-2xl text-4xl font-semibold tracking-tight text-balance">
          Accessible React components you install as source.
        </h1>
        <p className={`${body} max-w-2xl text-lg leading-8`}>
          Vinyaas is a component library and documentation system for React and
          Tailwind. The CLI copies components into your repository. You own the
          files, edit them freely, and ship without a Vinyaas runtime package.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/installation"
            className={`${actionLink} bg-primary text-primary-foreground`}
          >
            Get Started
          </Link>
          <Link
            href="/components"
            className={`${actionLink} border-border text-foreground hover:bg-accent border`}
          >
            Browse Components
          </Link>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 id="what-vinyaas-is" className={sectionHeading}>
          What Vinyaas is
        </h2>
        <p className={body}>
          Vinyaas publishes a registry of independently installable UI
          primitives. Each item is a source file (or small set of files) plus
          the npm dependencies it needs. Documentation covers preview, CLI
          install, API, accessibility notes, and the exact source that lands in
          your project.
        </p>
        <p className={body}>
          It is not a hosted design system you import from{" "}
          <code>node_modules</code> forever. After install, the components are
          yours.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="catalog" className={sectionHeading}>
          Catalog and releases
        </h2>
        <p className={body}>
          The current catalog has {components.length} components. v0.1 ships{" "}
          {v01Count} component (Button). v{currentVersion} is the major
          production-focused release and adds the other {v10Count}. Components
          are composable, theme-aware in light and dark, and documented with
          production-oriented examples.
        </p>
        <p className={body}>
          Docs pages include API reference, installation, usage and composition
          examples, accessibility notes, and syntax-highlighted source with
          TSX/JSX switching, line numbers on registry source, and expandable
          long snippets. Installation commands stay bash. Search opens with
          Cmd/Ctrl+K.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="why-it-exists" className={sectionHeading}>
          Why it exists
        </h2>
        <p className={body}>
          Product UI usually needs local edits: spacing, copy, variants, and
          domain-specific behavior. Copy-paste gists drift. Locked packages
          fight customization. Vinyaas keeps a shared starting point while
          leaving the source in your tree so you can change it without forking a
          library.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="philosophy" className={sectionHeading}>
          Core philosophy
        </h2>
        <ul className="border-border divide-border grid gap-0 divide-y rounded-md border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {[
            {
              title: "Own the source",
              body: "Installed files live in your repository. There is no Vinyaas runtime to upgrade for component code.",
            },
            {
              title: "Native semantics",
              body: "Prefer real buttons, inputs, and labels. Accessibility starts with the platform, not wrappers.",
            },
            {
              title: "Semantic tokens",
              body: "Styles use theme variables such as border, muted, and foreground so light and dark stay coherent.",
            },
            {
              title: "Install what you use",
              body: "Add one component or several in a single CLI call. Unused primitives are never pulled in.",
            },
          ].map((item) => (
            <li key={item.title} className="flex flex-col gap-2 p-5">
              <h3 className="text-foreground text-base font-medium">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-6">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="how-components-work" className={sectionHeading}>
          How the components work
        </h2>
        <p className={body}>
          Components are React functions styled with Tailwind utilities and{" "}
          <code>cn</code> for class merging. Props stay close to the underlying
          element. Composition is ordinary JSX: labels wrap fields, buttons sit
          in forms, dialogs host other primitives.
        </p>
        <div className="border-border bg-card flex min-w-0 flex-col gap-4 overflow-hidden rounded-md border p-5">
          <div className="grid max-w-sm gap-3">
            <div className="grid gap-2">
              <Label htmlFor="intro-name">Name</Label>
              <Input id="intro-name" defaultValue="Ada Lovelace" />
            </div>
            <Button type="button" size="sm">
              Save
            </Button>
          </div>
        </div>
        <CodeBlock source={usageExample} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="installation" className={sectionHeading}>
          Installation and usage flow
        </h2>
        <ol className={`${body} list-decimal space-y-3 pl-5`}>
          <li>
            Run <code>vinyaas init</code> to create <code>components.json</code>
            , utilities, and theme hooks for your app.
          </li>
          <li>
            Add components with <code>vinyaas add …</code>. The CLI writes files
            under your configured components path.
          </li>
          <li>
            Import from your local path (for example{" "}
            <code>@/components/ui/button/button</code>) and compose like any
            other React code.
          </li>
        </ol>
        <InstallCommand commands={cliCommands("init")} />
        <InstallCommand commands={cliCommands("add button")} />
        <p className="text-muted-foreground text-sm leading-6">
          Full steps live on the{" "}
          <Link
            href="/installation"
            className={`text-foreground rounded-sm underline ${focusRing}`}
          >
            Installation
          </Link>{" "}
          page, including multi-component adds and framework notes.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="customization" className={sectionHeading}>
          Customization
        </h2>
        <p className={body}>
          Change class names, variants, and structure in the installed files.
          Theme colors come from CSS variables in your stylesheet; update those
          tokens once and every component that uses semantic utilities follows.
          There is no patch layer and no private API to keep in sync.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="registry-cli" className={sectionHeading}>
          Registry and CLI model
        </h2>
        <p className={body}>
          The public registry exposes one JSON item per component. That item is
          the source of truth for file contents and dependencies.{" "}
          <code>components.json</code> is local project configuration: aliases,
          style, and paths. The CLI reads both to write files into your app.
        </p>
        <p className={body}>
          See{" "}
          <Link
            href="/components-json"
            className={`text-foreground rounded-sm underline ${focusRing}`}
          >
            components.json
          </Link>{" "}
          and the{" "}
          <Link
            href="/installation#cli"
            className={`text-foreground rounded-sm underline ${focusRing}`}
          >
            CLI
          </Link>{" "}
          section for details.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="composition" className={sectionHeading}>
          Component composition
        </h2>
        <p className={body}>
          Prefer small primitives over monolithic widgets. A settings page is
          usually Label + Input + Switch + Button. Dialogs, dropdowns, and
          command palettes host other components rather than re-implementing
          them. The homepage playground shows these combinations in realistic
          product surfaces.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="accessibility" className={sectionHeading}>
          Accessibility and design principles
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>Visible focus rings for keyboard users.</li>
          <li>
            Labels associated with controls; never rely on placeholder alone.
          </li>
          <li>Disabled state stays in the accessibility tree when native.</li>
          <li>
            Color contrast comes from theme tokens; destructive actions use the
            destructive palette.
          </li>
          <li>
            Motion respects <code>prefers-reduced-motion</code> where animation
            exists.
          </li>
        </ul>
      </section>

      <section className="border-border flex flex-col gap-4 rounded-md border p-6">
        <h2 id="next-steps" className={sectionHeading}>
          Next steps
        </h2>
        <p className={body}>
          Install the library, then browse the catalog for the primitives you
          need.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/installation"
            className={`${actionLink} bg-primary text-primary-foreground`}
          >
            Get Started
          </Link>
          <Link
            href="/components"
            className={`${actionLink} border-border text-foreground hover:bg-accent border`}
          >
            Components
          </Link>
          <Link
            href="/changelog"
            className={`${actionLink} border-border text-foreground hover:bg-accent border`}
          >
            Changelog
          </Link>
        </div>
      </section>
    </article>
  );
}
