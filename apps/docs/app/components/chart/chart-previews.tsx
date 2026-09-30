"use client";

import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 13850 },
  { month: "Mar", revenue: 15200 },
  { month: "Apr", revenue: 14100 },
  { month: "May", revenue: 16750 },
  { month: "Jun", revenue: 18200 },
];

const weeklyActiveUsers = [
  { week: "W1", users: 820 },
  { week: "W2", users: 940 },
  { week: "W3", users: 1010 },
  { week: "W4", users: 1180 },
  { week: "W5", users: 1090 },
  { week: "W6", users: 1320 },
];

const signupTrend = [
  { month: "Jan", signups: 420 },
  { month: "Feb", signups: 510 },
  { month: "Mar", signups: 680 },
  { month: "Apr", signups: 640 },
  { month: "May", signups: 790 },
  { month: "Jun", signups: 910 },
];

const multiSeries = [
  { month: "Jan", revenue: 12400, users: 820 },
  { month: "Feb", revenue: 13850, users: 940 },
  { month: "Mar", revenue: 15200, users: 1010 },
];

const dashboardData = [
  { month: "Apr", revenue: 14100 },
  { month: "May", revenue: 16750 },
  { month: "Jun", revenue: 18200 },
];

const engagement = [
  { metric: "Docs", score: 92 },
  { metric: "CLI", score: 86 },
  { metric: "Theme", score: 78 },
  { metric: "A11y", score: 88 },
  { metric: "Mobile", score: 74 },
];

const radialScores = [
  {
    name: "docs",
    value: 92,
    fill: "var(--color-docs)",
  },
  {
    name: "cli",
    value: 86,
    fill: "var(--color-cli)",
  },
  {
    name: "theme",
    value: 78,
    fill: "var(--color-theme)",
  },
  {
    name: "a11y",
    value: 88,
    fill: "var(--color-a11y)",
  },
  {
    name: "mobile",
    value: 74,
    fill: "var(--color-mobile)",
  },
];

const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

const usersConfig = {
  users: {
    label: "Active users",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

const signupsConfig = {
  signups: {
    label: "Signups",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

const dashboardConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-chart-1)",
  },
  users: {
    label: "Active users",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

const radarConfig = {
  score: {
    label: "Score",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

const radialConfig = {
  docs: {
    label: "Docs",
    color: "var(--color-chart-1)",
  },
  cli: {
    label: "CLI",
    color: "var(--color-chart-2)",
  },
  theme: {
    label: "Theme",
    color: "var(--color-chart-3)",
  },
  a11y: {
    label: "A11y",
    color: "var(--color-chart-4)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-chart-5)",
  },
} satisfies ChartConfig;

function seriesDot(colorVar: string) {
  return {
    r: 4,
    fill: "var(--color-foreground)",
    stroke: colorVar,
    strokeWidth: 2,
  };
}

function seriesActiveDot(colorVar: string) {
  return {
    r: 6,
    fill: "var(--color-foreground)",
    stroke: colorVar,
    strokeWidth: 2,
  };
}

export function RevenueLinePreview() {
  return (
    <ChartContainer config={revenueConfig} className="h-48 w-full max-w-lg">
      <LineChart data={monthlyRevenue} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={seriesDot("var(--color-revenue)")}
          activeDot={seriesActiveDot("var(--color-revenue)")}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function UsersBarPreview() {
  return (
    <ChartContainer config={usersConfig} className="h-48 w-full max-w-lg">
      <BarChart
        data={weeklyActiveUsers}
        barCategoryGap="14%"
        accessibilityLayer
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar
          dataKey="users"
          fill="var(--color-users)"
          radius={6}
          maxBarSize={48}
          isAnimationActive
          animationDuration={900}
          animationEasing="ease-out"
          activeBar={false}
        />
      </BarChart>
    </ChartContainer>
  );
}

export function SignupsAreaPreview() {
  return (
    <ChartContainer config={signupsConfig} className="h-48 w-full max-w-lg">
      <AreaChart data={signupTrend} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="signups"
          type="monotone"
          fill="var(--color-signups)"
          fillOpacity={0.2}
          stroke="var(--color-signups)"
          strokeWidth={2}
          isAnimationActive
          animationDuration={800}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function LegendPreview() {
  return (
    <ChartContainer config={dashboardConfig} className="h-52 w-full max-w-lg">
      <LineChart data={multiSeries} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={seriesDot("var(--color-revenue)")}
          activeDot={seriesActiveDot("var(--color-revenue)")}
        />
        <Line
          dataKey="users"
          stroke="var(--color-users)"
          strokeWidth={2}
          dot={seriesDot("var(--color-users)")}
          activeDot={seriesActiveDot("var(--color-users)")}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function RadarPreview() {
  return (
    <ChartContainer
      config={radarConfig}
      className="mx-auto h-56 w-full max-w-sm"
    >
      <RadarChart data={engagement} accessibilityLayer>
        <PolarGrid className="stroke-border/40" />
        <PolarAngleAxis dataKey="metric" className="text-xs" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar
          dataKey="score"
          fill="var(--color-score)"
          fillOpacity={0.2}
          stroke="var(--color-score)"
          strokeWidth={2}
          isAnimationActive
          animationDuration={900}
        />
      </RadarChart>
    </ChartContainer>
  );
}

export function RadialPreview() {
  return (
    <ChartContainer
      config={radialConfig}
      className="mx-auto aspect-square h-64 max-w-[18rem]"
    >
      <RadialBarChart
        data={radialScores}
        startAngle={90}
        endAngle={-270}
        innerRadius="18%"
        outerRadius="92%"
        accessibilityLayer
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 18]}
        />
        <ChartTooltip
          content={<ChartTooltipContent nameKey="name" hideLabel />}
        />
        <RadialBar
          dataKey="value"
          background
          cornerRadius={6}
          isAnimationActive
          animationDuration={900}
        />
        <ChartLegend
          content={
            <ChartLegendContent
              nameKey="name"
              className="-translate-y-1 flex-wrap gap-2"
            />
          }
        />
      </RadialBarChart>
    </ChartContainer>
  );
}

export function DashboardPreview() {
  return (
    <Card className="w-full max-w-md text-left">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Monthly revenue</CardTitle>
          <CardDescription>Last three closed months.</CardDescription>
        </div>
        <Badge variant="secondary">+12.4%</Badge>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="h-44 w-full">
          <BarChart
            data={dashboardData}
            barCategoryGap="18%"
            accessibilityLayer
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={6}
              maxBarSize={52}
              isAnimationActive
              animationDuration={900}
              activeBar={false}
            />
          </BarChart>
        </ChartContainer>
        <Button className="mt-4" variant="outline" size="sm">
          Export report
        </Button>
      </CardContent>
    </Card>
  );
}
