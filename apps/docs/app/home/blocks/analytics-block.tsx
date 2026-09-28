import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select/native-select";

const bars = [40, 55, 48, 72, 64, 80, 76];

export function AnalyticsBlock() {
  return (
    <PlayBlock title="Signups">
      <div className="flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight">128</p>
        <Badge variant="secondary">+12%</Badge>
      </div>
      <div className="flex h-16 items-end gap-1" aria-hidden="true">
        {bars.map((height, index) => (
          <div
            key={index}
            className="bg-foreground/80 flex-1 rounded-sm"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <NativeSelect aria-label="Date range" defaultValue="7">
        <NativeSelectOption value="7">Last 7 days</NativeSelectOption>
        <NativeSelectOption value="30">Last 30 days</NativeSelectOption>
      </NativeSelect>
    </PlayBlock>
  );
}
