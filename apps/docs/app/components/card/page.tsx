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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card/card";
import { Checkbox } from "@/registry/new-york/ui/checkbox/checkbox";
import { Input } from "@/registry/new-york/ui/input/input";
import { Label } from "@/registry/new-york/ui/label/label";
import { Progress } from "@/registry/new-york/ui/progress/progress";
import { Separator } from "@/registry/new-york/ui/separator/separator";
import { Switch } from "@/registry/new-york/ui/switch/switch";
import { Tooltip } from "@/registry/new-york/ui/tooltip/tooltip";

const selectClass =
  "border-input bg-background text-foreground h-9 w-full rounded-md border px-3 text-sm";

const usage = `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";

export function Note() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>Private to this workspace.</CardDescription>
      </CardHeader>
      <CardContent>Drafts stay on this device.</CardContent>
    </Card>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "className",
    type: "string",
    description:
      "Merged with cn on Card, CardHeader, CardTitle, CardDescription, CardContent, and CardFooter.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "profile",
    title: "Profile",
    description:
      "Avatar, a status badge, and two actions sit in one card. Separator divides the bio from the buttons.",
    preview: <ProfileCard />,
    code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Separator } from "@/components/ui/separator/separator";

export function ProfileCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>SK</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle>Sarang Kumar</CardTitle>
            <CardDescription>@sarang · Developer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="gap-3">
        <Badge variant="secondary">Open to work</Badge>
        <p className="text-sm">
          Building accessible UI that you install as source.
        </p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button type="button" variant="outline">
          View profile
        </Button>
        <Button type="button" variant="secondary">
          Follow
        </Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "pricing",
    title: "Pricing",
    description:
      "A plan name, a badge, a price, and a feature list. The trial button explains itself with a tooltip.",
    preview: <PricingCard />,
    code: `import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Separator } from "@/components/ui/separator/separator";
import { Tooltip } from "@/components/ui/tooltip/tooltip";

export function PricingCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Pro</CardTitle>
          <Badge>Popular</Badge>
        </div>
        <p className="text-foreground text-2xl font-semibold">$24 / month</p>
        <CardDescription>For developers building faster.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="text-sm leading-6">
          <li>Unlimited projects</li>
          <li>Team collaboration</li>
          <li>Priority support</li>
        </ul>
      </CardContent>
      <Separator />
      <CardFooter>
        <Tooltip content="14 days, then $24 a month">
          <Button type="button">Start free trial</Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "checkout",
    title: "Checkout",
    description:
      "Labels, inputs, a native select, and a checkbox make a payment form. The select is a plain HTML element.",
    preview: <CheckoutCard />,
    code: `import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Separator } from "@/components/ui/separator/separator";

export function CheckoutCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="card-number">Card number</Label>
          <Input id="card-number" defaultValue="4242 4242 4242 4242" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="card-name">Name</Label>
          <Input id="card-name" defaultValue="Sarang Kumar" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="checkout-plan">Plan</Label>
          <select id="checkout-plan" defaultValue="pro" className="${selectClass}">
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="save-payment" defaultChecked />
          <Label htmlFor="save-payment">Save payment method</Label>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between">
        <span className="text-sm">Total</span>
        <span className="text-sm font-medium">$24</span>
      </CardFooter>
      <Button type="button">Confirm payment</Button>
    </Card>
  );
}
`,
  },
  {
    id: "project",
    title: "Project",
    description:
      "Badges name the project, and Progress shows how much of the catalog is in place.",
    preview: <ProjectCard />,
    code: `import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Progress } from "@/components/ui/progress/progress";
import { Separator } from "@/components/ui/separator/separator";

export function ProjectCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Vinyaas</CardTitle>
        <CardDescription>Accessible component library</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Open source</Badge>
          <Badge variant="outline">v0.2</Badge>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <span>Components</span>
            <span>20 / 25</span>
          </div>
          <Progress aria-label="Catalog progress" value={20} max={25} />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between">
        <span className="text-muted-foreground text-sm">Updated recently</span>
        <Button type="button" variant="outline">
          View project
        </Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "settings",
    title: "Settings",
    description:
      "A display name, an email, a switch, and a checkbox. Cancel stays outline next to Save.",
    preview: <SettingsCard />,
    code: `import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Separator } from "@/components/ui/separator/separator";
import { Switch } from "@/components/ui/switch/switch";

