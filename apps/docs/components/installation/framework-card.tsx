import Link from "next/link";

import { FrameworkIconBadge } from "@/components/installation/framework-icon";
import { focusRing } from "@/components/focus-ring";
import type { InstallationFramework } from "@/lib/installation/frameworks";

export function FrameworkCard({
  framework,
  href = framework.href,
}: {
  framework: InstallationFramework;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={framework.name}
      className={`border-border bg-card text-card-foreground flex flex-col items-center justify-center gap-3 rounded-xl border px-6 py-10 shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:shadow-md ${focusRing}`}
    >
      <FrameworkIconBadge id={framework.id} />
      <span className="text-foreground text-sm font-medium tracking-tight">
        {framework.name}
      </span>
    </Link>
  );
}
