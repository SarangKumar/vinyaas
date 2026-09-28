"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import { Label } from "@/registry/new-york/ui/label/label";
import { Separator } from "@/registry/new-york/ui/separator/separator";
import { Switch } from "@/registry/new-york/ui/switch/switch";

const channels = [
  {
    id: "email",
    title: "Email",
    description: "Receipts, invoices, and weekly digests.",
    defaultChecked: true,
  },
  {
    id: "push",
    title: "Push",
    description: "Deployments and review requests on this device.",
    defaultChecked: true,
  },
  {
    id: "security",
    title: "Security",
    description: "Sign-ins, password changes, and 2FA events.",
    defaultChecked: true,
  },
  {
    id: "product",
    title: "Product updates",
    description: "Release notes and occasional product announcements.",
    defaultChecked: false,
  },
] as const;

export function NotificationSettingsBlock() {
  return (
    <PlayBlock
      title="Notifications"
      description="Choose how the workspace reaches you."
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <Badge variant="secondary">3 channels on</Badge>
        <Button type="button" size="sm" variant="ghost">
          Pause for 24h
        </Button>
      </div>
      <ul className="flex min-w-0 flex-col gap-4">
        {channels.map((channel, index) => (
          <li key={channel.id} className="min-w-0">
            {index > 0 ? <Separator className="mb-4" /> : null}
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <Label
                  htmlFor={`play-notify-${channel.id}`}
                  className="text-sm"
                >
                  {channel.title}
                </Label>
                <p className="text-muted-foreground mt-1 text-sm leading-6">
                  {channel.description}
                </p>
              </div>
              <Switch
                id={`play-notify-${channel.id}`}
                defaultChecked={channel.defaultChecked}
                className="mt-0.5 shrink-0"
              />
            </div>
          </li>
        ))}
      </ul>
    </PlayBlock>
  );
}