export function SettingsCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Account settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="display-name">Display name</Label>
          <Input id="display-name" defaultValue="Sarang Kumar" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="account-email">Email</Label>
          <Input id="account-email" type="email" defaultValue="sarang@example.com" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="product-updates">Receive product updates</Label>
          <Switch id="product-updates" defaultChecked />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="activity-email" defaultChecked />
          <Label htmlFor="activity-email">Email me about activity</Label>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="justify-end">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="button">Save changes</Button>
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
      "A card can report a status. The badge names the result, and the tooltip names the destination.",
    preview: <ActivityCard />,
    code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Separator } from "@/components/ui/separator/separator";
import { Tooltip } from "@/components/ui/tooltip/tooltip";

export function ActivityCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>VW</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle>Deployment completed</CardTitle>
            <CardDescription>vinyaas-web</CardDescription>
          </div>
          <Badge variant="secondary">Succeeded</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Production deployment succeeded.</p>
        <p className="text-muted-foreground text-sm">2 minutes ago</p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Tooltip content="Opens the deployment log">
          <Button type="button" variant="outline">
            View deployment
          </Button>
        </Tooltip>
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
          Card, CardHeader, CardTitle, CardDescription, CardContent, and
          CardFooter are layout wrappers. Compose them with the controls the
          content needs. Each one forwards its element props and merges{" "}
          <code>className</code> with <code>cn</code>.
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
          names through Label, Button, or visible text. A native select in a
          card stays a combobox.
        </p>
      }
      source={source}
    >
      <ProfileCard />
    </ComponentReference>
  );
}

function ProfileCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>SK</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle>Sarang Kumar</CardTitle>
            <CardDescription>@sarang · Developer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="gap-3">
        <Badge variant="secondary">Open to work</Badge>
        <p className="text-sm">
          Building accessible UI that you install as source.
        </p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button type="button" variant="outline">
          View profile
        </Button>
        <Button type="button" variant="secondary">
          Follow
        </Button>
      </CardFooter>
    </Card>
  );
}

function PricingCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Pro</CardTitle>
          <Badge>Popular</Badge>
        </div>
        <p className="text-foreground text-2xl font-semibold">$24 / month</p>
        <CardDescription>For developers building faster.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="text-sm leading-6">
          <li>Unlimited projects</li>
          <li>Team collaboration</li>
          <li>Priority support</li>
        </ul>
      </CardContent>
      <Separator />
      <CardFooter>
        <Tooltip content="14 days, then $24 a month">
          <Button type="button">Start free trial</Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}

function CheckoutCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="card-number">Card number</Label>
          <Input id="card-number" defaultValue="4242 4242 4242 4242" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="card-name">Name</Label>
          <Input id="card-name" defaultValue="Sarang Kumar" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="checkout-plan">Plan</Label>
          <select id="checkout-plan" defaultValue="pro" className={selectClass}>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="save-payment" defaultChecked />
          <Label htmlFor="save-payment">Save payment method</Label>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between">
        <span className="text-sm">Total</span>
        <span className="text-sm font-medium">$24</span>
      </CardFooter>
      <Button type="button">Confirm payment</Button>
    </Card>
  );
}

function ProjectCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Vinyaas</CardTitle>
        <CardDescription>Accessible component library</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Open source</Badge>
          <Badge variant="outline">v0.2</Badge>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <span>Components</span>
            <span>20 / 25</span>
          </div>
          <Progress aria-label="Catalog progress" value={20} max={25} />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between">
        <span className="text-muted-foreground text-sm">Updated recently</span>
        <Button type="button" variant="outline">
          View project
        </Button>
      </CardFooter>
    </Card>
  );
}

function SettingsCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Account settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="display-name">Display name</Label>
          <Input id="display-name" defaultValue="Sarang Kumar" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="account-email">Email</Label>
          <Input
            id="account-email"
            type="email"
            defaultValue="sarang@example.com"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="product-updates">Receive product updates</Label>
          <Switch id="product-updates" defaultChecked />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="activity-email" defaultChecked />
          <Label htmlFor="activity-email">Email me about activity</Label>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="justify-end">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="button">Save changes</Button>
      </CardFooter>
    </Card>
  );
}

function ActivityCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>VW</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-1">
            <CardTitle>Deployment completed</CardTitle>
            <CardDescription>vinyaas-web</CardDescription>
          </div>
          <Badge variant="secondary">Succeeded</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Production deployment succeeded.</p>
        <p className="text-muted-foreground text-sm">2 minutes ago</p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Tooltip content="Opens the deployment log">
          <Button type="button" variant="outline">
            View deployment
          </Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
