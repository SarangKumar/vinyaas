import type { Metadata } from "next";

import { FrameworkGuide } from "@/components/installation/framework-guide";
import { getInstallationFramework } from "@/lib/installation/frameworks";
import { pageMetadata } from "@/lib/page-metadata";

const framework = getInstallationFramework("react");

export const metadata: Metadata = pageMetadata({
  title: "Install Vinyaas with React",
  description:
    "Install Vinyaas components in React projects with Tailwind CSS v4. Works when React, aliases, and a global stylesheet are already in place.",
  path: framework.href,
});

export default function ReactInstallationPage() {
  return (
    <FrameworkGuide framework={framework}>
      <p className="text-foreground text-base leading-7">
        Generic React is the fallback when neither <code>next</code> nor{" "}
        <code>vite</code> is detected. Ensure a supported CSS entry exists
        before running <code>vinyaas init</code>.
      </p>
    </FrameworkGuide>
  );
}
