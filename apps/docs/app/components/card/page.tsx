import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/registry/new-york/ui/marker";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area";
import { Separator } from "@/registry/new-york/ui/separator";
import { Switch } from "@/registry/new-york/ui/switch";
import { ProfileCardDemo, ProjectCardDemo } from "./card-demos";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("card");

const usage = `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Note() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Release notes</CardTitle>
        <CardDescription>What shipped in v1.0.0.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Each component still installs on its own.</p>
      </CardContent>
    </Card>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "size",
    type: '"default" | "sm"',
    defaultValue: '"default"',
    description: "Card spacing only. sm uses tighter padding and gap.",
  },
  {
    prop: "className",
    type: "string",
    description:
      "Merged with cn on Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, and CardFooter.",
  },
];

const profileCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ProfileCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Avatar><AvatarFallback>SK</AvatarFallback></Avatar>
          <div className="min-w-0">
            <CardTitle>Sarang Kumar</CardTitle>
            <CardDescription>Developer. Building accessible UI that you install as source.</CardDescription>
          </div>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon-sm" aria-label="More actions">⋮</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <Badge>Verified</Badge>
      <CardFooter>
        <Button variant="outline">Message</Button>
        <Button>Follow</Button>
      </CardFooter>
    </Card>
  );
}
`;

