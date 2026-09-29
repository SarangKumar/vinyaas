import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";
import {
  DashboardPreview,
  LegendPreview,
  RadarPreview,
  RadialPreview,
  RevenueLinePreview,
  SignupsAreaPreview,
  UsersBarPreview,
} from "./chart-previews";

export const metadata: Metadata = componentPageMetadata("chart");

const usage = `import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 13850 },
  { month: "Mar", revenue: 15200 },
];

const config = {
  revenue: {
    label: "Revenue",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <ChartContainer config={config} className="h-48 w-full max-w-lg">
      <LineChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={{
            r: 4,
            fill: "var(--color-foreground)",
            stroke: "var(--color-revenue)",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
            fill: "var(--color-foreground)",
            stroke: "var(--color-revenue)",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "config",
    type: "ChartConfig",
    description:
      "Maps data keys to labels and theme colors. Colors become CSS variables on the container.",
  },
  {
    prop: "className",
    type: "string",
    description:
      "On ChartContainer, sets height and width via Tailwind utilities.",
  },
  {
    prop: "content",
    type: "ReactNode",
    description:
      "On ChartTooltip, pass ChartTooltipContent for themed tooltips.",
  },
];

const lineCode = usage;

const barCode = `import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const data = [
  { week: "W1", users: 820 },
  { week: "W2", users: 940 },
  { week: "W3", users: 1010 },
  { week: "W4", users: 1180 },
  { week: "W5", users: 1090 },
  { week: "W6", users: 1320 },
];

