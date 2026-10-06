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
  FiltersSheetDemo,
  MobileNavSheetDemo,
  SettingsSheetDemo,
  SidesSheetDemo,
} from "./sheet-demos";

export const metadata: Metadata = componentPageMetadata("sheet");

const usage = `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function InviteSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">Invite teammate</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Invite to workspace</SheetTitle>
          <SheetDescription>
            Send an email invite. Members can join projects after they accept.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="priya@company.com" />
        </div>
        <SheetFooter>
          <SheetClose>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Send invite</Button>
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
    title: "Invite teammate",
    description:
      "A right sheet for a short invite form with role selection and footer actions.",
    preview: <BasicSheetDemo />,
    code: usage,
  },
  {
    id: "sides",
    title: "Sides",
    description:
      "Each edge supports a different workflow—profile, docs, status, and cart.",
    preview: <SidesSheetDemo />,
    code: `import { Button } from "@/components/ui/button";
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

export function SheetSides() {
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button variant="outline">Edit profile</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Update how your name appears across the workspace.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>
              <Button>Continue</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {/* Also try side="left" | "top" | "bottom" */}
    </>
  );
}
`,
  },
  {
    id: "settings",
    title: "Project settings",
    description:
      "A settings form sheet composing Label, Input, Select, Switch, and Button.",
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

export function ProjectSettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">Settings</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>
            Name, visibility, and deployment alerts.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-2">
          <Label htmlFor="name">Project name</Label>
          <Input id="name" defaultValue="vinyaas-web" />
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
    title: "Deployment details",
    description:
      "Inspect a deployment from a list—status, metadata, logs, and promote actions.",
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

export function DeploymentDetailsSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Inspect
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>vinyaas-web</SheetTitle>
            <SheetDescription>feat: sheet polish</SheetDescription>
          </SheetHeader>
          <Badge variant="secondary">Ready</Badge>
          <SheetFooter>
            <Button variant="outline" size="sm">
              View logs
            </Button>
            <Button size="sm">Promote</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
`,
  },
  {
    id: "filters",
    title: "Filters",
    description:
      "A board filter sheet with status, priority checkboxes, and an assigned-to-me switch.",
    preview: <FiltersSheetDemo />,
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

export function FiltersSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">
          Filters
          <Badge variant="secondary" className="ml-1.5">
            3
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow issues without leaving the board.
          </SheetDescription>
        </SheetHeader>
        <div className="flex items-center gap-2">
          <Checkbox id="high" defaultChecked />
          <Label htmlFor="high">High</Label>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="mine">Assigned to me</Label>
          <Switch id="mine" />
        </div>
        <SheetFooter>
          <SheetClose>
            <Button>Apply filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
`,
  },
  {
    id: "mobile-nav",
    title: "Mobile navigation",
    description:
      "A left sheet for workspace navigation with sections and a signed-in user footer.",
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
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate the workspace on smaller screens.
          </SheetDescription>
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
          Sheet is a modal panel that slides in from an edge of the viewport.
          Prefer it for forms, record details, filters, and mobile navigation.
          Use Dialog for centered tasks and Alert Dialog for destructive
          confirmations.
        </p>
      }
      install="vinyaas add sheet"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/sheet/index.tsx</code> with <code>sheet.css</code>
          . Enter and exit motion live in that CSS file and respect reduced
          motion.
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
