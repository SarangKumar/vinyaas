import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area";
import { Separator } from "@/registry/new-york/ui/separator";

export const usage = `import {
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

export const examples: ComponentExample[] = [
  {
    id: "horizontal",
    title: "Horizontal split",
    description:
      "Sidebar + content. Horizontal resize uses a padded 2×3 secondary grip; drag or focus and use arrow keys.",
    preview: (
      <ResizablePanelGroup
        orientation="horizontal"
        className="border-border min-h-[180px] w-full max-w-2xl rounded-md border"
      >
        <ResizablePanel defaultSize="32%" minSize="20%" maxSize="48%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
            Sidebar
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize sidebar" />
        <ResizablePanel defaultSize="68%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
            Content
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `<ResizablePanelGroup orientation="horizontal" className="min-h-[180px] rounded-md border">
  <ResizablePanel defaultSize="32%" minSize="20%" maxSize="48%">
    <div>Sidebar</div>
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="Resize sidebar" />
  <ResizablePanel defaultSize="68%">
    <div>Content</div>
  </ResizablePanel>
</ResizablePanelGroup>`,
  },
  {
    id: "vertical",
    title: "Vertical split",
    description:
      "Editor above terminal. Vertical resize uses the same 2×3 grip rotated 90°.",
    preview: (
      <ResizablePanelGroup
        orientation="vertical"
        className="border-border min-h-[220px] w-full max-w-2xl rounded-md border"
      >
        <ResizablePanel defaultSize="62%" minSize="30%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Editor
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize terminal" />
        <ResizablePanel defaultSize="38%" minSize="18%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
            Terminal
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `<ResizablePanelGroup orientation="vertical" className="min-h-[220px] rounded-md border">
  <ResizablePanel defaultSize="62%" minSize="30%">
    <div>Editor</div>
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="Resize terminal" />
  <ResizablePanel defaultSize="38%" minSize="18%">
    <div>Terminal</div>
  </ResizablePanel>
