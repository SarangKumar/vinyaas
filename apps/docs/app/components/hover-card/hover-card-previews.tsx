"use client";
import type { ControlValues } from "@/components/component-demo";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  type HoverCardSide,
} from "@/registry/new-york/ui/hover-card";

export function HoverCardPreview({ values }: { values: ControlValues }) {
  return (
    <HoverCard
      defaultOpen
      openDelay={values.openDelay as number}
      closeDelay={values.closeDelay as number}
    >
      <HoverCardTrigger>
        <span className="cursor-pointer text-sm underline">@johndoe</span>
      </HoverCardTrigger>
      <HoverCardContent side={values.side as HoverCardSide} className="w-64">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">John Doe</p>
          <p className="text-muted-foreground text-xs">
            Full-stack developer. Joined 2021.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
