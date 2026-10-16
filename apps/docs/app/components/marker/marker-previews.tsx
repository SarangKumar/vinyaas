"use client";
import type { ControlValues } from "@/components/component-demo";
import {
  Marker,
  MarkerContent,
  type MarkerVariant,
} from "@/registry/new-york/ui/marker";
export function MarkerPreview({ values }: { values: ControlValues }) {
  return (
    <Marker variant={values.variant as MarkerVariant}>
      <MarkerContent>Explored 4 files</MarkerContent>
    </Marker>
  );
}
