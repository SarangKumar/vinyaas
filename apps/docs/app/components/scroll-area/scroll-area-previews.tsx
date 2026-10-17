"use client";

import type { ControlValues } from "@/components/component-demo";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area";

const COMMITS = [
  { sha: "a1b2c3d", msg: "feat: add user cursor component" },
  { sha: "e4f5a6b", msg: "fix: resolve race condition in auth flow" },
  { sha: "c7d8e9f", msg: "refactor: extract control-schema helpers" },
  { sha: "a0b1c2d", msg: "chore: update pnpm lockfile" },
  { sha: "e3f4a5b", msg: "docs: add score ring usage examples" },
  { sha: "c6d7e8f", msg: "feat: resizable table columns" },
  { sha: "a9b0c1d", msg: "fix: accordion collapsible not remounting" },
  { sha: "e2f3a4b", msg: "style: tighten preview container spacing" },
  { sha: "c5d6e7f", msg: "test: add registry-item snapshot tests" },
  { sha: "a8b9c0d", msg: "feat: live preview for all components" },
];

const TAGS = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Radix UI",
  "shadcn/ui",
  "Vinyaas",
  "registry",
  "CLI",
  "components",
  "preview",
  "controls",
  "live",
  "customisation",
  "docs",
];

export function ScrollAreaPreview({ values }: { values: ControlValues }) {
  const orientation = (values.orientation as string) || "vertical";

  if (orientation === "horizontal") {
    return (
      <ScrollArea
        key="horizontal"
        orientation="horizontal"
        className="border-border bg-card w-full max-w-sm rounded-md border"
      >
        <div className="flex gap-2 p-3">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </ScrollArea>
    );
  }

  if (orientation === "both") {
    return (
      <ScrollArea
        key="both"
        orientation="both"
        className="border-border bg-card h-48 w-full max-w-sm rounded-md border"
      >
        {/* Wider than the container so horizontal scroll activates */}
        <div className="w-xl p-3">
          <div className="text-muted-foreground mb-2 grid grid-cols-4 gap-x-6 border-b pb-2 text-xs font-medium">
            <span>SHA</span>
            <span className="col-span-2">Message</span>
            <span>Author</span>
          </div>
          {COMMITS.map((c) => (
            <div
              key={c.sha}
              className="grid grid-cols-4 gap-x-6 border-b py-2 text-sm last:border-0"
            >
              <code className="text-muted-foreground font-mono text-xs">
                {c.sha}
              </code>
              <span className="col-span-2">{c.msg}</span>
              <span className="text-muted-foreground text-xs">sarang</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea
      key="vertical"
      orientation="vertical"
      className="border-border bg-card h-52 w-full max-w-sm rounded-md border"
    >
      <div className="divide-border divide-y">
        {COMMITS.map((c) => (
          <div key={c.sha} className="flex items-center gap-3 px-4 py-2.5">
            <code className="text-muted-foreground font-mono text-xs">
              {c.sha}
            </code>
            <span className="text-sm">{c.msg}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
