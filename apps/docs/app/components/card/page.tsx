import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar/avatar";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card/card";
import { Checkbox } from "@/registry/new-york/ui/checkbox/checkbox";
import { Input } from "@/registry/new-york/ui/input/input";
import { Label } from "@/registry/new-york/ui/label/label";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area/scroll-area";
import { Separator } from "@/registry/new-york/ui/separator/separator";
import { Switch } from "@/registry/new-york/ui/switch/switch";

const usage = `import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";

export function Note() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>Private to this workspace.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Draft</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>Drafts stay on this device.</CardContent>
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

const profileCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";

export function ProfileCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Avatar>
            <AvatarFallback>SK</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle>Sarang Kumar</CardTitle>
            <CardDescription>
              Developer. Building accessible UI that you install as source.
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
              <circle cx="3" cy="8" r="1.2" />
              <circle cx="8" cy="8" r="1.2" />
              <circle cx="13" cy="8" r="1.2" />
            </svg>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">Verified</Badge>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Message</Button>
        <Button variant="secondary">Follow</Button>
      </CardFooter>
    </Card>
  );
}
`;

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="3" cy="8" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="13" cy="8" r="1.2" />
    </svg>
  );
}

function ProfileCard() {
  return (
    <Card className="w-full max-w-sm text-left">
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Avatar>
            <AvatarFallback>SK</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle>Sarang Kumar</CardTitle>
            <CardDescription>
              Developer. Building accessible UI that you install as source.
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <MoreIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">Verified</Badge>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Message</Button>
        <Button variant="secondary">Follow</Button>
      </CardFooter>
    </Card>
  );
}

const activity = [
  ["SK", "Sarang Kumar", "Opened a pull request", "2m"],
  ["AL", "Ada Lovelace", "Published the notes", "8m"],
  ["VW", "vinyaas-web", "Deployment succeeded", "14m"],
  ["AL", "Ada Lovelace", "Left a comment", "1h"],
  ["SK", "Sarang Kumar", "Updated the catalog", "3h"],
] as const;

const examples: ComponentExample[] = [
  {
    id: "profile",
    title: "Profile",
    description:
      "The header keeps the avatar and name beside a CardAction. A long role wraps instead of pushing the icon off the card.",
    preview: <ProfileCard />,
    code: { tsx: profileCode, jsx: profileCode },
  },
  {
    id: "account",
    title: "Account settings",
    description:
      "Labels name the fields. The footer holds the actions for the form.",
    preview: (
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>Account settings</CardTitle>
          <CardDescription>
            Update the name and email on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="card-name">Display name</Label>
            <Input id="card-name" defaultValue="Sarang Kumar" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="card-email">Email</Label>
            <Input id="card-email" defaultValue="sarang@example.com" />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";

export function AccountCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Account settings</CardTitle>
        <CardDescription>Update the name and email on your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="card-name">Display name</Label>
        <Input id="card-name" defaultValue="Sarang Kumar" />
        <Label htmlFor="card-email">Email</Label>
        <Input id="card-email" defaultValue="sarang@example.com" />
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "subscription",
    title: "Subscription",
    description:
      "CardAction holds the status badge so the price can use the rest of the header.",
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
        <CardFooter>
          <Button>Manage subscription</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Separator } from "@/components/ui/separator/separator";

export function SubscriptionCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div>
          <CardTitle>Pro Plan</CardTitle>
          <CardDescription>$24 / month. Renews on October 12.</CardDescription>
        </div>
        <CardAction>
          <Badge>Active</Badge>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardFooter>
        <Button>Manage subscription</Button>
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
      "A switch and a checkbox live in the body. The header action names the current state.",
    preview: (
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Two-factor authentication protects the account with an extra step.
            </CardDescription>
          </div>
          <CardAction>
            <Badge variant="secondary">Enabled</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="card-2fa">
              Require verification for new devices
            </Label>
            <Switch id="card-2fa" defaultChecked />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="card-trusted" defaultChecked />
            <Label htmlFor="card-trusted">Remember trusted devices</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Review sessions</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Label } from "@/components/ui/label/label";
import { Switch } from "@/components/ui/switch/switch";

export function SecurityCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Two-factor authentication protects the account with an extra step.
          </CardDescription>
        </div>
        <CardAction>
          <Badge variant="secondary">Enabled</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Label htmlFor="card-2fa">Require verification for new devices</Label>
        <Switch id="card-2fa" defaultChecked />
        <Checkbox id="card-trusted" defaultChecked />
        <Label htmlFor="card-trusted">Remember trusted devices</Label>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Review sessions</Button>
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
      "The feed scrolls inside the card. The page around it stays still.",
    preview: (
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Updates from the last day.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea
            className="border-border bg-background h-40 rounded-md border"
            aria-label="Recent activity"
          >
            <ul className="grid">
              {activity.map(([initials, name, text, time]) => (
                <li key={text} className="grid gap-3 p-3">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-muted-foreground text-sm">{text}</p>
                    </div>
                    <Badge variant="outline">{time}</Badge>
                  </div>
                  <Separator />
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    ),
    code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";
import { Separator } from "@/components/ui/separator/separator";

export function ActivityCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Updates from the last day.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="border-border bg-background h-40 rounded-md border" aria-label="Recent activity">
          <ul>
            <li>
              <Avatar><AvatarFallback>SK</AvatarFallback></Avatar>
              <span>Sarang Kumar</span>
              <span>Opened a pull request</span>
              <Badge variant="outline">2m</Badge>
              <Separator />
            </li>
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
`,
  },
  {
    id: "compact",
    title: "Compact",
    description:
      'size="sm" tightens the card padding and the gap between sections. CardAction still sits at the top right.',
    preview: (
      <Card size="sm" className="w-full max-w-sm text-left">
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>Catalog</CardTitle>
            <CardDescription>
              25 components are in the v0.2 registry.
            </CardDescription>
          </div>
          <CardAction>
            <Badge variant="secondary">v0.2</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" size="sm">
            View project
          </Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";

export function CompactCard() {
  return (
    <Card size="sm" className="w-full max-w-sm">
      <CardHeader>
        <div>
          <CardTitle>Catalog</CardTitle>
          <CardDescription>25 components are in the v0.2 registry.</CardDescription>
        </div>
        <CardAction>
          <Badge variant="secondary">v0.2</Badge>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" size="sm">View project</Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
];

export default async function CardPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/card/card.tsx"),
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
          only tightens spacing. CardAction sits at the top right of the header,
          including when the title is long.
        </p>
      }
      install="vinyaas add card"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/card/card.tsx</code>. It imports <code>cn</code>{" "}
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
          names through Label, Button, or visible text. CardAction is a layout
          wrapper, so the control inside it supplies the name.
        </p>
      }
      source={source}
    >
      <ProfileCard />
    </ComponentReference>
  );
}
