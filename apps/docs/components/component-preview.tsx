import type { ReactNode } from "react";

export function ComponentPreview({ children }: { children: ReactNode }) {
  return (
    <div className="border-border bg-background flex min-h-48 w-full items-center justify-center overflow-x-auto rounded-md border px-6 py-10">
      <div className="flex w-full max-w-full flex-col items-center justify-center gap-3">
        {children}
      </div>
    </div>
  );
}
