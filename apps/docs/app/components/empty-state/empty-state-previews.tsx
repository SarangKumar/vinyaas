"use client";

import type { ControlValues } from "@/components/component-demo";
import {
  Empty,
  EmptyDescription,
  EmptyTitle,
  type EmptySize,
} from "@/registry/new-york/ui/empty-state";

export function EmptyStatePreview({ values }: { values: ControlValues }) {
  return (
    <Empty size={values.size as EmptySize}>
      <EmptyTitle>No items yet</EmptyTitle>
      <EmptyDescription>Add an item to see it listed here.</EmptyDescription>
    </Empty>
  );
}
