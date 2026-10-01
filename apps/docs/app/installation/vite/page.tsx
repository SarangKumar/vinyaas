import type { Metadata } from "next";

import { FrameworkGuide } from "@/components/installation/framework-guide";
import { getInstallationFramework } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

const framework = getInstallationFramework("vite");

export const metadata: Metadata = pageMetadata({
  title: "Install Vinyaas with React + Vite",
  description:
    "Install Vinyaas components in Vite + React projects with Tailwind CSS v4. Init detects your CSS entry, then add copies source into the project.",
  path: framework.href,
});

export default function ViteInstallationPage() {
  return (
    <FrameworkGuide framework={framework}>
      <p className="text-foreground text-base leading-7">
        The CLI detects Vite when <code>vite</code> is present. CSS entry
        detection looks for <code className="font-mono">src/index.css</code>,{" "}
        <code className="font-mono">index.css</code>, or existing app globals.
      </p>
    </FrameworkGuide>
  );
}
