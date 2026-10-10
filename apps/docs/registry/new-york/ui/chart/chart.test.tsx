import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartContainer, type ChartConfig } from ".";

const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
];

const config = {
  revenue: {
    label: "Revenue",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

describe("Chart", () => {
  it("renders ChartContainer for line and bar charts", () => {
    const { container, rerender } = render(
      <ChartContainer config={config} className="h-48 w-full">
        <LineChart data={revenueData}>
          <Line dataKey="revenue" stroke="var(--color-revenue)" />
        </LineChart>
      </ChartContainer>,
    );

    expect(container.querySelector('[data-slot="chart"]')).toBeTruthy();

    rerender(
      <ChartContainer config={config} className="h-48 w-full">
        <BarChart data={revenueData}>
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            activeBar={false}
          />
        </BarChart>
      </ChartContainer>,
    );

    expect(container.querySelector('[data-slot="chart"]')).toBeTruthy();
  });

  it("renders a horizontal bar chart with the vertical layout", () => {
    const { container } = render(
      <ChartContainer config={config} className="h-48 w-full">
        <BarChart data={revenueData} layout="vertical">
          <XAxis type="number" hide />
          <YAxis dataKey="month" type="category" />
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            activeBar={false}
          />
        </BarChart>
      </ChartContainer>,
    );

    expect(container.querySelector('[data-slot="chart"]')).toBeTruthy();
  });
});
