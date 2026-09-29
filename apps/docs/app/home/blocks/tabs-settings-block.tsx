"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Switch } from "@/registry/new-york/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";

export function TabsSettingsBlock() {
  return (
    <PlayBlock
      title="Workspace settings"
      description="Profile, security, and notification preferences."
    >
      <Tabs defaultValue="profile">
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="flex-1">
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1">
            Security
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex-1">
            Alerts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="play-tabs-name">Display name</Label>
            <Input id="play-tabs-name" defaultValue="Ada Lovelace" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="play-tabs-email">Email</Label>
            <Input
              id="play-tabs-email"
              type="email"
              defaultValue="ada@analytical.engine"
            />
          </div>
          <Button type="button" size="sm" className="self-start">
            Save profile
          </Button>
        </TabsContent>
        <TabsContent value="security" className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="play-tabs-password">New password</Label>
            <Input id="play-tabs-password" type="password" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="play-tabs-2fa">Two-factor auth</Label>
            <Switch id="play-tabs-2fa" defaultChecked />
          </div>
          <Button type="button" size="sm" className="self-start">
            Update security
          </Button>
        </TabsContent>
        <TabsContent value="alerts" className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="play-tabs-digest">Weekly digest</Label>
            <Switch id="play-tabs-digest" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="play-tabs-mentions">Mentions only</Label>
            <Switch id="play-tabs-mentions" />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="self-start"
          >
            Save alerts
          </Button>
        </TabsContent>
      </Tabs>
    </PlayBlock>
  );
}
