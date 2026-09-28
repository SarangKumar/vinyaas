"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import { Label } from "@/registry/new-york/ui/label/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select/native-select";
import { Separator } from "@/registry/new-york/ui/separator/separator";

const metrics = [
  { label: "Signups", value: "1,284", delta: "+12.4%" },
  { label: "Active", value: "842", delta: "+4.1%" },
  { label: "Churn", value: "1.8%", delta: "-0.3%" },
];

const highlights = [
  { label: "Peak day", value: "Wed · 148" },
  { label: "Top source", value: "Organic" },
  { label: "Conversion", value: "3.2%" },
];

export function AnalyticsBlock() {
  return (
    <PlayBlock title="Analytics" description="Workspace growth this month.">
      <div className="grid min-w-0 gap-1.5">
        <Label htmlFor="play-analytics-range" className="sr-only">
          Date range
        </Label>
        <NativeSelect
          id="play-analytics-range"
          aria-label="Date range"
          defaultValue="30"
        >
          <NativeSelectOption value="7">Last 7 days</NativeSelectOption>
          <NativeSelectOption value="30">Last 30 days</NativeSelectOption>
          <NativeSelectOption value="90">Last quarter</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="grid min-w-0 grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="min-w-0">
            <p className="text-muted-foreground text-xs">{metric.label}</p>
            <p className="text-foreground mt-1 text-lg font-semibold tracking-tight">
              {metric.value}
            </p>
            <Badge variant="secondary" className="mt-1.5">
              {metric.delta}
            </Badge>
          </div>
        ))}
      </div>
      <Separator />
      <dl className="grid min-w-0 gap-3 text-sm">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 items-center justify-between gap-3"
          >
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="truncate text-right font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex min-w-0 items-center justify-end">
        <Button type="button" size="sm" variant="outline">
          Export
        </Button>
      </div>
    </PlayBlock>
  );
}
