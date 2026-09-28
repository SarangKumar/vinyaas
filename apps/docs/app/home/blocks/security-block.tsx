"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox/checkbox";
import { Label } from "@/registry/new-york/ui/label/label";
import { Switch } from "@/registry/new-york/ui/switch/switch";

export function SecurityBlock() {
  return (
    <PlayBlock title="Security">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Two-factor authentication</p>
          <p className="text-muted-foreground text-xs">Authenticator app</p>
        </div>
        <Switch
          id="play-2fa"
          defaultChecked
          aria-label="Two-factor authentication"
        />
      </div>
      <div className="flex min-w-0 items-start gap-2">
        <Checkbox id="play-device" defaultChecked />
        <Label htmlFor="play-device" className="min-w-0 leading-5">
          Trust this browser for 30 days
        </Label>
      </div>
      <div className="grid min-w-0 gap-3">
        <Badge variant="outline" className="w-fit">
          Session active
        </Badge>
        <Button type="button" variant="outline" size="sm" className="w-full">
          Sign out other sessions
        </Button>
      </div>
    </PlayBlock>
  );
}
