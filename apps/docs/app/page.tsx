import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { focusRing } from "@/components/focus-ring";
import { Button } from "@/registry/new-york/ui/button/button";
import { Input } from "@/registry/new-york/ui/input/input";
import { Textarea } from "@/registry/new-york/ui/textarea/textarea";

const actionLink = `inline-flex h-8 cursor-pointer items-center rounded-md px-3 text-sm font-medium ${focusRing}`;

const features = [
  {
    title: "Own your components",
    body: "The CLI copies each component into your repository. The source stays in your project, and you can change it there.",
  },
  {
    title: "Accessible by default",
    body: "Components are native elements with visible keyboard focus. They keep the semantics of a button or a text field.",
  },
  {
    title: "Tailwind-friendly",
    body: "Styles use semantic Tailwind utilities, so they follow the theme variables in your stylesheet.",
  },
  {
    title: "Install only what you need",
    body: "Add one component at a time. Unused components are never installed.",
  },
  {
    title: "Built for customization",
    body: "There is no Vinyaas runtime package to upgrade. Edit the installed files directly.",
  },
];

export default function Home() {
  return (
    <article
      data-docs-article
      className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-20 pb-24"
    >
      <header className="flex flex-col gap-6">
        <h1 className="text-foreground max-w-xl text-4xl font-semibold tracking-tight">
          Accessible React components you can own.
        </h1>
        <p className="text-body max-w-2xl text-lg leading-8">
          Vinyaas installs components into your project as source. You customize
          that code, style it with Tailwind, and ship it without a runtime
          dependency on Vinyaas.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
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

      <section className="mt-24 flex flex-col gap-6">
        <h2
          id="quick-start"
          className="text-foreground scroll-mt-8 text-xl font-semibold tracking-tight"
        >
          Quick start
        </h2>
        <p className="text-body max-w-2xl text-base leading-7">
          Initialize a project, then add a component. The CLI writes the files
          into your repository.
        </p>
        <CodeBlock language="bash" code="pnpm dlx @vinyaas/cli init" />
        <CodeBlock language="bash" code="pnpm dlx @vinyaas/cli add button" />
      </section>

      <section className="mt-24">
        <h2
          id="philosophy"
          className="text-foreground scroll-mt-8 text-xl font-semibold tracking-tight"
        >
          Philosophy
        </h2>
        <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature.title} className="flex flex-col gap-2">
              <h3 className="text-foreground text-base font-medium">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-6">
                {feature.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-24 flex flex-col gap-6">
        <h2
          id="components"
          className="text-foreground scroll-mt-8 text-xl font-semibold tracking-tight"
        >
          Components
        </h2>
        <p className="text-body max-w-2xl text-base leading-7">
          Button, Input, and Textarea are the current components. Each page
          includes a live preview, an install command, and the source that gets
          copied into your project.
        </p>
        <div className="border-border flex flex-col gap-4 rounded-md border px-6 py-10">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </div>
          <Input aria-label="Email" placeholder="Email" className="max-w-sm" />
          <Textarea
            aria-label="Message"
            placeholder="Write a message"
            rows={3}
            className="max-w-sm"
          />
        </div>
        <p className="text-muted-foreground text-sm leading-6">
          <Link
            href="/components/button"
            className={`text-foreground cursor-pointer rounded-sm underline ${focusRing}`}
          >
            Button
          </Link>
          {" · "}
          <Link
            href="/components/input"
            className={`text-foreground cursor-pointer rounded-sm underline ${focusRing}`}
          >
            Input
          </Link>
          {" · "}
          <Link
            href="/components/textarea"
            className={`text-foreground cursor-pointer rounded-sm underline ${focusRing}`}
          >
            Textarea
          </Link>
          {" · "}
          <Link
            href="/installation"
            className={`text-foreground cursor-pointer rounded-sm underline ${focusRing}`}
          >
            Installation
          </Link>
        </p>
      </section>
    </article>
  );
}
