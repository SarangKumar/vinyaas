import { readFile } from "node:fs/promises";
import path from "node:path";

import { components } from "@/components/component-meta";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar/avatar";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
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

const activity = [
  ["SK", "Sarang Kumar", "Opened a pull request", "Review"],
  ["AL", "Ada Lovelace", "Published the notes", "Docs"],
  ["VW", "vinyaas-web", "Deployment succeeded", "Production"],
  ["AL", "Ada Lovelace", "Left a comment", "Design"],
  ["SK", "Sarang Kumar", "Updated the catalog", "Registry"],
  ["VW", "vinyaas-web", "Build finished", "CI"],
] as const;

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

const examples: ComponentExample[] = [
  {
    id: "catalog",
    title: "Component list",
    description:
      "The list is the live catalog. The region scrolls natively. A badge and a button sit with each name.",
    preview: (
      <ScrollArea
        className="h-48 w-full max-w-sm text-left"
        aria-label="Catalog"
      >
        <ul className="grid gap-2 pr-2">
          {components.map((component) => (
            <li key={component.slug} className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm">{component.name}</span>
                <Badge variant="outline">{component.category}</Badge>
              </div>
              <Separator />
            </li>
          ))}
        </ul>
        <Button variant="outline" className="mt-2">
          Browse components
        </Button>
      </ScrollArea>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import { Separator } from "@/components/ui/separator/separator";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";
import { components } from "@/components/component-meta";

export function CatalogList() {
  return (
    <ScrollArea className="h-48" aria-label="Catalog">
      <ul>
        {components.map((component) => (
          <li key={component.slug}>
            <span>{component.name}</span>
            <Badge variant="outline">{component.category}</Badge>
            <Separator />
          </li>
        ))}
      </ul>
      <Button variant="outline">Browse components</Button>
    </ScrollArea>
  );
}
`,
  },
  {
    id: "activity",
    title: "Activity",
    description: "Enough rows that the fixed height has to scroll.",
    preview: (
      <ScrollArea
        className="h-48 w-full max-w-sm text-left"
        aria-label="Activity"
      >
        <ul className="grid gap-3 pr-2">
          {activity.map(([initials, name, text, status]) => (
            <li key={text} className="grid gap-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 gap-1">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-sm">{text}</span>
                </div>
                <Badge variant="secondary">{status}</Badge>
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
    <ScrollArea className="h-48" aria-label="Activity">
      <ul>
        <li>
          <Avatar><AvatarFallback>SK</AvatarFallback></Avatar>
          <span>Sarang Kumar</span>
          <span>Opened a pull request</span>
          <Badge variant="secondary">Review</Badge>
          <Separator />
        </li>
      </ul>
    </ScrollArea>
  );
}
`,
  },
  {
    id: "horizontal",
    title: "Horizontal",
    description:
      "A long line scrolls sideways. The page itself stays within the viewport.",
    preview: (
      <ScrollArea
        orientation="horizontal"
        className="w-full max-w-sm"
        aria-label="Command"
      >
        <p className="w-max px-1 py-2 font-mono text-sm">
          pnpm --filter @vinyaas/cli exec vinyaas add scroll-area && pnpm
          typecheck
        </p>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";

export function CommandLine() {
  return (
    <ScrollArea orientation="horizontal" className="max-w-sm" aria-label="Command">
      <p className="w-max font-mono text-sm">
        pnpm --filter @vinyaas/cli exec vinyaas add scroll-area && pnpm typecheck
      </p>
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
        className="h-32 w-full max-w-sm text-left"
        aria-label="Catalog"
      >
        <ul className="grid gap-2">
          {components.slice(0, 8).map((component) => (
            <li key={component.slug} className="text-sm">
              {component.name}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </ComponentReference>
  );
}
