"use client";

import type { ControlValues } from "@/components/component-demo";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";

export function TabsPreview({ values }: { values: ControlValues }) {
  const orientation =
    (values.orientation as "horizontal" | "vertical") || "horizontal";
  const variant = (values.variant as "default" | "line") || "default";
  const isDisabled = values.disabled as boolean;

  return (
    <Tabs
      key={`${orientation}-${variant}`}
      defaultValue="account"
      orientation={orientation}
      className="w-full max-w-sm"
    >
      <TabsList variant={variant}>
        <TabsTrigger value="account" disabled={isDisabled}>
          Account
        </TabsTrigger>
        <TabsTrigger value="settings" disabled={isDisabled}>
          Settings
        </TabsTrigger>
        <TabsTrigger value="billing" disabled={isDisabled}>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-muted-foreground mt-2 text-sm">
          Manage your account details and preferences.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-muted-foreground mt-2 text-sm">
          Configure application settings and integrations.
        </p>
      </TabsContent>
      <TabsContent value="billing">
        <p className="text-muted-foreground mt-2 text-sm">
          View and manage your subscription and billing info.
        </p>
      </TabsContent>
    </Tabs>
  );
}
