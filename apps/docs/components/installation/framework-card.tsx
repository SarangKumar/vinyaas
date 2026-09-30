import Link from "next/link";

import { FrameworkIconBadge } from "@/components/installation/framework-icon";
import { focusRing } from "@/components/focus-ring";
import type { InstallationFramework } from "@/lib/installation/frameworks";

export function FrameworkCard({
  framework,
}: {
  framework: InstallationFramework;
}) {
  return (
    <Link
      href={framework.href}
      className={`border-border bg-card text-card-foreground hover:bg-muted/40 group flex flex-col gap-4 rounded-xl border p-5 transition-colors ${focusRing}`}
    >
      <div className="flex items-start justify-between gap-3">
        <FrameworkIconBadge id={framework.id} />
        <span className="text-muted-foreground group-hover:text-foreground text-sm">
          Continue →
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">
          {framework.name}
        </h2>
        <p className="text-muted-foreground text-sm leading-6">
          {framework.description}
        </p>
      </div>
    </Link>
  );
}
