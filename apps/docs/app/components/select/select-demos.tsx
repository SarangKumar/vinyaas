"use client";

import { useState } from "react";

import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";

export function BasicSelectDemo() {
  return (
    <Select defaultValue="docs">
      <SelectTrigger className="w-full max-w-sm" aria-label="Page">
        <SelectValue placeholder="Select a page" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="docs">Documentation</SelectItem>
        <SelectItem value="components">Components</SelectItem>
        <SelectItem value="themes">Themes</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function GroupedTimezoneDemo() {
  return (
    <Select defaultValue="est">
      <SelectTrigger className="w-full max-w-md" aria-label="Timezone">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function ChangelogStyleSelectDemo() {
  return (
    <Select defaultValue="1.3.0">
      <SelectTrigger className="w-full max-w-xs" aria-label="Version">
        <SelectValue placeholder="Select a version" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1.3.0">v1.3.0</SelectItem>
        <SelectItem value="1.2.0">v1.2.0</SelectItem>
        <SelectItem value="1.1.0">v1.1.0</SelectItem>
        <SelectItem value="1.0.0">v1.0.0</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function DisabledSelectDemo() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <Select disabled defaultValue="est">
        <SelectTrigger aria-label="Disabled select">
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="est">
        <SelectTrigger aria-label="With disabled option">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst" disabled>
            Central Standard Time (CST)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

const longOptions = Array.from({ length: 40 }, (_, index) => ({
  value: `city-${index}`,
  label: `City ${index + 1}`,
}));

export function LongListSelectDemo() {
  return (
    <Select defaultValue="city-0">
      <SelectTrigger className="w-full max-w-sm" aria-label="City">
        <SelectValue placeholder="Pick a city" />
      </SelectTrigger>
      <SelectContent>
        {longOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FormSelectDemo() {
  return (
    <form
      className="grid w-full max-w-md gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-2">
        <Label htmlFor="plan">Plan</Label>
        <Select name="plan" defaultValue="pro">
          <SelectTrigger id="plan">
            <SelectValue placeholder="Choose a plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}

export function DashboardFilterDemo() {
  const [range, setRange] = useState("7d");

  return (
    <div className="border-border flex w-full max-w-md flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">Revenue</p>
        <p className="text-muted-foreground text-xs">Last {range}</p>
      </div>
      <Select value={range} onValueChange={setRange}>
        <SelectTrigger className="w-36" aria-label="Date range">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
