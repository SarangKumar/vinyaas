import type { ReactNode } from "react";

export function ComponentPreview({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        {children}
      </div>
    </div>
  );
}
