import type { Metadata } from "next";

import { DarkModeGuide } from "@/components/installation/dark-mode-guide";
import { getInstallationFramework } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

const framework = getInstallationFramework("react");

export const metadata: Metadata = pageMetadata({
  title: "Dark Mode with React",
  description:
    "Enable Vinyaas light and dark theme tokens in a generic React project.",
  path: "/dark-mode/react",
});

const body = "text-foreground text-base leading-7";
const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function ReactDarkModePage() {
  return (
    <DarkModeGuide framework={framework}>
      <section className="flex flex-col gap-4">
        <h2 id="react" className={sectionHeading}>
          React wiring
        </h2>
        <p className={body}>
          Any React setup works if the bundler loads the stylesheet that
          contains Vinyaas light and <code>.dark</code> tokens, and you toggle{" "}
          <code>dark</code> on the root element before interactive paint when
          possible.
        </p>
        <p className={body}>
          Persist the user choice, respect <code>prefers-color-scheme</code>{" "}
          when nothing is stored, and keep one source of truth for the class so
          components that read CSS variables stay in sync.
        </p>
      </section>
    </DarkModeGuide>
  );
}
