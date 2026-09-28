import { readFile } from "node:fs/promises";
import path from "node:path";

import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar/avatar";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Separator } from "@/registry/new-york/ui/separator/separator";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area/scroll-area";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";

const usage = `import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";

export function Notes() {
  return (
    <ScrollArea className="h-72" aria-label="Notes">
      <p>A long note.</p>
    </ScrollArea>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "orientation",
    type: '"vertical" | "horizontal" | "both"',
    defaultValue: '"vertical"',
    description: "Chooses which axes use native overflow.",
  },
  {
    prop: "className",
    type: "string",
    description:
      "Merged onto the scroll container with cn. Set the height or width here.",
  },
];

const feed = [
  ["SK", "Sarah", "created a new project", "Production Dashboard", "2m"],
  ["AL", "Alex", "deployed an update", "v2.4.1", "8m"],
  ["SK", "Sarah", "invited a reviewer", "Design notes", "21m"],
  ["AL", "Alex", "closed an issue", "Keyboard focus", "1h"],
  ["SK", "Sarah", "published a release", "v0.2", "3h"],
] as const;

const shortcuts = [
  ["⌘K", "Open command menu"],
  ["⌘P", "Quick open"],
  ["⌘⇧P", "Command palette"],
  ["⌘B", "Toggle sidebar"],
  ["⌘.", "Open settings"],
] as const;

const matrix = ["Web", "Docs", "CLI", "Registry", "Preview", "Release"];

const shortcutCode = `import { Kbd } from "@/components/ui/kbd/kbd";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";

export function ShortcutRow() {
  return (
    <ScrollArea
      orientation="horizontal"
      className="border-border bg-background max-w-sm rounded-md border"
      aria-label="Shortcuts"
    >
      <ul className="flex w-max gap-4 p-3">
        <li className="flex items-center gap-2">
          <Kbd>⌘K</Kbd>
          <span>Open command menu</span>
        </li>
        <li className="flex items-center gap-2">
          <Kbd>⌘P</Kbd>
          <span>Quick open</span>
        </li>
        <li className="flex items-center gap-2">
          <Kbd>⌘⇧P</Kbd>
          <span>Command palette</span>
        </li>
      </ul>
    </ScrollArea>
  );
}
`;

const examples: ComponentExample[] = [
  {
    id: "activity",
    title: "Recent activity",
    description:
      "A fixed height and a border make the vertical scroll container obvious. The feed is taller than the box.",
    preview: (
      <ScrollArea
        className="border-border bg-background h-56 w-full max-w-sm rounded-md border text-left"
        aria-label="Recent activity"
      >
        <ul>
          {feed.map(([initials, name, action, detail, time]) => (
            <li key={`${name}-${detail}`} className="grid gap-3 p-3">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{name}</span> {action}
                  </p>
                  <p className="text-muted-foreground text-sm">{detail}</p>
                </div>
                <Badge variant="outline">{time}</Badge>
              </div>
              <Separator />
            </li>
          ))}
        </ul>
      </ScrollArea>
    ),
    code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import { Separator } from "@/components/ui/separator/separator";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";

export function ActivityFeed() {
  return (
    <ScrollArea
      className="border-border bg-background h-56 max-w-sm rounded-md border"
      aria-label="Recent activity"
    >
      <ul>
        <li>
          <Avatar><AvatarFallback>SK</AvatarFallback></Avatar>
          <span>Sarah created a new project</span>
          <span>Production Dashboard</span>
          <Badge variant="outline">2m</Badge>
          <Separator />
        </li>
      </ul>
    </ScrollArea>
  );
}
`,
  },
  {
    id: "shortcuts",
    title: "Shortcuts",
    description:
      "The row is wider than the bordered container, so it scrolls sideways. The page width does not grow with it.",
    preview: (
      <ScrollArea
        orientation="horizontal"
        className="border-border bg-background w-full max-w-sm rounded-md border"
        aria-label="Shortcuts"
      >
        <ul className="flex w-max gap-4 p-3">
          {shortcuts.map(([keys, label]) => (
            <li key={label} className="flex items-center gap-2 text-sm">
              <span className="border-border rounded-md border px-2 py-1 font-medium">
                {keys}
              </span>
              <span className="whitespace-nowrap">{label}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    ),
    code: { tsx: shortcutCode, jsx: shortcutCode },
  },
  {
    id: "matrix",
    title: "Both axes",
    description:
      'orientation="both" scrolls a wide grid that is also taller than the frame.',
    preview: (
      <ScrollArea
        orientation="both"
        className="border-border bg-background h-48 w-full max-w-sm rounded-md border"
        aria-label="Deployments"
      >
        <div className="w-max p-3">
          {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day) => (
            <div key={day} className="mb-2 flex gap-2">
              {matrix.map((column) => (
                <div
                  key={`${day}-${column}`}
                  className="border-border w-28 shrink-0 rounded-md border px-2 py-2 text-sm"
                >
                  <p className="font-medium">{column}</p>
                  <p className="text-muted-foreground">{day}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";

export function DeploymentMatrix() {
  return (
    <ScrollArea
      orientation="both"
      className="border-border bg-background h-48 max-w-sm rounded-md border"
      aria-label="Deployments"
    >
      <div className="w-max p-3">
        <div className="flex gap-2">
          <div className="w-28">Web</div>
          <div className="w-28">Docs</div>
          <div className="w-28">CLI</div>
          <div className="w-28">Registry</div>
          <div className="w-28">Preview</div>
          <div className="w-28">Release</div>
        </div>
      </div>
    </ScrollArea>
  );
}
`,
  },
];

export default async function ScrollAreaPage() {
  const source = await readFile(
    path.join(
      process.cwd(),
      "registry/new-york/ui/scroll-area/scroll-area.tsx",
    ),
    "utf8",
  );

  return (
    <ComponentReference
      title="Scroll Area"
      description="A native scroll container with a thin scrollbar."
      overview={
        <p>
          ScrollArea uses the browser&apos;s own scrolling. Set a height or
          width with <code>className</code>. The scrollbar is the platform
          scrollbar, styled where the browser allows it. Keyboard, wheel, and
          touch scrolling stay native.
        </p>
      }
      install="vinyaas add scroll-area"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/scroll-area/scroll-area.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <p>
          The container is a normal div. It is focusable so keyboard users can
          scroll it. It does not add a role. ScrollBar is hidden from assistive
          technology because the native container already scrolls.
        </p>
      }
      source={source}
    >
      <ScrollArea
        className="border-border bg-background h-40 w-full max-w-sm rounded-md border text-left"
        aria-label="Recent activity"
      >
        <ul className="grid">
          {feed.slice(0, 4).map(([initials, name, action, detail]) => (
            <li key={detail} className="flex items-center gap-3 p-3 text-sm">
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span>
                {name} {action}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </ComponentReference>
  );
}
