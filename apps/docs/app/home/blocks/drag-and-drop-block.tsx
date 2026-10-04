"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import {
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
} from "@/registry/new-york/ui/drag-and-drop";

/**
 * Compact homepage Drag & Drop example — sortable metrics list.
 */
export function DragAndDropBlock() {
  const [items, setItems] = useState([
    "Revenue",
    "Customers",
    "Orders",
    "Activity",
  ]);

  return (
    <PlayBlock
      title="Drag & Drop"
      description="Reorder with the handle — pointer, touch, or keyboard."
    >
      <DragDrop items={items} onReorder={(next) => setItems(next as string[])}>
        <DragDropList className="gap-1.5">
          {items.map((item) => (
            <DragDropItem
              key={item}
              id={item}
              className="flex items-center gap-1 px-1 py-0.5"
            >
              <DragDropHandle
                aria-label={`Reorder ${item}`}
                className="size-8"
              />
              <span className="text-sm font-medium">{item}</span>
            </DragDropItem>
          ))}
        </DragDropList>
      </DragDrop>
    </PlayBlock>
  );
}
