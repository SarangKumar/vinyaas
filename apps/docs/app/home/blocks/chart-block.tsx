"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

const traffic = [
  { day: "Mon", visits: 420 },
  { day: "Tue", visits: 510 },
  { day: "Wed", visits: 480 },
  { day: "Thu", visits: 620 },
  { day: "Fri", visits: 690 },
  { day: "Sat", visits: 540 },
  { day: "Sun", visits: 460 },
];

const lineConfig = {
  visits: {
    label: "Visits",
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
} satisfies ChartConfig;

const radialScores = [
  { name: "docs", value: 92, fill: "var(--color-docs)" },
  { name: "cli", value: 86, fill: "var(--color-cli)" },
];

export function ChartBlock() {
  return (
    <PlayBlock
      title="Traffic"
      description="Weekly visits with product quality scores."
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs">This week</p>
          <p className="text-foreground text-2xl font-semibold tracking-tight">
            3,720
          </p>
        </div>
        <Badge variant="secondary">+8.2%</Badge>
      </div>
      <ChartContainer config={lineConfig} className="h-36 w-full">
        <LineChart data={traffic} accessibilityLayer>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="visits"
            type="monotone"
            stroke="var(--color-visits)"
            strokeWidth={2}
            dot={{
              r: 3.5,
              fill: "var(--color-foreground)",
              stroke: "var(--color-visits)",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 5.5,
              fill: "var(--color-foreground)",
              stroke: "var(--color-visits)",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ChartContainer>
      <div className="flex items-center gap-4">
        <ChartContainer
          config={radialConfig}
          className="aspect-square h-24 w-24 shrink-0 bg-transparent"
        >
          <RadialBarChart
            data={radialScores}
            startAngle={90}
            endAngle={-270}
            innerRadius="42%"
            outerRadius="96%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" hideLabel />}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              isAnimationActive
              animationDuration={800}
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="min-w-0">
          <p className="text-sm font-medium">Quality rings</p>
          <p className="text-muted-foreground mb-2.5 text-xs">
            Docs and CLI completion.
          </p>
          <ul className="flex flex-col gap-1.5">
            {radialScores.map((item) => {
              const config =
                radialConfig[item.name as keyof typeof radialConfig];

              return (
                <li
                  key={item.name}
                  className="text-muted-foreground flex items-center gap-2 text-xs"
                >
                  <span
                    className="size-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-foreground">{config.label}</span>
                  <span className="tabular-nums">{item.value}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </PlayBlock>
  );
}
