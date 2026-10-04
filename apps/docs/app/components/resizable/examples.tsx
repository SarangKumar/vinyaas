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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table";

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
    id: "basic",
    title: "Basic",
    description:
      "Horizontal and vertical splits. Focus a handle and use arrow keys to resize.",
    preview: (
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <ResizablePanelGroup
          orientation="horizontal"
          className="border-border min-h-[180px] w-full rounded-md border"
        >
          <ResizablePanel defaultSize="40%" minSize="20%">
            <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
              Left
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize panels" />
          <ResizablePanel defaultSize="60%">
            <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
              Right
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <ResizablePanelGroup
          orientation="vertical"
          className="border-border min-h-[200px] w-full rounded-md border"
        >
          <ResizablePanel defaultSize="35%" minSize="20%">
            <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
              Top
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize stacked panels" />
          <ResizablePanel defaultSize="65%">
            <div className="text-muted-foreground flex h-full items-center justify-center p-3 text-sm">
              Bottom
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    ),
    code: `<ResizablePanelGroup orientation="horizontal" className="min-h-[180px] rounded-md border">
  <ResizablePanel defaultSize="40%" minSize="20%">
    <div>Left</div>
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="Resize panels" />
  <ResizablePanel defaultSize="60%">
    <div>Right</div>
  </ResizablePanel>
</ResizablePanelGroup>

<ResizablePanelGroup orientation="vertical" className="min-h-[200px] rounded-md border">
  <ResizablePanel defaultSize="35%" minSize="20%">
    <div>Top</div>
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="Resize stacked panels" />
  <ResizablePanel defaultSize="65%">
    <div>Bottom</div>
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
  {
    id: "ide",
    title: "IDE / Workspace",
    description:
      "Nested groups: explorer beside a vertical editor/terminal split. Exercises horizontal + vertical handles and min sizes.",
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
        <ResizableHandle withHandle aria-label="Resize explorer" />
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
            <ResizableHandle withHandle aria-label="Resize terminal" />
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
  <ResizableHandle withHandle aria-label="Resize explorer" />
  <ResizablePanel defaultSize="78%" minSize="40%">
    <ResizablePanelGroup orientation="vertical">
      <ResizablePanel defaultSize="62%" minSize="30%">
        {/* Editor */}
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize terminal" />
      <ResizablePanel defaultSize="38%" minSize="18%">
        {/* Terminal */}
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`,
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Resizable filters sidebar, main metrics cards, and a data table. Adapt this shell for product analytics.",
    preview: (
      <ResizablePanelGroup
        orientation="horizontal"
        className="border-border bg-card min-h-[340px] w-full max-w-3xl overflow-hidden rounded-md border"
      >
        <ResizablePanel defaultSize="26%" minSize="16%" maxSize="38%">
          <div className="flex h-full flex-col gap-3 p-3">
            <p className="text-sm font-medium">Filters</p>
            <Separator />
            <div className="flex flex-col gap-2 text-sm">
              {["Last 7 days", "Last 30 days", "Quarter"].map((label) => (
                <Button
                  key={label}
                  size="sm"
                  variant={label === "Last 30 days" ? "secondary" : "ghost"}
                  className="justify-start"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize filters" />
        <ResizablePanel defaultSize="74%" minSize="45%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="38%" minSize="24%">
              <div className="grid h-full grid-cols-3 gap-2 p-3">
                {[
                  ["Sessions", "12.4k"],
                  ["Conversion", "3.8%"],
                  ["Revenue", "$48k"],
                ].map(([label, value]) => (
                  <Card key={label} size="sm" className="shadow-none">
                    <CardHeader className="gap-1">
                      <CardDescription>{label}</CardDescription>
                      <CardTitle className="text-xl">{value}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ResizablePanel>
            <ResizableHandle aria-label="Resize table" />
            <ResizablePanel defaultSize="62%" minSize="30%">
              <ScrollArea className="h-full p-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel</TableHead>
                      <TableHead>Visitors</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["Organic", "6,210", "+4%"],
                      ["Direct", "3,080", "+1%"],
                      ["Referral", "1,940", "-2%"],
                      ["Paid", "1,170", "+9%"],
                    ].map(([channel, visitors, trend]) => (
                      <TableRow key={channel}>
                        <TableCell>{channel}</TableCell>
                        <TableCell>{visitors}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{trend}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `<ResizablePanelGroup orientation="horizontal" className="min-h-[340px] rounded-md border">
  <ResizablePanel defaultSize="26%" minSize="16%">
    {/* Filters */}
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="Resize filters" />
  <ResizablePanel defaultSize="74%">
    <ResizablePanelGroup orientation="vertical">
      <ResizablePanel defaultSize="38%" minSize="24%">
        {/* Metric cards */}
      </ResizablePanel>
      <ResizableHandle aria-label="Resize table" />
      <ResizablePanel defaultSize="62%" minSize="30%">
        {/* Table */}
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`,
  },
];

export const inPractice: ComponentInPractice = {
  description:
    "Prefer nested groups when a pane needs its own axis. Label every handle, set minSize so panels stay usable, and keep withHandle for discoverability on dense shells.",
  preview: examples.find((example) => example.id === "ide")!.preview,
  code: examples.find((example) => example.id === "ide")!.code,
};
