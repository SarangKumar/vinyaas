"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group";
import { Switch } from "@/registry/new-york/ui/switch";
import { Textarea } from "@/registry/new-york/ui/textarea";

/**
 * Dense primitive kit — many controls in one composition.
 */
export function PrimitivesKitBlock() {
  return (
    <PlayBlock>
      <div className="flex min-w-0 flex-wrap gap-2">
        <Button type="button" size="sm">
          Button
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </Button>
        <Button type="button" size="sm" variant="secondary">
          Secondary
        </Button>
        <Button type="button" size="sm" variant="outline">
          Outline
        </Button>
      </div>
      <Input aria-label="Search components" placeholder="Search components…" />
      <Textarea
        aria-label="Notes"
        placeholder="Compose a short note…"
        rows={3}
      />
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-4">
        <RadioGroup defaultValue="a" className="flex flex-row gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="a" id="kit-radio-a" />
            <Label htmlFor="kit-radio-a">Option</Label>
          </div>
        </RadioGroup>
        <div className="flex items-center gap-2">
          <Checkbox id="kit-check" defaultChecked />
          <Label htmlFor="kit-check">Accept</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="kit-switch" defaultChecked aria-label="Notifications" />
          <Label htmlFor="kit-switch">Notify</Label>
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap gap-2">
        <Dialog>
          <DialogTrigger>
            <Button type="button" size="sm" variant="outline">
              Alert Dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Archive workspace?</DialogTitle>
              <DialogDescription>
                Archived workspaces stay readable. You can restore them later.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <DialogClose>Archive</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button type="button" size="sm" variant="outline">
              Button Group
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Publish</DropdownMenuItem>
            <DropdownMenuItem>Save draft</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </PlayBlock>
  );
}
