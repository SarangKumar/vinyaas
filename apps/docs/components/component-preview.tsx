import type { ReactNode } from "react";

export function ComponentPreview({ children }: { children: ReactNode }) {
  return (
    <div className="border-border bg-background flex min-h-48 items-center justify-center rounded-md border p-6 sm:p-10">
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        {children}
      </div>
    </div>
  );
}