const config = {
  users: {
    label: "Active users",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export function ActiveUsersChart() {
  return (
    <ChartContainer config={config} className="h-48 w-full max-w-lg">
      <BarChart data={data} barCategoryGap="14%" accessibilityLayer>
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
          activeBar={false}
        />
      </BarChart>
    </ChartContainer>
  );
}
`;

const areaCode = `import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", signups: 420 },
  { month: "Feb", signups: 510 },
  { month: "Mar", signups: 680 },
  { month: "Apr", signups: 640 },
  { month: "May", signups: 790 },
  { month: "Jun", signups: 910 },
];

const config = {
  signups: {
    label: "Signups",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

export function SignupsChart() {
  return (
    <ChartContainer config={config} className="h-48 w-full max-w-lg">
      <AreaChart data={data} accessibilityLayer>
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
`;

const legendCode = `import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", revenue: 12400, users: 820 },
  { month: "Feb", revenue: 13850, users: 940 },
  { month: "Mar", revenue: 15200, users: 1010 },
];

const config = {
  revenue: { label: "Revenue", color: "var(--color-chart-1)" },
  users: { label: "Active users", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

export function RevenueAndUsersChart() {
  return (
    <ChartContainer config={config} className="h-52 w-full max-w-lg">
      <LineChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={{
            r: 4,
            fill: "var(--color-foreground)",
            stroke: "var(--color-revenue)",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
            fill: "var(--color-foreground)",
            stroke: "var(--color-revenue)",
            strokeWidth: 2,
          }}
        />
        <Line
          dataKey="users"
          stroke="var(--color-users)"
          strokeWidth={2}
          dot={{
            r: 4,
            fill: "var(--color-foreground)",
            stroke: "var(--color-users)",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
            fill: "var(--color-foreground)",
            stroke: "var(--color-users)",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
`;

const radarCode = `import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

const data = [
  { metric: "Docs", score: 92 },
  { metric: "CLI", score: 86 },
  { metric: "Theme", score: 78 },
  { metric: "A11y", score: 88 },
  { metric: "Mobile", score: 74 },
];

const config = {
  score: { label: "Score", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

export function QualityRadar() {
  return (
    <ChartContainer config={config} className="mx-auto h-56 w-full max-w-sm">
      <RadarChart data={data} accessibilityLayer>
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
`;

const radialCode = `import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart } from "recharts";

const data = [
  { name: "docs", value: 92, fill: "var(--color-docs)" },
  { name: "cli", value: 86, fill: "var(--color-cli)" },
  { name: "theme", value: 78, fill: "var(--color-theme)" },
  { name: "a11y", value: 88, fill: "var(--color-a11y)" },
  { name: "mobile", value: 74, fill: "var(--color-mobile)" },
];

const config = {
  docs: { label: "Docs", color: "var(--color-chart-1)" },
  cli: { label: "CLI", color: "var(--color-chart-2)" },
  theme: { label: "Theme", color: "var(--color-chart-3)" },
  a11y: { label: "A11y", color: "var(--color-chart-4)" },
  mobile: { label: "Mobile", color: "var(--color-chart-5)" },
} satisfies ChartConfig;

export function QualityRadial() {
  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square h-64 max-w-[18rem]"
    >
      <RadialBarChart
        data={data}
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
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-1 flex-wrap gap-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
`;

const dashboardCode = `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const data = [
  { month: "Apr", revenue: 14100 },
  { month: "May", revenue: 16750 },
  { month: "Jun", revenue: 18200 },
];

const config = {
  revenue: { label: "Revenue", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

export function RevenueCard() {
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
        <ChartContainer config={config} className="h-44 w-full">
          <BarChart data={data} barCategoryGap="18%" accessibilityLayer>
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
`;

const examples: ComponentExample[] = [
  {
    id: "line",
    title: "Line chart",
    description:
      "Monthly revenue with foreground-filled dots and a larger active hover state.",
    preview: <RevenueLinePreview />,
    code: lineCode,
  },
  {
    id: "bar",
    title: "Bar chart",
    description:
      "Animated weekly active users. Hover does not restyle the bar fill.",
    preview: <UsersBarPreview />,
    code: barCode,
  },
  {
    id: "area",
    title: "Area chart",
    description: "Signup trend with a soft fill using chart tokens.",
    preview: <SignupsAreaPreview />,
    code: areaCode,
  },
  {
    id: "legend",
    title: "Legend and tooltip",
    description: "Two series with labels from ChartConfig.",
    preview: <LegendPreview />,
    code: legendCode,
  },
  {
    id: "radar",
    title: "Radar chart",
    description: "Reusable quality scores across product surfaces.",
    preview: <RadarPreview />,
    code: radarCode,
  },
  {
    id: "radial",
    title: "Radial chart",
    description:
      "Concentric quality scores across docs, CLI, theme, a11y, and mobile.",
    preview: <RadialPreview />,
    code: radialCode,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A dashboard card wraps the chart, badge, and export action in one composition.",
  preview: <DashboardPreview />,
  code: { tsx: dashboardCode, jsx: dashboardCode },
};

export default async function ChartPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/chart/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Chart"
      description="Themed charts for dashboards and product analytics."
      overview={
        <>
          <p>
            Chart wraps <code>recharts</code> with Vinyaas theme tokens. Pass a{" "}
            <code>config</code> object to <code>ChartContainer</code>, then use{" "}
            <code>var(--color-&lt;key&gt;)</code> for strokes and fills. Chart
            tokens are primary-adjacent greys — similar to{" "}
            <code>--primary</code>, not derived from it with{" "}
            <code>color-mix</code>. Map <code>--chart-1</code> through{" "}
            <code>--chart-5</code> in <code>@theme</code> as{" "}
            <code>--color-chart-*</code>.
          </p>
          <p>
            Line, bar, area, radar, and radial charts all share the same
            container. Prefer foreground-filled dots on lines and set{" "}
            <code>activeBar=&#123;false&#125;</code> when you do not want hover
            fills on bars.
          </p>
        </>
      }
      install="vinyaas add chart"
      manual={
        <p>
          Install <code>recharts</code> in the consumer project, then add the
          source at <code>components/ui/chart/index.tsx</code>. The CLI lists{" "}
          <code>recharts</code> as a registry dependency when you run{" "}
          <code>vinyaas add chart</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            Pass <code>accessibilityLayer</code> to Recharts chart components
            for keyboard focus on chart geometry where supported.
          </li>
          <li>
            Provide a visible title and description in surrounding copy or Card
            headers. Tooltips supplement but do not replace textual context.
          </li>
          <li>
            Use distinct series labels in <code>ChartConfig</code> so legends
            and tooltips are not color-only.
          </li>
        </ul>
      }
      source={source}
    >
      <RevenueLinePreview />
    </ComponentReference>
  );
}
