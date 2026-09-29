"use client";

import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover";
import { Separator } from "@/registry/new-york/ui/separator";
import { Switch } from "@/registry/new-york/ui/switch";

export function ProfileSettings() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button type="button" variant="outline">
          Profile
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">Account</p>
          <Badge>Pro</Badge>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="profile-name">Name</Label>
          <Input id="profile-name" defaultValue="Ada Lovelace" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            defaultValue="ada@example.com"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="profile-notifications">Notifications</Label>
          <Switch id="profile-notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="profile-privacy">Privacy</Label>
          <Switch id="profile-privacy" />
        </div>
        <Button type="button">Save account</Button>
      </PopoverContent>
    </Popover>
  );
}
