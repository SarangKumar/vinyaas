import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";

import type { ApiRow } from "@/components/api-table";
import { ComponentReference } from "@/components/component-reference";
import { componentPageMetadata } from "@/lib/page-metadata";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable";

import { examples, inPractice, usage } from "./examples";

export const metadata: Metadata = componentPageMetadata("resizable");

const api: ApiRow[] = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description:
      "ResizablePanelGroup layout axis. Matches ARIA orientation conventions.",
  },
  {
    prop: "defaultSize / minSize / maxSize",
    type: "number | string",
    description:
      'Panel size constraints from react-resizable-panels. Prefer percentage strings such as "30%".',
  },
  {
    prop: "withHandle",
    type: "boolean",
    defaultValue: "false",
    description: "ResizableHandle: show a visible grip affordance.",
  },
  {
    prop: "aria-label",
    type: "string",
    description:
      "ResizableHandle: accessible name for the separator when panels are unlabeled.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description:
      "Group or Handle: disables resize interaction for that surface.",
  },
  {
    prop: "disableCursor",
    type: "boolean",
    defaultValue: "false",
    description:
      "Group: turn off library cursor management. Leave false so crossing handles can show a 2D resize cursor.",
  },
];

export default async function ResizablePage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/resizable/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Resizable"
      description="Resizable panel layouts with accessible handles for dashboards."
      overview={
        <>
          <p>
            Resizable wraps <code>react-resizable-panels</code> with Vinyaas
            styling for sidebars, split editors, and stacked dashboard panes.
            Prefer percentage strings for sizes (<code>&quot;30%&quot;</code>).
          </p>
          <p>
            Use <code>orientation=&quot;horizontal&quot;</code> for side-by-side
            panels and <code>orientation=&quot;vertical&quot;</code> for stacked
            panels. Nest groups when a pane needs its own axis — for example an
            explorer beside an editor/terminal split.
          </p>
          <p>
            Handles stay visually thin with an expanded hit target. Single-axis
            cursors follow separator orientation; when horizontal and vertical
            handles cross, the library shows a two-dimensional resize cursor.
            Install with <code>vinyaas add resizable</code> or via{" "}
            <code>vinyaas add --catalog dashboard</code>.
          </p>
        </>
      }
      install="vinyaas add resizable"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/resizable/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code> and depends on{" "}
          <code>react-resizable-panels</code>, <code>clsx</code>, and{" "}
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
            Handles render as ARIA separators from{" "}
            <code>react-resizable-panels</code>. Focus a handle and use arrow
            keys to resize. There is no keyboard trap around the handle.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Provide an <code>aria-label</code> on each{" "}
              <code>ResizableHandle</code> when neighboring panels are not
              otherwise named.
            </li>
            <li>
              Focused handles show a visible <code>focus-visible</code> ring.
            </li>
            <li>
              <code>disabled</code> marks the handle <code>aria-disabled</code>{" "}
              and dims pointer interaction.
            </li>
            <li>
              Hit targets stay larger than the visible bar via a centered{" "}
              <code>::after</code> region; the library also enforces a minimum
              resize target size for fine and coarse pointers.
            </li>
            <li>
              Leave <code>disableCursor</code> unset so crossing horizontal and
              vertical handles can announce a 2D resize affordance.
            </li>
            <li>
              Non-essential motion respects <code>prefers-reduced-motion</code>{" "}
              via <code>motion-reduce:transition-none</code>.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <ResizablePanelGroup
        orientation="horizontal"
        className="border-border min-h-[220px] w-full max-w-2xl rounded-md border"
      >
        <ResizablePanel defaultSize="32%" minSize="20%" maxSize="50%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
            Sidebar
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize sidebar" />
        <ResizablePanel defaultSize="68%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
            Main content
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ComponentReference>
  );
}
