"use client";
import type { ControlValues } from "@/components/component-demo";
import { Badge, type BadgeVariant } from "@/registry/new-york/ui/badge";
export function BadgePreview({ values }: { values: ControlValues }) {
  return <Badge variant={values.variant as BadgeVariant}>Badge</Badge>;
}
