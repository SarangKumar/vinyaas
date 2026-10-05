"use client";

import { useState } from "react";

import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
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
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>
            Manage the settings for this project.
          </SheetDescription>
        </SheetHeader>
        <p className="text-muted-foreground text-sm">
          Changes apply to the current workspace only.
        </p>
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

const sides: SheetSide[] = ["right", "left", "top", "bottom"];

export function SidesSheetDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger>
            <Button variant="outline" size="sm" className="capitalize">
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle className="capitalize">{side} sheet</SheetTitle>
              <SheetDescription>
                Slides in from the {side} edge of the viewport.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

export function SettingsSheetDemo() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">Edit settings</Button>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0 p-0">
        <SheetHeader className="border-border border-b px-6 py-4">
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>
            Update name, visibility, and notifications.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-4">
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
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Label htmlFor="sheet-deploy-alerts">Deploy alerts</Label>
              <p className="text-muted-foreground text-xs">
                Email the team when a deploy fails.
              </p>
            </div>
            <Switch id="sheet-deploy-alerts" defaultChecked />
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
  );
}

const projects = [
  { id: "1", name: "Vinyaas", owner: "Sarang", status: "Active" as const },
  { id: "2", name: "Dashboard", owner: "Priya", status: "Review" as const },
  { id: "3", name: "Mobile App", owner: "Rahul", status: "Draft" as const },
];

export function DashboardSheetDemo() {
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(
    null,
  );

  return (
    <div className="border-border w-full max-w-md overflow-hidden rounded-lg border">
      <ul className="divide-border divide-y">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex items-center justify-between gap-3 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{project.name}</p>
              <p className="text-muted-foreground text-xs">{project.owner}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelected(project)}
            >
              Details
            </Button>
          </li>
        ))}
      </ul>

      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
      >
        <SheetContent side="right">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  Owned by {selected.owner}. Review status and run actions.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    selected.status === "Active" ? "secondary" : "outline"
                  }
                >
                  {selected.status}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  Updated 2h ago
                </span>
              </div>
              <dl className="text-sm">
                <div className="flex justify-between gap-3 py-1">
                  <dt className="text-muted-foreground">Region</dt>
                  <dd>us-east-1</dd>
                </div>
                <div className="flex justify-between gap-3 py-1">
                  <dt className="text-muted-foreground">Plan</dt>
                  <dd>Pro</dd>
                </div>
              </dl>
              <SheetFooter>
                <Button variant="outline" size="sm">
                  Open
                </Button>
                <Button size="sm">Edit</Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

const navLinks = [
  { href: "#overview", label: "Overview" },
  { href: "#projects", label: "Projects" },
  { href: "#team", label: "Team" },
  { href: "#billing", label: "Billing" },
  { href: "#settings", label: "Settings" },
];

export function MobileNavSheetDemo() {
  return (
    <div className="border-border flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border px-3 py-2">
      <p className="text-sm font-medium">Vinyaas</p>
      <Sheet>
        <SheetTrigger>
          <Button variant="outline" size="sm" aria-label="Open menu">
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(100%,20rem)]">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Jump to a section of the app.</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <SheetClose key={link.href}>
                <a
                  href={link.href}
                  className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                >
                  {link.label}
                </a>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