const examples: ComponentExample[] = [
  {
    id: "profile",
    title: "Profile",
    description:
      "A person card with a verified badge, a three-dot menu in CardAction, and follow actions.",
    preview: <ProfileCardDemo />,
    code: { tsx: profileCode, jsx: profileCode },
  },
  {
    id: "subscription",
    title: "Subscription",
    description:
      "Plan price, an active badge, and a destructive cancel action.",
    preview: (
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <div>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>
              $24 / month. Renews on October 12.
            </CardDescription>
          </div>
          <CardAction>
            <Badge>Active</Badge>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent>
          <Label htmlFor="card-billing">Billing period</Label>
          <NativeSelect id="card-billing" defaultValue="monthly">
            <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
            <NativeSelectOption value="yearly">Yearly</NativeSelectOption>
          </NativeSelect>
        </CardContent>
        <CardFooter className="gap-2">
          <Button>Manage subscription</Button>
          <Button variant="destructive">Cancel plan</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SubscriptionCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div>
          <CardTitle>Pro Plan</CardTitle>
          <CardDescription>$24 / month. Renews on October 12.</CardDescription>
        </div>
        <CardAction><Badge>Active</Badge></CardAction>
      </CardHeader>
      <Separator />
      <CardFooter>
        <Button>Manage subscription</Button>
        <Button variant="destructive">Cancel plan</Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "account",
    title: "Account settings",
    description:
      "A real settings form: labelled fields, a switch, a checkbox, help text, and save.",
    preview: (
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Update the name and email on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="card-name">Display name</Label>
            <Input id="card-name" defaultValue="Sarang Kumar" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="card-email">Email</Label>
            <Input
              id="card-email"
              type="email"
              defaultValue="sarang@example.com"
            />
            <p className="text-muted-foreground text-xs">
              We send receipts to this address.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="card-2fa">Two-factor authentication</Label>
            <Switch id="card-2fa" defaultChecked />
          </div>
          <Badge variant="secondary">Enabled</Badge>
          <div className="flex items-center gap-2">
            <Checkbox id="card-trusted" defaultChecked />
            <Label htmlFor="card-trusted">Remember trusted devices</Label>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function AccountCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Update the name and email on your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="card-name">Display name</Label>
        <Input id="card-name" defaultValue="Sarang Kumar" />
        <Switch id="card-2fa" defaultChecked />
        <Checkbox id="card-trusted" defaultChecked />
      </CardContent>
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "activity",
    title: "Activity",
    description:
      "A feed scrolls inside the card. Each row uses an avatar, a marker, and a time badge.",
    preview: (
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Updates from the last day.</CardDescription>
        </CardHeader>
        <ScrollArea
          className="border-border h-40 rounded-md border"
          aria-label="Recent activity"
        >
          <ul>
            {[
              ["SK", "Sarang Kumar", "Opened a pull request", "2m"],
              ["AL", "Ada Lovelace", "Published the notes", "8m"],
              ["VW", "vinyaas-web", "Deployment succeeded", "14m"],
            ].map(([initials, name, action, time]) => (
              <li key={action} className="grid gap-2 p-3">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{name}</p>
                    <Marker>
                      <MarkerIcon>
                        <span className="bg-foreground size-1.5 rounded-full" />
                      </MarkerIcon>
                      <MarkerContent>{action}</MarkerContent>
                    </Marker>
                  </div>
                  <Badge variant="outline">{time}</Badge>
                </div>
                <Separator />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Card>
    ),
    code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Updates from the last day.</CardDescription>
      </CardHeader>
      <ScrollArea className="h-40 rounded-md border" aria-label="Recent activity">
        <Marker>
          <MarkerIcon><span /></MarkerIcon>
          <MarkerContent>Opened a pull request</MarkerContent>
        </Marker>
        <Separator />
        <Badge variant="outline">2m</Badge>
      </ScrollArea>
    </Card>
  );
}
`,
  },
  {
    id: "project",
    title: "Project",
    description: "Status, a progress bar, and project actions in a menu.",
    preview: <ProjectCardDemo />,
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

export function ProjectCard() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Production Dashboard</CardTitle>
          <CardDescription>Updated 2 hours ago.</CardDescription>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon-sm" aria-label="Project actions">⋮</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Open project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">On track</Badge>
        <Progress aria-label="Project progress" value={72} />
      </CardContent>
      <CardFooter>
        <Button variant="outline">View project</Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "security",
    title: "Security",
    description:
      "A switch, a checkbox, and a status badge for account protection.",
    preview: (
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardAction>
            <Badge variant="secondary">Protected</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="card-session">Sign out other sessions</Label>
            <Switch id="card-session" defaultChecked />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="card-alerts" defaultChecked />
            <Label htmlFor="card-alerts">Email me about new sign-ins</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update security</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SecurityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardAction><Badge variant="secondary">Protected</Badge></CardAction>
      </CardHeader>
      <CardContent>
        <Label htmlFor="card-session">Sign out other sessions</Label>
        <Switch id="card-session" defaultChecked />
        <Checkbox id="card-alerts" defaultChecked />
        <Label htmlFor="card-alerts">Email me about new sign-ins</Label>
      </CardContent>
      <CardFooter>
        <Button>Update security</Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "notification",
    title: "Notification",
    description:
      "An avatar, a status badge, a timestamp, and a follow-up action.",
    preview: (
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Ada Lovelace</CardTitle>
              <CardDescription>Commented 2 minutes ago</CardDescription>
            </div>
          </div>
          <CardAction>
            <Badge>New</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <Button variant="outline">Reply</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ada Lovelace</CardTitle>
        <CardDescription>Commented 2 minutes ago</CardDescription>
        <CardAction><Badge>New</Badge></CardAction>
      </CardHeader>
      <CardFooter>
        <Button variant="outline">Reply</Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "compact",
    title: "Compact",
    description:
      'size="sm" tightens the card. The action stays a small badge and an icon button.',
    preview: (
      <Card size="sm" className="w-full max-w-sm text-left">
        <CardHeader>
          <div>
            <CardTitle>Catalog</CardTitle>
            <CardDescription>
              The v1.0.0 registry is the production catalog.
            </CardDescription>
          </div>
          <CardAction>
            <Badge>v1.0.0</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost" size="icon-sm" aria-label="Open catalog">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4 fill-current"
            >
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </Button>
          <Button size="sm" variant="outline">
            View project
          </Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function CompactCard() {
  return (
    <Card size="sm">
      <CardHeader>
        <div>
          <CardTitle>Catalog</CardTitle>
          <CardDescription>The v1.0.0 registry is the production catalog.</CardDescription>
        </div>
        <CardAction><Badge>v1.0.0</Badge></CardAction>
      </CardHeader>
      <CardFooter>
        <Button size="sm" variant="outline">View project</Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
];

export default async function CardPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/card/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Card"
      description="A bordered container for related content."
      overview={
        <p>
          Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent,
          and CardFooter are layout wrappers. <code>size=&quot;sm&quot;</code>{" "}
          only tightens spacing. CardAction sits at the top right of the header.
        </p>
      }
      install="vinyaas add card"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/card/index.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <p>
          Card does not add a role. Controls inside the card keep their own
          names through Label, Button, or visible text. A three-dot menu trigger
          needs an accessible name.
        </p>
      }
      source={source}
    >
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>Sarang Kumar</CardTitle>
          <CardDescription>Developer.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>Follow</Button>
        </CardFooter>
      </Card>
    </ComponentReference>
  );
}
