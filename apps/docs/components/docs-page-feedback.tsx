"use client";

import { focusRing } from "@/components/focus-ring";
import { cn } from "@/lib/utils";

const feedbackButton = cn(
  "border-border bg-background text-foreground hover:bg-muted inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md border px-2.5 text-xs font-medium",
  focusRing,
);

export function DocsPageFeedback() {
  return (
    <div data-docs-page-feedback className="px-5 pt-2">
      <p className="text-foreground text-sm font-medium">Was this helpful?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className={feedbackButton}>
          Like
        </button>
        <button type="button" className={feedbackButton}>
          Dislike
        </button>
      </div>
    </div>
  );
}
