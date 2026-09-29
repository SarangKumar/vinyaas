"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
  }
>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("Chart components must render inside ChartContainer.");
  }

  return context;
}

function chartVariableStyle(config: ChartConfig) {
  const style: Record<string, string> = {};

  for (const [key, item] of Object.entries(config)) {
    if (!item.color) {
      continue;
    }

    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "");
    style[`--color-${safeKey}`] = item.color;
  }

  return style as React.CSSProperties;
}

export type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
};

export function ChartContainer({
  id,
  className,
  children,
  config,
  style,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        style={{ ...chartVariableStyle(config), ...style }}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-reference-line_line]:stroke-border [&_.recharts-legend-item-text]:text-foreground flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none",
          className,
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

function getPayloadConfig(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return config[key];
  }

  const record = payload as Record<string, unknown>;
  const nested =
    typeof record.payload === "object" && record.payload !== null
      ? (record.payload as Record<string, unknown>)
      : undefined;

  const value = record[key] ?? nested?.[key] ?? key;
  return config[String(value)] ?? config[key];
}

export type ChartTooltipContentProps = React.ComponentProps<"div"> & {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    dataKey?: string | number;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string | number;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  labelFormatter?: (
    label: string | number,
    payload: ChartTooltipContentProps["payload"],
  ) => React.ReactNode;
  formatter?: (
    value: number | string,
    name: string,
    item: NonNullable<ChartTooltipContentProps["payload"]>[number],
    index: number,
    payload: NonNullable<ChartTooltipContentProps["payload"]>,
  ) => React.ReactNode;
};

export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelKey,
  nameKey,
  formatter,
  ...props
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";
  const resolvedLabel = (() => {
    if (hideLabel || label === undefined) {
      return null;
    }

    if (labelFormatter) {
      return labelFormatter(label, payload);
    }

    if (labelKey) {
      const item = getPayloadConfig(config, payload[0], labelKey);
      return item?.label ?? label;
    }

    return label;
  })();

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-32 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
      {...props}
    >
      {!nestLabel && resolvedLabel !== null ? (
        <div className="font-medium">{resolvedLabel}</div>
      ) : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = String(nameKey ? item.payload?.[nameKey] : item.name);
          const itemConfig = getPayloadConfig(config, item, key);
          const indicatorColor =
            item.color ??
            (itemConfig?.color
              ? `var(--color-${key.replace(/[^a-zA-Z0-9_-]/g, "")})`
              : undefined);

          return (
            <div
              key={`${key}-${index}`}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2",
                indicator === "dot" && "items-center",
              )}
            >
              {formatter && item.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, payload)
              ) : (
                <>
                  {!hideIndicator ? (
                    <div
                      className={cn("shrink-0 rounded-[2px]", {
                        "size-2.5": indicator === "dot",
                        "h-2.5 w-1": indicator === "line",
                        "h-0 w-0 border-[1.5px] border-dashed bg-transparent":
                          indicator === "dashed",
                        "my-0.5": nestLabel && indicator === "dashed",
                      })}
                      style={
                        indicatorColor
                          ? {
                              backgroundColor:
                                indicator === "dashed"
                                  ? undefined
                                  : indicatorColor,
                              borderColor: indicatorColor,
                            }
                          : undefined
                      }
                    />
                  ) : null}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center",
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel && resolvedLabel !== null ? (
                        <div className="font-medium">{resolvedLabel}</div>
                      ) : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label ?? item.name}
                      </span>
                    </div>
                    {item.value !== undefined ? (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChartLegend = RechartsPrimitive.Legend;

export type ChartLegendContentProps = React.ComponentProps<"div"> & {
  payload?: Array<{
    value?: string;
    dataKey?: string | number;
    color?: string;
  }>;
  verticalAlign?: "top" | "bottom";
  hideIcon?: boolean;
  nameKey?: string;
};

export function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
  ...props
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
      {...props}
    >
      {payload.map((item) => {
        const key = String(nameKey ? item.dataKey : item.value);
        const itemConfig = config[key];

        return (
          <div
            key={key}
            className="[&>svg]:text-muted-foreground flex items-center gap-1.5"
          >
            {!hideIcon ? (
              <div
                className="size-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor:
                    item.color ??
                    (itemConfig?.color
                      ? `var(--color-${key.replace(/[^a-zA-Z0-9_-]/g, "")})`
                      : undefined),
                }}
              />
            ) : null}
            <span className="text-foreground">
              {itemConfig?.label ?? item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function chartColor(key: keyof ChartConfig | string, fallback: string) {
  const safeKey = String(key).replace(/[^a-zA-Z0-9_-]/g, "");
  return `var(--color-${safeKey}, ${fallback})`;
}
