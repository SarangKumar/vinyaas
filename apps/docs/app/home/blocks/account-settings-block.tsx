"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Separator } from "@/registry/new-york/ui/separator";
import { Switch } from "@/registry/new-york/ui/switch";

export function AccountSettingsBlock() {
  return (
    <PlayBlock
      title="Account"
      description="Profile identity and security preferences."
    >
      <form
        className="grid min-w-0 gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="play-display">Profile name</Label>
          <Input id="play-display" defaultValue="Ada Lovelace" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="play-account-email">Email</Label>
          <Input
            id="play-account-email"
            type="email"
            defaultValue="ada@analytical.engine"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="play-account-password">Password</Label>
          <Input
            id="play-account-password"
            type="password"
            defaultValue="············"
            autoComplete="current-password"
          />
        </div>
        <div className="border-border flex min-w-0 items-center justify-between gap-3 rounded-md border px-3 py-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Label htmlFor="play-2fa">Two-factor authentication</Label>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Authenticator app · last verified 2 days ago
            </p>
          </div>
          <Switch id="play-2fa" defaultChecked className="shrink-0" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="play-public" defaultChecked />
          <Label htmlFor="play-public">Show profile in the directory</Label>
        </div>
        <Separator />
        <div className="flex min-w-0 flex-wrap gap-2">
          <Button type="submit" size="sm">
            Save changes
          </Button>
          <Button type="button" size="sm" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </PlayBlock>
  );
}
