import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import {
  companionJsonPath,
  companionPath,
} from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Companion Installation",
  description:
    "How Vinyaas companions will be installed in a project. CLI companion commands are planned and not available yet.",
  path: "/companion/installation",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

export default function CompanionInstallationPage() {
  return (
    <DocsArticle
      title="Companion Installation"
      description="Companions will install as local assets and metadata — separate from registry UI components."
    >
      <section className="flex flex-col gap-4">
        <h2 id="status" className={sectionHeading}>
          Current status
        </h2>
        <p className={body}>
          Companion installation through the CLI is{" "}
          <strong>not available yet</strong>. Built-in companions such as Ember,
          Soul, and Skeleton are showcased in the docs today. Use the{" "}
          <Link href={companionPath} className={linkClass}>
            Companions
          </Link>{" "}
          page to explore them.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="planned" className={sectionHeading}>
          Planned CLI
        </h2>
        <p className={body}>
          A future release may support installing a companion species into a
          project, for example:
        </p>
        <CodeBlock language="bash" code="vinyaas companion add ember" />
        <p className={body}>
          That command is not implemented. Do not expect it to work with the
          current Vinyaas CLI (<code>init</code>, <code>add</code>,{" "}
          <code>doctor</code>, discovery, and <code>status</code>).
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="what-installs" className={sectionHeading}>
          What will install
        </h2>
        <p className={body}>
          When companion install ships, a typical package will include{" "}
          <code>companion.json</code>, sprite assets, and animation frames —
          not React UI primitives from the component registry. See{" "}
          <Link href={companionJsonPath} className={linkClass}>
            companion.json
          </Link>{" "}
          for the metadata shape.
        </p>
      </section>
    </DocsArticle>
  );
}
