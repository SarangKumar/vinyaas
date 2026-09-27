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
import { Select } from "@/registry/new-york/ui/select/select";

const usage = `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
      <CardFooter>
        <button type="button">Close</button>
      </CardFooter>
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
      "A card can group an avatar, a status badge, and the action for that person.",
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

export function ProfileCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle>Sarah Johnson</CardTitle>
            <CardDescription>Product Designer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">Available</Badge>
      </CardContent>
      <CardFooter>
        <Button type="button" variant="outline" className="w-full">
          View profile
        </Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "account",
    title: "Account",
    description:
      "Pair labels and inputs inside the content area for a short form.",
    preview: <AccountCard />,
    code: `import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";

export function AccountCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Update the name on your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="account-name">Name</Label>
            <Input id="account-name" defaultValue="Sarah Johnson" />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </CardContent>
    </Card>
  );
}
`,
  },
  {
    id: "billing",
    title: "Billing",
    description:
      "A select and a checkbox fit in the same card when they belong to one setting.",
    preview: <BillingCard />,
    code: `import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Label } from "@/components/ui/label/label";
import { Select } from "@/components/ui/select/select";

export function BillingCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Receipts and the default payment method.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="payment-method">Payment method</Label>
          <Select id="payment-method" defaultValue="card">
            <option value="card">Card ending 4242</option>
            <option value="bank">Bank transfer</option>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="email-receipts" defaultChecked />
          <Label htmlFor="email-receipts">Email receipts</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="button">Save preferences</Button>
      </CardFooter>
    </Card>
  );
}
`,
  },
  {
    id: "footer-actions",
    title: "Footer actions",
    description:
      "CardFooter holds the actions. Outline and secondary stay quieter than the page's primary button.",
    preview: <ArchiveCard />,
    code: `import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";

export function ArchiveCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Archive project</CardTitle>
        <CardDescription>The project stays recoverable for 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Members lose access until you restore it.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="button" variant="secondary">
          Archive
        </Button>
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
          Card does not add a role. Use a heading in the page around the card
          when the section needs one. Controls inside the card keep their own
          names through Label, Button, or visible text.
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
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle>Sarah Johnson</CardTitle>
            <CardDescription>Product Designer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">Available</Badge>
      </CardContent>
      <CardFooter>
        <Button type="button" variant="outline" className="w-full">
          View profile
        </Button>
      </CardFooter>
    </Card>
  );
}

function AccountCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Update the name on your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="account-name">Name</Label>
            <Input id="account-name" defaultValue="Sarah Johnson" />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function BillingCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>
          Receipts and the default payment method.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="payment-method">Payment method</Label>
          <Select id="payment-method" defaultValue="card">
            <option value="card">Card ending 4242</option>
            <option value="bank">Bank transfer</option>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="email-receipts" defaultChecked />
          <Label htmlFor="email-receipts">Email receipts</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="button">Save preferences</Button>
      </CardFooter>
    </Card>
  );
}

function ArchiveCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Archive project</CardTitle>
        <CardDescription>
          The project stays recoverable for 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Members lose access until you restore it.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="button" variant="secondary">
          Archive
        </Button>
      </CardFooter>
    </Card>
  );
}
