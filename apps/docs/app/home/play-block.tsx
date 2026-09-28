import type { ReactNode } from "react";

export function PlayBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-border bg-card text-card-foreground mb-5 flex min-w-0 break-inside-avoid flex-col gap-5 rounded-md border p-6">
      <h2 className="text-sm font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
