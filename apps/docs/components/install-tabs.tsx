"use client";

import { useId, useState, type ReactNode } from "react";

import { focusRing } from "@/components/focus-ring";
import { cn } from "@/lib/utils";

type InstallTab = "cli" | "manual";

const tabs: { id: InstallTab; label: string }[] = [
  { id: "cli", label: "CLI" },
  { id: "manual", label: "Manual" },
];

/**
 * CLI / Manual toggle group for a component's Installation section.
 *
 * The tab buttons carry the `cli` and `manual` ids so existing deep links keep
 * resolving now that the section no longer has its own subheadings. Only the
 * active panel is mounted, which keeps the table of contents — it reads
 * headings out of the DOM — free of hidden entries.
 */
export function InstallTabs({
  cli,
  manual,
}: {
  cli: ReactNode;
  manual: ReactNode;
}) {
  const [active, setActive] = useState<InstallTab>("cli");
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const tabClassName = (selected: boolean) =>
    cn(
      "cursor-pointer rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors select-none",
      selected
        ? "border-border bg-muted text-foreground"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50",
      focusRing,
    );

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Installation method"
        className="flex items-center gap-0.5"
      >
        {tabs.map((tab) => {
          const selected = active === tab.id;

          return (
            <button
              key={tab.id}
              id={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${base}-${tab.id}-panel`}
              className={tabClassName(selected)}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${base}-${active}-panel`}
        aria-labelledby={active}
        className="flex flex-col gap-4"
      >
        {active === "cli" ? cli : manual}
      </div>
    </div>
  );
}
