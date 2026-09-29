import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Switch } from "@/registry/new-york/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("tabs");

const usage = `import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function AccountTabs() {
  return (
    <Card className="w-full max-w-md text-left">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your public profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="flex flex-col gap-3 pt-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tabs-usage-name">Display name</Label>
              <Input id="tabs-usage-name" defaultValue="Sarang Kumar" />
            </div>
            <Button size="sm" className="self-start">
              Save profile
            </Button>
          </TabsContent>
          <TabsContent value="email" className="flex flex-col gap-3 pt-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tabs-usage-email">Email</Label>
              <Input
                id="tabs-usage-email"
                type="email"
                defaultValue="sarang@example.com"
              />
            </div>
            <Button size="sm" className="self-start" variant="outline">
              Update email
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "string",
    description: "Controlled selected tab. Omit it for uncontrolled tabs.",
  },
  {
    prop: "defaultValue",
    type: "string",
    description: "The tab selected on first render.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    description: "Called with the next tab value after activation.",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Sets aria-orientation and the list layout direction.",
  },
  {
    prop: "variant",
    type: '"default" | "line"',
    defaultValue: '"default"',
    description: "On TabsList, line draws an underline under the active tab.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables the whole set, or one TabsTrigger.",
  },
  {
    prop: "forceMount",
    type: "boolean",
    description: "On TabsContent, keeps the panel mounted while it is hidden.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto Tabs, TabsList, TabsTrigger, or TabsContent.",
  },
];

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-3.5 shrink-0"
    >
      <path
        d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-3.5 shrink-0"
    >
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-3.5 shrink-0"
    >
      <path
        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsTabs() {
  return (
    <Card className="w-full max-w-md text-left">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your profile, notifications, and security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="flex flex-col gap-3 pt-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tabs-display-name">Display name</Label>
              <Input id="tabs-display-name" defaultValue="Sarang Kumar" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tabs-email">Email</Label>
              <Input
                id="tabs-email"
                type="email"
                defaultValue="sarang@example.com"
              />
            </div>
            <Button size="sm" className="self-start">
              Save changes
            </Button>
          </TabsContent>
          <TabsContent
            value="notifications"
            className="flex flex-col gap-3 pt-1"
          >
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="tabs-email-alerts">Email digests</Label>
              <Switch id="tabs-email-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="tabs-push">Push notifications</Label>
              <Switch id="tabs-push" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="tabs-mentions">Mentions only</Label>
              <Switch id="tabs-mentions" defaultChecked />
            </div>
            <Button size="sm" className="self-start" variant="outline">
              Update preferences
            </Button>
          </TabsContent>
          <TabsContent value="security" className="flex flex-col gap-3 pt-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tabs-password">New password</Label>
              <Input id="tabs-password" type="password" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="tabs-2fa">Two-factor authentication</Label>
              <Switch id="tabs-2fa" defaultChecked />
            </div>
            <Button size="sm" className="self-start">
              Update security
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

const settingsCode = `import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function AccountSettings() {
  return (
    <Card className="w-full max-w-md text-left">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your profile, notifications, and security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="flex flex-col gap-3 pt-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tabs-display-name">Display name</Label>
              <Input id="tabs-display-name" defaultValue="Sarang Kumar" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tabs-email">Email</Label>
              <Input
                id="tabs-email"
                type="email"
                defaultValue="sarang@example.com"
              />
            </div>
            <Button size="sm" className="self-start">
              Save changes
            </Button>
          </TabsContent>
          <TabsContent
            value="notifications"
            className="flex flex-col gap-3 pt-1"
          >
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="tabs-email-alerts">Email digests</Label>
              <Switch id="tabs-email-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="tabs-push">Push notifications</Label>
              <Switch id="tabs-push" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="tabs-mentions">Mentions only</Label>
              <Switch id="tabs-mentions" defaultChecked />
            </div>
            <Button size="sm" className="self-start" variant="outline">
              Update preferences
            </Button>
          </TabsContent>
          <TabsContent value="security" className="flex flex-col gap-3 pt-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tabs-password">New password</Label>
              <Input id="tabs-password" type="password" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="tabs-2fa">Two-factor authentication</Label>
              <Switch id="tabs-2fa" defaultChecked />
            </div>
            <Button size="sm" className="self-start">
              Update security
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
`;

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description:
      "A Card holds profile and email panels. Activating a tab replaces the panel.",
    preview: (
      <Card className="w-full max-w-md text-left">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your public profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="flex flex-col gap-3 pt-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="tabs-usage-name">Display name</Label>
                <Input id="tabs-usage-name" defaultValue="Sarang Kumar" />
              </div>
              <Button size="sm" className="self-start">
                Save profile
              </Button>
            </TabsContent>
            <TabsContent value="email" className="flex flex-col gap-3 pt-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="tabs-usage-email">Email</Label>
                <Input
                  id="tabs-usage-email"
                  type="email"
                  defaultValue="sarang@example.com"
                />
              </div>
              <Button size="sm" className="self-start" variant="outline">
                Update email
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    ),
    code: usage,
  },
  {
    id: "line",
    title: "Line",
    description:
      'Use variant="line" on TabsList for an underline under the active tab.',
    preview: (
      <Card className="w-full max-w-md text-left">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Switch between product views.</CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <Tabs defaultValue="overview">
            <TabsList variant="line">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3 text-sm">
              Ship velocity is up 12% versus last sprint.
            </TabsContent>
            <TabsContent value="analytics" className="pt-3 text-sm">
              Active users peaked on Thursday at 1,180 sessions.
            </TabsContent>
            <TabsContent value="reports" className="pt-3 text-sm">
              Three reports are ready to export for stakeholders.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    ),
    code: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function TabsLine() {
  return (
    <Card className="w-full max-w-md text-left">
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
        <CardDescription>Switch between product views.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-3 text-sm">
            Ship velocity is up 12% versus last sprint.
          </TabsContent>
          <TabsContent value="analytics" className="pt-3 text-sm">
            Active users peaked on Thursday at 1,180 sessions.
          </TabsContent>
          <TabsContent value="reports" className="pt-3 text-sm">
            Three reports are ready to export for stakeholders.
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
`,
  },
  {
    id: "project",
    title: "Project overview",
    description: "Richer panels can mix copy, status, and actions.",
    preview: (
      <Tabs defaultValue="overview" className="w-full max-w-lg text-left">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-foreground text-sm font-medium">
                  Design system
                </p>
                <p className="text-muted-foreground text-sm">
                  Source-installed primitives for product UI.
                </p>
              </div>
              <Button size="sm" variant="outline">
                Open
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Last deployed 2 hours ago · 12 open issues
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
            <li>Merged accessibility fixes for Dialog.</li>
            <li>Published registry artifacts for Toast.</li>
            <li>Updated installation docs for multi-add.</li>
          </ul>
        </TabsContent>
        <TabsContent value="members">
          <ul className="text-sm">
            <li className="border-border flex items-center justify-between border-b py-2">
              <span>Sarang Kumar</span>
              <span className="text-muted-foreground">Owner</span>
            </li>
            <li className="flex items-center justify-between py-2">
              <span>Alex Rivera</span>
              <span className="text-muted-foreground">Editor</span>
            </li>
          </ul>
        </TabsContent>
      </Tabs>
    ),
    code: `import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function ProjectTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-lg text-left">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card className="gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-foreground text-sm font-medium">Design system</p>
              <p className="text-muted-foreground text-sm">
                Source-installed primitives for product UI.
              </p>
            </div>
            <Button size="sm" variant="outline">
              Open
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Last deployed 2 hours ago · 12 open issues
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="activity">
        <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
          <li>Merged accessibility fixes for Dialog.</li>
          <li>Published registry artifacts for Toast.</li>
          <li>Updated installation docs for multi-add.</li>
        </ul>
      </TabsContent>
      <TabsContent value="members">
        <ul className="text-sm">
          <li className="border-border flex items-center justify-between border-b py-2">
            <span>Sarang Kumar</span>
            <span className="text-muted-foreground">Owner</span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span>Alex Rivera</span>
            <span className="text-muted-foreground">Editor</span>
          </li>
        </ul>
      </TabsContent>
    </Tabs>
  );
}
`,
  },
  {
    id: "disabled",
    title: "Disabled tab",
    description: "A disabled trigger stays visible and cannot be activated.",
    preview: (
      <Tabs defaultValue="general" className="w-full max-w-md text-left">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="text-muted-foreground text-sm">
          Workspace name and default locale.
        </TabsContent>
        <TabsContent value="team" className="text-muted-foreground text-sm">
          Invite people and manage roles.
        </TabsContent>
        <TabsContent value="billing" className="text-muted-foreground text-sm">
          Billing is unavailable for this plan.
        </TabsContent>
      </Tabs>
    ),
    code: `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function DisabledTab() {
  return (
    <Tabs defaultValue="general" className="w-full max-w-md text-left">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="text-muted-foreground text-sm">
        Workspace name and default locale.
      </TabsContent>
      <TabsContent value="team" className="text-muted-foreground text-sm">
        Invite people and manage roles.
      </TabsContent>
      <TabsContent value="billing" className="text-muted-foreground text-sm">
        Billing is unavailable for this plan.
      </TabsContent>
    </Tabs>
  );
}
`,
  },
  {
    id: "icons",
    title: "With icons",
    description: "Triggers can include decorative icons beside the label.",
    preview: (
      <Tabs defaultValue="account" className="w-full max-w-md text-left">
        <TabsList>
          <TabsTrigger value="account">
            <UserIcon />
            Account
          </TabsTrigger>
          <TabsTrigger value="security">
            <LockIcon />
            Security
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <BellIcon />
            Alerts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="text-muted-foreground text-sm">
          Profile details and avatar.
        </TabsContent>
        <TabsContent value="security" className="text-muted-foreground text-sm">
          Password and session settings.
        </TabsContent>
        <TabsContent value="alerts" className="text-muted-foreground text-sm">
          Email and push preferences.
        </TabsContent>
      </Tabs>
    ),
    code: `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3.5 shrink-0">
      <path
        d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3.5 shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3.5 shrink-0">
      <path
        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconTabs() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md text-left">
      <TabsList>
        <TabsTrigger value="account">
          <UserIcon />
          Account
        </TabsTrigger>
        <TabsTrigger value="security">
          <LockIcon />
          Security
        </TabsTrigger>
        <TabsTrigger value="alerts">
          <BellIcon />
          Alerts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-muted-foreground text-sm">
        Profile details and avatar.
      </TabsContent>
      <TabsContent value="security" className="text-muted-foreground text-sm">
        Password and session settings.
      </TabsContent>
      <TabsContent value="alerts" className="text-muted-foreground text-sm">
        Email and push preferences.
      </TabsContent>
    </Tabs>
  );
}
`,
  },
  {
    id: "compact",
    title: "Compact",
    description: "A denser list fits toolbars and side panels.",
    preview: (
      <Tabs defaultValue="all" className="w-full max-w-sm text-left">
        <TabsList className="h-8">
          <TabsTrigger value="all" className="px-2.5 text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="open" className="px-2.5 text-xs">
            Open
          </TabsTrigger>
          <TabsTrigger value="closed" className="px-2.5 text-xs">
            Closed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="text-muted-foreground text-xs">
          24 issues across the workspace.
        </TabsContent>
        <TabsContent value="open" className="text-muted-foreground text-xs">
          11 issues still need a response.
        </TabsContent>
        <TabsContent value="closed" className="text-muted-foreground text-xs">
          13 issues were closed this week.
        </TabsContent>
      </Tabs>
    ),
    code: `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function CompactTabs() {
  return (
    <Tabs defaultValue="all" className="w-full max-w-sm text-left">
      <TabsList className="h-8">
        <TabsTrigger value="all" className="px-2.5 text-xs">
          All
        </TabsTrigger>
        <TabsTrigger value="open" className="px-2.5 text-xs">
          Open
        </TabsTrigger>
        <TabsTrigger value="closed" className="px-2.5 text-xs">
          Closed
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="text-muted-foreground text-xs">
        24 issues across the workspace.
      </TabsContent>
      <TabsContent value="open" className="text-muted-foreground text-xs">
        11 issues still need a response.
      </TabsContent>
      <TabsContent value="closed" className="text-muted-foreground text-xs">
        13 issues were closed this week.
      </TabsContent>
    </Tabs>
  );
}
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Settings live in a Card. Three tabs hold profile fields, notification switches, and security controls.",
  preview: <SettingsTabs />,
  code: settingsCode,
};

export default async function TabsPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/tabs/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Tabs"
      description="A set of panels that share one visible view at a time."
      overview={
        <p>
          Tabs keeps one panel visible at a time. Triggers live in TabsList;
          each TabsContent matches a trigger value. Selection can be controlled
          or uncontrolled.
        </p>
      }
      install="vinyaas add tabs"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/tabs/index.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            TabsList is a tablist. Each TabsTrigger is a tab with{" "}
            <code>aria-selected</code> and <code>aria-controls</code>. The
            active TabsContent is a tabpanel labeled by its trigger.
          </p>
          <p>
            Arrow keys move focus between enabled triggers. Home and End jump to
            the first and last enabled trigger. Click, Enter, or Space activates
            the focused tab. Disabled triggers are skipped.
          </p>
        </>
      }
      source={source}
    >
      <Card className="w-full max-w-md text-left">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your public profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="flex flex-col gap-3 pt-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="tabs-usage-name">Display name</Label>
                <Input id="tabs-usage-name" defaultValue="Sarang Kumar" />
              </div>
              <Button size="sm" className="self-start">
                Save profile
              </Button>
            </TabsContent>
            <TabsContent value="email" className="flex flex-col gap-3 pt-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="tabs-usage-email">Email</Label>
                <Input
                  id="tabs-usage-email"
                  type="email"
                  defaultValue="sarang@example.com"
                />
              </div>
              <Button size="sm" className="self-start" variant="outline">
                Update email
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ComponentReference>
  );
}
