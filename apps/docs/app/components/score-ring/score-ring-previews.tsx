"use client";

import type { ControlValues } from "@/components/component-demo";
import {
  ScoreRing,
  type ScoreRingSize,
} from "@/registry/new-york/ui/score-ring";

export function ScoreRingPreview({ values }: { values: ControlValues }) {
  return (
    <ScoreRing
      value={values.value as number}
      size={values.size as ScoreRingSize}
      showValue={values.showValue as boolean}
      fromColor={(values.fromColor as string) || "#ef4444"}
      toColor={(values.toColor as string) || "#22c55e"}
      label="Score"
    />
  );
}
