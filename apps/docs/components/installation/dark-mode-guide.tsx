import Link from "next/link";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import { FrameworkIconBadge } from "@/components/installation/framework-icon";
import { focusRing } from "@/components/focus-ring";
import { darkModePath } from "@/components/docs-nav";
import type { InstallationFramework } from "@/lib/installation/frameworks";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export function DarkModeGuide({
  framework,
  children,
}: {
  framework: InstallationFramework;
  children?: ReactNode;
}) {
  return (
    <DocsArticle
      title={`Dark Mode with ${framework.name}`}
      description={`Enable light and dark themes in ${framework.name} using the class strategy Vinyaas tokens expect. Default follows the device preference.`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <FrameworkIconBadge id={framework.id} />
        <div className="flex min-w-0 flex-col gap-3">
          <p className={body}>
            Vinyaas writes CSS variables for light and dark. Dark styles apply
            when <code>html</code> has the <code>dark</code> class. Choose
            another guide from{" "}
            <Link
              href={darkModePath}
              className={`text-primary underline underline-offset-4 ${focusRing}`}
            >
              Dark Mode
            </Link>
            .
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 id="default" className={sectionHeading}>
          Default = system preference
        </h2>
        <p className={body}>
          Until the visitor picks light or dark, follow{" "}
          <code>prefers-color-scheme</code>. Do not write a stored preference on
          first visit — only persist after an explicit toggle.
        </p>
        <CodeBlock
          language="ts"
          code={`const stored = localStorage.getItem("vinyaas-theme");
const dark =
  stored === "dark" ||
  (stored !== "light" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches);
document.documentElement.classList.toggle("dark", dark);`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="tokens" className={sectionHeading}>
          Theme tokens
        </h2>
        <p className={body}>
          After <code>vinyaas init</code>, your CSS entry (preferred:{" "}
          <code className="font-mono">{framework.preferredCss}</code>) includes
          light defaults and a <code>.dark</code> block. Components read those
          variables — you do not need a separate component theme package.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="toggle" className={sectionHeading}>
          Toggle the class
        </h2>
        <p className={body}>
          Flip appearance by toggling <code>dark</code> on the document element:
        </p>
        <CodeBlock
          language="ts"
          code={`document.documentElement.classList.toggle("dark");`}
        />
        <p className={body}>
          Persist the choice in <code>localStorage</code> (and optionally a
          cookie) so navigations and reloads keep the same mode.
        </p>
      </section>

      {children}
    </DocsArticle>
  );
}
