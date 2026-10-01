import type { Metadata } from "next";

import { DarkModeGuide } from "@/components/installation/dark-mode-guide";
import { getInstallationFramework } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

const framework = getInstallationFramework("vite");

export const metadata: Metadata = pageMetadata({
  title: "Dark Mode with React + Vite",
  description:
    "Enable Vinyaas light and dark theme tokens in a Vite + React project.",
  path: "/dark-mode/vite",
});

const body = "text-foreground text-base leading-7";
const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function ViteDarkModePage() {
  return (
    <DarkModeGuide framework={framework}>
      <section className="flex flex-col gap-4">
        <h2 id="vite" className={sectionHeading}>
          Vite wiring
        </h2>
        <p className={body}>
          Place a blocking script in <code>index.html</code> (or run equivalent
          logic before React mounts) that sets <code>dark</code> on{" "}
          <code>&lt;html&gt;</code> from storage or{" "}
          <code>prefers-color-scheme</code>. That avoids a flash of the wrong
          theme.
        </p>
        <pre className="border-border bg-card text-card-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-6">
          <code>{`<script>
  const theme = localStorage.getItem("theme");
  const dark =
    theme === "dark" ||
    (!theme && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
</script>`}</code>
        </pre>
        <p className={body}>
          Expose a React toggle that updates the class and{" "}
          <code>localStorage</code>. Ensure your global CSS (for example{" "}
          <code className="font-mono">src/index.css</code>) includes the Vinyaas{" "}
          <code>.dark</code> token block from init.
        </p>
      </section>
    </DarkModeGuide>
  );
}
