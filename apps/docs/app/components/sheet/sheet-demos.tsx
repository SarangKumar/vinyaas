"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Separator } from "@/registry/new-york/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
} from "@/registry/new-york/ui/sheet";
import { Switch } from "@/registry/new-york/ui/switch";

export function BasicSheetDemo() {
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
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sheet-invite-email">Email</Label>
            <Input
              id="sheet-invite-email"
              type="email"
              placeholder="priya@company.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sheet-invite-role">Role</Label>
            <Select defaultValue="developer">
              <SelectTrigger id="sheet-invite-role" aria-label="Role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose>
            <Button>Send invite</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const sideExamples: Array<{
  side: SheetSide;
  trigger: string;
  title: string;
  description: string;
  body: string;
}> = [
  {
    side: "right",
    trigger: "Edit profile | Right",
    title: "Edit profile",
    description: "Update how your name appears across the workspace.",
    body: "Display name, bio, and avatar live in a right sheet so the page stays in place.",
  },
  {
    side: "left",
    trigger: "Browse docs | Left",
    title: "Documentation",
    description: "Jump to a guide without leaving the current page.",
    body: "Left sheets work well for secondary navigation and documentation indexes.",
  },
  {
    side: "top",
    trigger: "View status | Top",
    title: "Platform status",
    description: "All systems operational · last checked 2m ago.",
    body: "A top sheet keeps short status updates readable without covering the full page.",
  },
  {
    side: "bottom",
    trigger: "Cart (2) | Bottom",
    title: "Your cart",
    description: "Review items before checkout on smaller screens.",
    body: "Bottom sheets suit mobile checkout, confirmations, and quick lists.",
  },
];

export function SidesSheetDemo() {
  return (
    <div className="mx-2 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {sideExamples.map((example) => (
        <Sheet key={example.side}>
          <SheetTrigger>
            <Button variant="outline" size="sm">
              {example.trigger}
            </Button>
          </SheetTrigger>
          <SheetContent side={example.side}>
            <SheetHeader>
              <SheetTitle>{example.title}</SheetTitle>
              <SheetDescription>{example.description}</SheetDescription>
            </SheetHeader>
            <p className="text-muted-foreground text-sm">{example.body}</p>
            <SheetFooter>
              <SheetClose>
                <Button variant="outline" size="sm">
                  Close
                </Button>
              </SheetClose>
              <SheetClose>
                <Button size="sm">Continue</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

export function SettingsSheetDemo() {
  return (
    <div className="border-border flex w-full max-w-md items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">vinyaas-web</p>
        <p className="text-muted-foreground text-xs">Private · us-east-1</p>
      </div>
      <Sheet>
        <SheetTrigger>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-border border-b px-6 py-4">
            <SheetTitle>Project settings</SheetTitle>
            <SheetDescription>
              Name, visibility, and deployment alerts for this project.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
            <div className="grid gap-2">
              <Label htmlFor="sheet-project-name">Project name</Label>
              <Input id="sheet-project-name" defaultValue="vinyaas-web" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sheet-visibility">Visibility</Label>
              <Select defaultValue="private">
                <SelectTrigger id="sheet-visibility" aria-label="Visibility">
                  <SelectValue placeholder="Choose visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Label htmlFor="sheet-deploy-alerts">Deploy alerts</Label>
                <p className="text-muted-foreground text-xs">
                  Email the team when a production deploy fails.
                </p>
              </div>
              <Switch id="sheet-deploy-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Label htmlFor="sheet-preview-urls">Preview URLs</Label>
                <p className="text-muted-foreground text-xs">
                  Generate a unique URL for every pull request.
                </p>
              </div>
              <Switch id="sheet-preview-urls" defaultChecked />
            </div>
          </div>
          <SheetFooter className="border-border border-t px-6 py-4">
            <SheetClose>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <SheetClose>
              <Button>Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

const deployments = [
  {
    id: "d1",
    name: "vinyaas-web",
    commit: "feat: sheet polish",
    author: "SK",
    status: "Ready" as const,
    time: "2m ago",
    region: "iad1",
  },
  {
    id: "d2",
    name: "docs",
    commit: "fix: nav overlap",
    author: "PR",
    status: "Building" as const,
    time: "8m ago",
    region: "sfo1",
  },
  {
    id: "d3",
    name: "marketing",
    commit: "chore: bump deps",
    author: "RK",
    status: "Error" as const,
    time: "1h ago",
    region: "iad1",
  },
];

export function DashboardSheetDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = deployments.find((item) => item.id === selectedId) ?? null;
  const open = selectedId !== null;

  return (
    <div className="border-border w-full max-w-lg overflow-hidden rounded-lg border">
      <div className="border-border flex items-center justify-between border-b px-3 py-2.5">
        <p className="text-sm font-medium">Recent deployments</p>
        <Badge variant="outline">Production</Badge>
      </div>
      <ul className="divide-border divide-y">
        {deployments.map((deployment) => (
          <li
            key={deployment.id}
            className="flex items-center justify-between gap-3 px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">
                  {deployment.author}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {deployment.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {deployment.commit}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedId(deployment.id)}
            >
              Inspect
            </Button>
          </li>
        ))}
      </ul>

      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            setSelectedId(null);
          }
        }}
      >
        <SheetContent side="right" className="sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  Deployment details for <code>{selected.commit}</code>
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    selected.status === "Ready"
                      ? "secondary"
                      : selected.status === "Error"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {selected.status}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {selected.time} · {selected.region}
                </span>
              </div>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Author</dt>
                  <dd>{selected.author}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">URL</dt>
                  <dd className="truncate">{selected.name}.vinyaas.app</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Build time</dt>
                  <dd>41s</dd>
                </div>
              </dl>
              <SheetFooter>
                <Button variant="outline" size="sm">
                  View logs
                </Button>
                <Button size="sm">Promote</Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function FiltersSheetDemo() {
  return (
    <div className="border-border flex w-full max-w-md items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">Issue tracker</p>
        <p className="text-muted-foreground text-xs">248 open · Team board</p>
      </div>
      <Sheet>
        <SheetTrigger>
          <Button variant="outline" size="sm">
            Filters
            <Badge variant="secondary" className="ml-1.5">
              3
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="border-border border-b px-6 py-4">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Narrow issues without leaving the board.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
            <div className="grid gap-2">
              <Label htmlFor="sheet-filter-status">Status</Label>
              <Select defaultValue="open">
                <SelectTrigger id="sheet-filter-status" aria-label="Status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <p className="text-sm font-medium">Priority</p>
              {["Urgent", "High", "Normal"].map((priority) => (
                <div key={priority} className="flex items-center gap-2">
                  <Checkbox
                    id={`sheet-priority-${priority}`}
                    defaultChecked={priority !== "Urgent"}
                  />
                  <Label htmlFor={`sheet-priority-${priority}`}>
                    {priority}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="sheet-assigned-me">Assigned to me</Label>
              <Switch id="sheet-assigned-me" />
            </div>
          </div>
          <SheetFooter className="border-border border-t px-6 py-4">
            <SheetClose>
              <Button variant="outline">Reset</Button>
            </SheetClose>
            <SheetClose>
              <Button>Apply filters</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

const navSections = [
  {
    label: "Product",
    links: ["Overview", "Projects", "Deployments", "Analytics"],
  },
  {
    label: "Workspace",
    links: ["Team", "Billing", "Integrations", "Settings"],
  },
];

export function MobileNavSheetDemo() {
  return (
    <div className="border-border w-full max-w-sm overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-medium">Vinyaas</p>
          <p className="text-muted-foreground text-xs">Acme workspace</p>
        </div>
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" size="sm" aria-label="Open menu">
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100%,20rem)] gap-0 p-0">
            <SheetHeader className="border-border border-b px-6 py-4">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate the workspace on smaller screens.
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
              {navSections.map((section) => (
                <div key={section.label} className="grid gap-1">
                  <p className="text-muted-foreground px-2 text-xs font-medium tracking-wide uppercase">
                    {section.label}
                  </p>
                  {section.links.map((link) => (
                    <SheetClose key={link}>
                      <a
                        href={`#${link.toLowerCase()}`}
                        className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring block rounded-md px-2 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                      >
                        {link}
                      </a>
                    </SheetClose>
                  ))}
                </div>
              ))}
            </nav>
            <div className="border-border mt-auto flex items-center gap-3 border-t px-6 py-4">
              <Avatar className="size-8">
                <AvatarFallback>SK</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Sarang Kumar</p>
                <p className="text-muted-foreground truncate text-xs">
                  sarang@vinyaas.dev
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
