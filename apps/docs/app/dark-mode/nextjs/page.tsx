import type { Metadata } from "next";

import { DarkModeGuide } from "@/components/installation/dark-mode-guide";
import { getInstallationFramework } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

const framework = getInstallationFramework("nextjs");

export const metadata: Metadata = pageMetadata({
  title: "Dark Mode with Next.js",
  description:
    "Enable Vinyaas light and dark theme tokens in a Next.js App Router project.",
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
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>{`<html lang="en" suppressHydrationWarning>
  <body>{children}</body>
</html>`}</code>
        </pre>
        <p className={body}>
          Run a small inline script before paint (or a client provider) that
          reads the saved preference / system preference and toggles{" "}
          <code>dark</code> on <code>document.documentElement</code>. Keep a
          client toggle that writes the same preference for later visits.
        </p>
      </section>
    </DarkModeGuide>
  );
}
