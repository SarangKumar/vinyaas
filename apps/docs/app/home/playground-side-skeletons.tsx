import type { CSSProperties, ReactNode } from "react";

import { Skeleton } from "@/registry/new-york/ui/skeleton";

/**
 * Ultra-wide decorative rails (≥2200px), inspired by shadcn's demo shell.
 *
 * Positioned absolute outside the centered 1900px main band:
 *   fade ← [2-col left rail] | main (≤1900px) | [2-col right rail] → fade
 */
export function PlaygroundSideRails() {
  return (
    <div
      aria-hidden="true"
      data-playground-rails
      className="pointer-events-none absolute inset-x-0 top-(--playground-pad) z-10 hidden min-[1900px]:top-(--playground-pad-xl) min-[2200px]:block xl:top-(--playground-pad-xl)"
    >
      <Rail side="left">
        <RailColumn>
          <FormSkeletonCard />
          <MetricsSkeletonCard />
          <ListSkeletonCard />
          <ComposerSkeletonCard />
        </RailColumn>
        <RailColumn>
          <PaymentSkeletonCard />
          <ProgressSkeletonCard />
          <FieldsSkeletonCard />
          <EmptySkeletonCard />
        </RailColumn>
      </Rail>
      <Rail side="right">
        <RailColumn>
          <FieldsSkeletonCard />
          <ProgressSkeletonCard />
          <PasswordSkeletonCard />
          <QrSkeletonCard />
        </RailColumn>
        <RailColumn>
          <QrSkeletonCard />
          <PaymentSkeletonCard />
          <ListSkeletonCard />
          <EmptySkeletonCard />
          <ChecklistSkeletonCard />
        </RailColumn>
      </Rail>
    </div>
  );
}

function Rail({
  side,
  children,
}: {
  side: "left" | "right";
  children: ReactNode;
}) {
  return (
    <div
      data-playground-side={side}
      className={
        side === "left"
          ? "absolute top-0 left-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]"
          : "absolute top-0 right-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]"
      }
    >
      {children}
    </div>
  );
}

function RailColumn({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-(--gap)">{children}</div>;
}

function SkeletonCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-slot="card"
      data-playground-skeleton
      className={`border-border bg-card flex w-full min-w-0 flex-col gap-5 overflow-hidden rounded-xl border p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function FormSkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="flex h-[200px] w-full items-end gap-3">
        {[60, 80, 65, 95, 50, 100].map((height) => (
          <div
            key={height}
            className="flex h-full flex-1 flex-col justify-end gap-2"
          >
            <Skeleton
              className="w-full rounded-t-md rounded-b-none"
              style={{ height: `${height}%` } as CSSProperties}
            />
            <Skeleton className="mx-auto h-3 w-6" />
          </div>
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="bg-muted flex flex-col gap-2 rounded-xl p-4">
          <Skeleton className="bg-muted-foreground/15 h-3 w-20" />
          <Skeleton className="bg-muted-foreground/15 h-5 w-28" />
          <Skeleton className="bg-muted-foreground/15 h-3 w-24" />
        </div>
        <div className="bg-muted flex flex-col gap-2 rounded-xl p-4">
          <Skeleton className="bg-muted-foreground/15 h-3 w-24" />
          <Skeleton className="bg-muted-foreground/15 h-5 w-32" />
          <Skeleton className="bg-muted-foreground/15 h-3 w-28" />
        </div>
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </SkeletonCard>
  );
}

function MetricsSkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-12 w-56 rounded-lg" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      <div className="bg-muted flex flex-col gap-3 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="bg-muted-foreground/15 h-4 w-28" />
          <Skeleton className="bg-muted-foreground/15 h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="bg-muted-foreground/15 h-4 w-32" />
          <Skeleton className="bg-muted-foreground/15 h-4 w-16" />
        </div>
        <Skeleton className="bg-muted-foreground/15 h-px w-full rounded-none" />
        <div className="flex items-center justify-between">
          <Skeleton className="bg-muted-foreground/15 h-4 w-36" />
          <Skeleton className="bg-muted-foreground/15 h-4 w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </SkeletonCard>
  );
}

function ListSkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="size-8 shrink-0" />
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-muted flex items-center gap-3 rounded-xl p-3"
          >
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="bg-muted-foreground/15 h-4 w-28" />
              <Skeleton className="bg-muted-foreground/15 h-3 w-20" />
            </div>
            <Skeleton className="bg-muted-foreground/15 hidden h-4 w-16 md:block" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

function ComposerSkeletonCard() {
  return (
    <SkeletonCard>
      <Skeleton className="h-8 w-full rounded-2xl" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="ml-auto size-4 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </SkeletonCard>
  );
}

function PaymentSkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-full max-w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1].map((index) => (
          <div
            key={index}
            className="bg-muted flex flex-col gap-3 rounded-xl p-4"
          >
            <Skeleton className="bg-muted-foreground/15 h-3 w-24" />
            <Skeleton className="bg-muted-foreground/15 h-8 w-36" />
            <Skeleton className="bg-muted-foreground/15 h-2 w-full rounded-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="bg-muted-foreground/15 h-3 w-24" />
              <Skeleton className="bg-muted-foreground/15 h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="mx-auto h-3 w-56" />
    </SkeletonCard>
  );
}

function ProgressSkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-7 w-24" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-[100px] w-full rounded-lg" />
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </SkeletonCard>
  );
}

function FieldsSkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </SkeletonCard>
  );
}

function PasswordSkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </SkeletonCard>
  );
}

function QrSkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex justify-center pt-2">
        <Skeleton className="size-44 rounded-xl" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-64 max-w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
    </SkeletonCard>
  );
}

function EmptySkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex flex-col items-center gap-4 p-4">
        <Skeleton className="size-12 rounded-xl" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-64 max-w-full" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </SkeletonCard>
  );
}

function ChecklistSkeletonCard() {
  return (
    <SkeletonCard>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="flex flex-col gap-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex items-start gap-3">
            <Skeleton className="mt-0.5 size-4 rounded-sm" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56 max-w-full" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </SkeletonCard>
  );
}