</ResizablePanelGroup>`,
  },
  {
    id: "blocks",
    title: "Separate blocks",
    description:
      'variant="blocks" turns each panel into its own bordered block with a small gutter between them. The gutter is the drag target and shows a three-dot grip, which rotates for vertical groups.',
    preview: (
      <ResizablePanelGroup
        orientation="horizontal"
        variant="blocks"
        className="min-h-[200px] w-full max-w-2xl"
      >
        <ResizablePanel defaultSize="35%" minSize="20%" maxSize="60%">
          <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
            Inbox
          </div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize inbox" />
        <ResizablePanel
          defaultSize="65%"
          className="overflow-visible rounded-none border-0 bg-transparent"
        >
          <ResizablePanelGroup orientation="vertical" variant="blocks">
            <ResizablePanel defaultSize="60%" minSize="25%">
              <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
                Message
              </div>
            </ResizablePanel>
            <ResizableHandle aria-label="Resize reply" />
            <ResizablePanel defaultSize="40%" minSize="20%">
              <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
                Reply
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `<ResizablePanelGroup orientation="horizontal" variant="blocks" className="min-h-[200px]">
  <ResizablePanel defaultSize="35%" minSize="20%" maxSize="60%">
    <div>Inbox</div>
  </ResizablePanel>
  <ResizableHandle aria-label="Resize inbox" />
  <ResizablePanel defaultSize="65%" className="overflow-visible rounded-none border-0 bg-transparent">
    <ResizablePanelGroup orientation="vertical" variant="blocks">
      <ResizablePanel defaultSize="60%" minSize="25%">
        <div>Message</div>
      </ResizablePanel>
      <ResizableHandle aria-label="Resize reply" />
      <ResizablePanel defaultSize="40%" minSize="20%">
        <div>Reply</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "Sidebar navigation with a main column: header card, metrics, and scrollable content. Uses Card, Badge, Button, Separator, and Scroll Area.",
    preview: (
      <ResizablePanelGroup
        orientation="horizontal"
        className="border-border bg-card min-h-[320px] w-full max-w-3xl overflow-hidden rounded-md border"
      >
        <ResizablePanel defaultSize="28%" minSize="18%" maxSize="40%">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-2 p-3">
              <p className="text-sm font-medium">Workspace</p>
              <Badge variant="outline">Live</Badge>
            </div>
            <Separator />
            <ScrollArea className="h-full min-h-0 flex-1 p-2">
              <nav className="flex flex-col gap-0.5 text-sm">
                {["Overview", "Projects", "Billing", "Members", "Settings"].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      className="hover:bg-muted rounded-md px-2 py-1.5 text-left"
                    >
                      {item}
                    </button>
                  ),
                )}
              </nav>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize sidebar" />
        <ResizablePanel defaultSize="72%" minSize="45%">
          <div className="flex h-full min-h-0 flex-col gap-3 p-3">
            <Card size="sm" className="shadow-none">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>
                      Resize the sidebar. Arrow keys work when the handle is
                      focused.
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    Export
                  </Button>
                </div>
              </CardHeader>
            </Card>
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
              <Card size="sm" className="shadow-none">
                <CardHeader>
                  <CardDescription>Active projects</CardDescription>
                  <CardTitle className="text-2xl">18</CardTitle>
                </CardHeader>
              </Card>
              <Card size="sm" className="shadow-none">
                <CardHeader>
                  <CardDescription>Open issues</CardDescription>
                  <CardTitle className="text-2xl">42</CardTitle>
                </CardHeader>
              </Card>
              <Card size="sm" className="col-span-2 shadow-none">
                <CardContent className="text-muted-foreground pt-4 text-sm">
                  Nested groups are optional here — the main column is a single
                  panel filled with Vinyaas primitives.
                </CardContent>
              </Card>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function DashboardLayout() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[320px] rounded-md border">
      <ResizablePanel defaultSize="28%" minSize="18%" maxSize="40%">
        <ScrollArea className="h-full p-2">{/* nav */}</ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize sidebar" />
      <ResizablePanel defaultSize="72%" minSize="45%">
        <Card>{/* header + metrics */}</Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}`,
  },
];

/** IDE-style nested layout — thin dividers only, no grip affordances. */
export const inPractice: ComponentInPractice = {
  description:
    "Prefer nested groups when a pane needs its own axis. Label every handle and set minSize so panels stay usable. IDE and editor shells usually omit withHandle — keep the divider thin.",
  preview: (
    <ResizablePanelGroup
      orientation="horizontal"
      className="border-border bg-card min-h-[300px] w-full max-w-3xl overflow-hidden rounded-md border font-mono text-xs"
    >
      <ResizablePanel defaultSize="22%" minSize="14%" maxSize="36%">
        <div className="flex h-full flex-col">
          <p className="text-muted-foreground px-3 py-2 text-[0.7rem] tracking-wide uppercase">
            Explorer
          </p>
          <Separator />
          <ScrollArea className="min-h-0 flex-1 px-2 py-2">
            <ul className="text-foreground flex flex-col gap-1">
              <li>app/</li>
              <li className="pl-3">page.tsx</li>
              <li className="pl-3">layout.tsx</li>
              <li>components/</li>
              <li className="pl-3">ui/</li>
              <li className="text-primary pl-6">resizable.tsx</li>
            </ul>
          </ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle aria-label="Resize explorer" />
      <ResizablePanel defaultSize="78%" minSize="40%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="62%" minSize="30%">
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-foreground">resizable.tsx</span>
                <Badge variant="secondary" className="font-sans">
                  Edited
                </Badge>
              </div>
              <Separator />
              <ScrollArea className="text-muted-foreground min-h-0 flex-1 p-3 leading-5">
                <pre className="whitespace-pre-wrap">{`export function ResizableHandle() {
  // Focus + drag resize boundary
}`}</pre>
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize terminal" />
          <ResizablePanel defaultSize="38%" minSize="18%">
            <div className="bg-muted/40 flex h-full flex-col">
              <p className="text-muted-foreground px-3 py-1.5 text-[0.7rem] tracking-wide uppercase">
                Terminal
              </p>
              <Separator />
              <ScrollArea className="text-muted-foreground min-h-0 flex-1 p-3">
                <p>$ pnpm add react-resizable-panels</p>
                <p>$ vinyaas add resizable</p>
                <p className="text-foreground">✓ Installed resizable</p>
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  code: `<ResizablePanelGroup orientation="horizontal" className="min-h-[300px] rounded-md border">
  <ResizablePanel defaultSize="22%" minSize="14%" maxSize="36%">
    {/* Explorer */}
  </ResizablePanel>
  <ResizableHandle aria-label="Resize explorer" />
  <ResizablePanel defaultSize="78%" minSize="40%">
    <ResizablePanelGroup orientation="vertical">
      <ResizablePanel defaultSize="62%" minSize="30%">
        {/* Editor */}
      </ResizablePanel>
      <ResizableHandle aria-label="Resize terminal" />
      <ResizablePanel defaultSize="38%" minSize="18%">
        {/* Terminal */}
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`,
};
