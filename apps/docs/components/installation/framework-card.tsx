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
      aria-label={`${framework.name}. ${framework.description}`}
      className={`border-border bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-5 shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:shadow-md ${focusRing}`}
    >
      <FrameworkIconBadge id={framework.id} />
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
