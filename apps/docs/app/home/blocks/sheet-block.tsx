"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/new-york/ui/sheet";
import { Switch } from "@/registry/new-york/ui/switch";

/**
 * Compact settings sheet for the homepage showcase.
 */
export function SheetBlock() {
  return (
    <PlayBlock
      title="Sheet"
      description="Slide in settings without leaving the page."
    >
      <div className="border-border flex items-center justify-between gap-3 rounded-lg border p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">vinyaas-web</p>
          <p className="text-muted-foreground text-xs">Private · us-east-1</p>
        </div>
        <Badge variant="secondary">Active</Badge>
      </div>
      <Sheet>
        <SheetTrigger>
          <Button type="button" variant="outline" size="sm">
            Settings
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="gap-4">
          <SheetHeader>
            <SheetTitle>Project settings</SheetTitle>
            <SheetDescription>
              Update the project name and deploy alerts.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-2">
            <Label htmlFor="home-sheet-name">Name</Label>
            <Input id="home-sheet-name" defaultValue="vinyaas-web" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="home-sheet-alerts">Deploy alerts</Label>
            <Switch id="home-sheet-alerts" defaultChecked />
          </div>
          <SheetFooter>
            <SheetClose>
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </SheetClose>
            <SheetClose>
              <Button type="button" size="sm">
                Save
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </PlayBlock>
  );
}
