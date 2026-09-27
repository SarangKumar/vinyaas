import type { ReactNode } from "react";

export function ComponentPreview({ children }: { children: ReactNode }) {
  return (
    <div className="border-border bg-background flex min-h-32 items-center justify-center rounded-md border px-6 py-8">
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        {children}
      </div>
    </div>
  );
}
