"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card/card";

const months = [
  { label: "Dec", value: 42 },
  { label: "Jan", value: 58 },
  { label: "Feb", value: 36 },
  { label: "Mar", value: 74 },
  { label: "Apr", value: 88 },
];

export function ContributionHistoryBlock() {
  return (
    <PlayBlock title="Contribution History">
      <div
        className="flex h-40 items-end gap-3 px-1 pb-1"
        role="img"
        aria-label="Contribution bars from December to April"
      >
        {months.map((month) => (
          <div
            key={month.label}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <div
              className="bg-foreground/80 w-full max-w-10 rounded-sm"
              style={{ height: `${month.value}%` }}
            />
            <span className="text-muted-foreground text-xs">{month.label}</span>
          </div>
        ))}
      </div>
      <div className="grid min-w-0 grid-cols-2 gap-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Upcoming</CardDescription>
            <CardTitle className="text-base">May 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs leading-5">
              Design review · 12 commits queued
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Savings Plan</CardDescription>
            <CardTitle className="text-base">$420 / mo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs leading-5">
              Auto-transfer on the 1st
            </p>
          </CardContent>
        </Card>
      </div>
      <Button type="button" className="w-full">
        View Full Report
      </Button>
    </PlayBlock>
  );
}
