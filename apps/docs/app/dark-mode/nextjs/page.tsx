import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { DarkModeGuide } from "@/components/installation/dark-mode-guide";
import { getInstallationFramework } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

const framework = getInstallationFramework("nextjs");

export const metadata: Metadata = pageMetadata({
  title: "Dark Mode with Next.js",
  description:
    "Enable Vinyaas light and dark theme tokens in a Next.js App Router project with system preference as the default.",
  path: "/dark-mode/nextjs",
});

const body = "text-foreground text-base leading-7";
const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function NextJsDarkModePage() {
  return (
    <DarkModeGuide framework={framework}>
      <section className="flex flex-col gap-4">
        <h2 id="nextjs" className={sectionHeading}>
          Next.js wiring
        </h2>
        <p className={body}>
          Prefer App Router. Add <code>suppressHydrationWarning</code> on{" "}
          <code>&lt;html&gt;</code> so a before-paint theme script can set{" "}
          <code>class=&quot;dark&quot;</code> without a hydration mismatch.
        </p>
        <CodeBlock
          language="tsx"
          code={`<html lang="en" suppressHydrationWarning>
  <body>{children}</body>
</html>`}
        />
        <p className={body}>
          Run a small inline script before paint that reads the saved preference
          or falls back to <code>prefers-color-scheme</code>, then toggles{" "}
          <code>dark</code> on <code>document.documentElement</code>. Keep a
          client toggle that writes the same preference for later visits.
        </p>
      </section>
    </DarkModeGuide>
  );
}
