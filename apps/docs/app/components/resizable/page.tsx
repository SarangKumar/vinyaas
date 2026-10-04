import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";

import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { componentPageMetadata } from "@/lib/page-metadata";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable";

export const metadata: Metadata = componentPageMetadata("resizable");

const usage = `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function Workspace() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[240px] rounded-md border">
      <ResizablePanel defaultSize="30%" minSize="20%">
        <div className="p-4">Sidebar</div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize sidebar" />
      <ResizablePanel defaultSize="70%">
        <div className="p-4">Main</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
`;

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
];

const examples: ComponentExample[] = [
  {
    id: "horizontal",
    title: "Horizontal",
    description:
      "A sidebar and main content split. Drag or focus the handle and use arrow keys to resize.",
    preview: (
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
    ),
    code: `<ResizablePanelGroup orientation="horizontal" className="min-h-[220px] rounded-md border">
  <ResizablePanel defaultSize="32%" minSize="20%" maxSize="50%">
    <div>Sidebar</div>
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="Resize sidebar" />
  <ResizablePanel defaultSize="68%">
    <div>Main content</div>
  </ResizablePanel>
</ResizablePanelGroup>`,
  },
  {
    id: "vertical",
    title: "Vertical",
    description:
      "Header, content, and bottom panel stacked with two resize handles.",
    preview: (
      <ResizablePanelGroup
        orientation="vertical"
        className="border-border min-h-[280px] w-full max-w-2xl rounded-md border"
      >
        <ResizablePanel defaultSize="22%" minSize="12%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Header
          </div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize header" />
        <ResizablePanel defaultSize="56%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Content
          </div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize bottom panel" />
        <ResizablePanel defaultSize="22%" minSize="12%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Bottom panel
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `<ResizablePanelGroup orientation="vertical" className="min-h-[280px] rounded-md border">
  <ResizablePanel defaultSize="22%" minSize="12%">
    <div>Header</div>
  </ResizablePanel>
  <ResizableHandle aria-label="Resize header" />
  <ResizablePanel defaultSize="56%">
    <div>Content</div>
  </ResizablePanel>
  <ResizableHandle aria-label="Resize bottom panel" />
  <ResizablePanel defaultSize="22%" minSize="12%">
    <div>Bottom panel</div>
  </ResizablePanel>
</ResizablePanelGroup>`,
  },
  {
    id: "multiple",
    title: "Multiple panels",
    description:
      "Three columns with independent handles. Each handle stays in the tab order.",
    preview: (
      <ResizablePanelGroup
        orientation="horizontal"
        className="border-border min-h-[200px] w-full max-w-2xl rounded-md border"
      >
        <ResizablePanel defaultSize="25%" minSize="15%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Nav
          </div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize navigation" />
        <ResizablePanel defaultSize="45%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Editor
          </div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize inspector" />
        <ResizablePanel defaultSize="30%" minSize="15%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Inspector
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `<ResizablePanelGroup orientation="horizontal" className="min-h-[200px] rounded-md border">
  <ResizablePanel defaultSize="25%" minSize="15%">
    <div>Nav</div>
  </ResizablePanel>
  <ResizableHandle aria-label="Resize navigation" />
  <ResizablePanel defaultSize="45%">
    <div>Editor</div>
  </ResizablePanel>
  <ResizableHandle aria-label="Resize inspector" />
  <ResizablePanel defaultSize="30%" minSize="15%">
    <div>Inspector</div>
  </ResizablePanel>
</ResizablePanelGroup>`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Use Resizable for application shells where users need to adjust sidebars or tool panes. Label every handle.",
  preview: (
    <ResizablePanelGroup
      orientation="horizontal"
      className="border-border bg-card min-h-[240px] w-full max-w-2xl overflow-hidden rounded-md border"
    >
      <ResizablePanel defaultSize="28%" minSize="18%">
        <div className="flex h-full flex-col gap-2 p-4 text-sm">
          <p className="font-medium">Projects</p>
          <p className="text-muted-foreground">Marketing</p>
          <p className="text-muted-foreground">Docs site</p>
          <p className="text-muted-foreground">CLI</p>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize project list" />
      <ResizablePanel defaultSize="72%">
        <div className="flex h-full flex-col gap-2 p-4 text-sm">
          <p className="font-medium">Overview</p>
          <p className="text-muted-foreground">
            Resize the project list with the handle. Arrow keys work when the
            handle is focused.
          </p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  code: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function DashboardShell() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[240px] rounded-md border">
      <ResizablePanel defaultSize="28%" minSize="18%">
        <div className="p-4">Projects</div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize project list" />
      <ResizablePanel defaultSize="72%">
        <div className="p-4">Overview</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
`,
};

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
            styling. Use it for sidebars, split editors, and stacked dashboard
            panes. Prefer percentage strings for sizes (
            <code>&quot;30%&quot;</code>).
          </p>
          <p>
            Install with <code>vinyaas add resizable</code>, or include it via{" "}
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
              Hit targets are expanded with a larger after-pseudo for easier
              pointer and touch use.
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
