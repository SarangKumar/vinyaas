import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";

import type { ApiRow } from "@/components/api-table";
import { ComponentReference } from "@/components/component-reference";
import { componentPageMetadata } from "@/lib/page-metadata";

import { Preview, examples, inPractice, usage } from "./examples";

export const metadata: Metadata = componentPageMetadata("drag-and-drop");

const api: ApiRow[] = [
  {
    prop: "items / onReorder",
    type: "UniqueIdentifier[] | Record<string, UniqueIdentifier[]>",
    description:
      "DragDrop: controlled item order. Use an array for one list, or a record of arrays for multiple containers.",
  },
  {
    prop: "id",
    type: "string",
    description:
      "DragDrop: stable id for accessibility markup. Defaults to React useId() so server and client match.",
  },
  {
    prop: "orientation",
    type: '"vertical" | "horizontal"',
    defaultValue: '"vertical"',
    description: "DragDrop: sorting axis and drop indicator direction.",
  },
  {
    prop: "disabledIds",
    type: "UniqueIdentifier[]",
    description: "DragDrop: item ids that cannot be dragged.",
  },
  {
    prop: "id / items",
    type: "string / UniqueIdentifier[]",
    description:
      "DragDropList: container id and that container’s ids (required for multiple containers).",
  },
  {
    prop: "id / disabled",
    type: "UniqueIdentifier / boolean",
    description: "DragDropItem: sortable identity and optional disabled state.",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: '"Reorder"',
    description: "DragDropHandle: accessible name for the activator control.",
  },
];

export default async function DragAndDropPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/drag-and-drop/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Drag & Drop"
      description="Sortable and reorderable interactions for lists, cards, and simple boards."
      overview={
        <>
          <p>
            Drag & Drop provides accessible sortable/reorderable UI for
            dashboards and task lists. It is <strong>not</strong> a file-upload
            drop zone — use <code>file-upload</code> for that.
          </p>
          <p>
            The implementation wraps <code>@dnd-kit</code> for pointer, touch,
            and keyboard sensors, sortable strategies, and live region
            announcements. Prefer <code>DragDropHandle</code> so nested buttons,
            links, and inputs stay interactive.
          </p>
          <p>
            Keyboard: focus the handle, press Space/Enter to pick up, use arrow
            keys to move, Space/Enter to drop, Escape to cancel. Install with{" "}
            <code>vinyaas add drag-and-drop</code> or via{" "}
            <code>vinyaas add --catalog dashboard</code>.
          </p>
        </>
      }
      install="vinyaas add drag-and-drop"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/drag-and-drop/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code> and depends on{" "}
          <code>@dnd-kit/core</code>, <code>@dnd-kit/sortable</code>,{" "}
          <code>@dnd-kit/utilities</code>, <code>clsx</code>, and{" "}
          <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            Drag handles are native buttons with accessible names.{" "}
            <code>@dnd-kit</code> provides sortable keyboard interaction and
            live-region announcements for drag start, over, end, and cancel.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Tab reaches the handle. Space/Enter picks up; arrows move; Escape
              cancels.
            </li>
            <li>
              Focus-visible rings use <code>--ring</code> tokens on the handle.
            </li>
            <li>
              Drop targets show an insertion indicator line in addition to item
              movement.
            </li>
            <li>
              Disabled items expose <code>disabled</code> handles and{" "}
              <code>data-disabled</code> on the item.
            </li>
            <li>
              Touch activation uses a short delay so page scroll remains usable.
            </li>
            <li>
              Item transitions respect <code>prefers-reduced-motion</code>.
            </li>
            <li>
              Multiple containers accept <code>items</code> as a record of id
              arrays (Kanban-style boards). The drag overlay snapshots the
              active item and locks its width/height so cards do not shrink
              while dragging. Keep application state in the parent — this
              component does not persist order.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <Preview />
    </ComponentReference>
  );
}
