import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  BasicSheetDemo,
  DashboardSheetDemo,
  MobileNavSheetDemo,
  SettingsSheetDemo,
  SidesSheetDemo,
} from "./sheet-demos";

export const metadata: Metadata = componentPageMetadata("sheet");

const usage = `import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function ProjectSettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>
            Manage the settings for this project.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "open",
    type: "boolean",
    description: "Controlled open state.",
  },
  {
    prop: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    description: "Opens the sheet on first render when uncontrolled.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Called when the sheet opens or closes.",
  },
  {
    prop: "side",
    type: '"left" | "right" | "top" | "bottom"',
    defaultValue: '"right"',
    description: "On SheetContent, sets the slide-in edge and layout.",
  },
  {
    prop: "showCloseButton",
    type: "boolean",
    defaultValue: "true",
    description: "On SheetContent, shows the built-in Close control.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the part with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description:
      "A right-side sheet with title, description, and footer actions.",
    preview: <BasicSheetDemo />,
    code: usage,
  },
  {
    id: "sides",
    title: "Sides",
    description: "Sheets can slide in from any edge.",
    preview: <SidesSheetDemo />,
    code: `import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetSides() {
  return (
    <>
      {(["right", "left", "top", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>{side} sheet</SheetTitle>
              <SheetDescription>
                Slides in from the {side} edge.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </>
  );
}
`,
  },
  {
    id: "settings",
    title: "Settings",
    description:
      "A form sheet composing Label, Input, Select, Switch, and Button.",
    preview: <SettingsSheetDemo />,
    code: `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

export function SettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">Edit settings</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>
            Update name, visibility, and notifications.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-2">
          <Label htmlFor="name">Project name</Label>
          <Input id="name" defaultValue="vinyaas-web" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="visibility">Visibility</Label>
          <Select defaultValue="private">
            <SelectTrigger id="visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="alerts">Deploy alerts</Label>
          <Switch id="alerts" defaultChecked />
        </div>
        <SheetFooter>
          <SheetClose>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
`,
  },
  {
    id: "dashboard",
    title: "Dashboard details",
    description:
      "Selecting a project opens a sheet with status, metadata, and actions.",
    preview: <DashboardSheetDemo />,
    code: `import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function ProjectDetailsSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Details
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Vinyaas</SheetTitle>
            <SheetDescription>Owned by Sarang.</SheetDescription>
          </SheetHeader>
          <Badge variant="secondary">Active</Badge>
          <SheetFooter>
            <Button size="sm">Edit</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
`,
  },
  {
    id: "mobile-nav",
    title: "Mobile navigation",
    description: "A left sheet used as a compact app navigation surface.",
    preview: <MobileNavSheetDemo />,
    code: `import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNavSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="sm" aria-label="Open menu">
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Jump to a section of the app.</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1">
          <SheetClose>
            <a href="#overview">Overview</a>
          </SheetClose>
          <SheetClose>
            <a href="#projects">Projects</a>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
`,
  },
];

export default async function SheetPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/sheet/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Sheet"
      description="A side modal for settings, details, filters, and mobile navigation."
      overview={
        <p>
          Sheet is a modal panel anchored to an edge of the viewport. Prefer it
          for forms, record details, and mobile navigation. Use Dialog for
          centered tasks, Alert Dialog for destructive confirmations, and Drawer
          when you already have a filter-style panel pattern.
        </p>
      }
      install="vinyaas add sheet"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/sheet/index.tsx</code> with <code>sheet.css</code>
          .
        </p>
      }
      usage={usage}
      api={api}
      examples={examples}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            The panel is <code>role=&quot;dialog&quot;</code> and{" "}
            <code>aria-modal=&quot;true&quot;</code>, with title and description
            wired through <code>aria-labelledby</code> and{" "}
            <code>aria-describedby</code>.
          </li>
          <li>
            Focus moves into the sheet on open (usually the Close control) and
            returns to the trigger on close.
          </li>
          <li>Tab and Shift+Tab cycle inside the sheet while it is open.</li>
          <li>
            Escape and overlay click close the sheet. The built-in Close button
            has an accessible name.
          </li>
        </ul>
      }
      source={source}
    >
      <BasicSheetDemo />
    </ComponentReference>
  );
}
