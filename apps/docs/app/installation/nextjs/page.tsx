import type { Metadata } from "next";

import { FrameworkGuide } from "@/components/installation/framework-guide";
import { getInstallationFramework } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

const framework = getInstallationFramework("nextjs");

export const metadata: Metadata = pageMetadata({
  title: "Install Vinyaas with Next.js",
  description:
    "Install Vinyaas components in Next.js projects with Tailwind CSS v4. Run init, add components as source, and keep editing locally.",
  path: framework.href,
});

export default function NextJsInstallationPage() {
  return (
    <FrameworkGuide framework={framework}>
      <p className="text-foreground text-base leading-7">
        The CLI detects Next.js when <code>next</code> is present. It prefers{" "}
        <code className="font-mono">app/globals.css</code> or{" "}
        <code className="font-mono">src/app/globals.css</code> for theme tokens.
      </p>
    </FrameworkGuide>
  );
}
