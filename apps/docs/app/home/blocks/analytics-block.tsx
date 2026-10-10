"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import { Separator } from "@/registry/new-york/ui/separator";
import { Toggle } from "@/registry/new-york/ui/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york/ui/toggle-group";

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
        <Select defaultValue="30">
          <SelectTrigger id="play-analytics-range" aria-label="Date range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          variant="outline"
          size="sm"
          aria-label="Granularity"
          defaultValue={["weekly"]}
        >
          <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
          <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
        </ToggleGroup>
        <Toggle variant="outline" size="sm" aria-label="Compare to last period">
          Compare
        </Toggle>
      </div>
      <div className="grid min-w-0 grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="border-border bg-muted/30 min-w-0 rounded-xl border p-2.5"
          >
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
