import Link from "next/link";
import type { ReactNode } from "react";

import { DocsArticle } from "@/components/docs-article";
import { FrameworkIconBadge } from "@/components/installation/framework-icon";
import { focusRing } from "@/components/focus-ring";
import { darkModePath } from "@/components/docs-nav";
import type { InstallationFramework } from "@/lib/installation/frameworks";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

function BashBlock({ code }: { code: string }) {
  return (
    <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
      <code>{code}</code>
    </pre>
  );
}

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
      description={`Enable light and dark themes in ${framework.name} using the class strategy Vinyaas tokens expect.`}
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
        <BashBlock
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
