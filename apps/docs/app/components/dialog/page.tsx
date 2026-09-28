import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog/dialog";
import { Input } from "@/registry/new-york/ui/input/input";
import { Label } from "@/registry/new-york/ui/label/label";
import { Switch } from "@/registry/new-york/ui/switch/switch";
import { Textarea } from "@/registry/new-york/ui/textarea/textarea";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("dialog");

const usage = `import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";

export function EditDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your public profile.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "open",
    type: "boolean",
    description: "Controlled open state.",
  },
  {
    prop: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    description: "Opens the dialog on first render when it is uncontrolled.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Called when the dialog opens or closes.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the part with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "edit-profile",
    title: "Edit profile",
    description:
      "The trigger is a button. The dialog holds a label, an input, and a textarea. Cancel and Save close it.",
    preview: (
      <Dialog>
        <DialogTrigger>
          <Button>Edit profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update your public profile.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Display name</Label>
            <Input id="profile-name" defaultValue="Sarang Kumar" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea id="profile-bio" defaultValue="Building accessible UI." />
          </div>
          <DialogFooter>
            <DialogClose className="border-border inline-flex h-9 items-center rounded-md border px-4 text-sm">
              Cancel
            </DialogClose>
            <DialogClose className="bg-primary text-primary-foreground inline-flex h-9 items-center rounded-md px-4 text-sm">
              Save
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";

export function EditProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your public profile.</DialogDescription>
        </DialogHeader>
        <Label htmlFor="profile-name">Display name</Label>
        <Input id="profile-name" defaultValue="Sarang Kumar" />
        <Label htmlFor="profile-bio">Bio</Label>
        <Textarea id="profile-bio" defaultValue="Building accessible UI." />
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
`,
  },
  {
    id: "delete-project",
    title: "Delete confirmation",
    description: "A destructive action stays behind a confirmation.",
    preview: (
      <Dialog>
        <DialogTrigger>
          <Button variant="destructive">Delete project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This removes the project and its deployments.
            </DialogDescription>
          </DialogHeader>
          <Badge variant="destructive">vinyaas-web</Badge>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <DialogClose>Delete</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";

export function DeleteProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="destructive">Delete project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This removes the project and its deployments.
          </DialogDescription>
        </DialogHeader>
        <Badge variant="destructive">vinyaas-web</Badge>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose>Delete</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
`,
  },
  {
    id: "account-settings",
    title: "Account settings",
    description:
      "A longer form scrolls inside the dialog. The page behind it does not scroll.",
    preview: (
      <Dialog>
        <DialogTrigger>
          <Button variant="outline">Account settings</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account settings</DialogTitle>
            <DialogDescription>
              Name, email, and notification preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="account-name">Display name</Label>
            <Input id="account-name" defaultValue="Sarang Kumar" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="account-email">Email</Label>
            <Input id="account-email" defaultValue="sarang@example.com" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="account-updates">Product updates</Label>
            <Switch id="account-updates" defaultChecked />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="account-activity" defaultChecked />
            <Label htmlFor="account-activity">Email me about activity</Label>
          </div>
          <ul className="text-muted-foreground grid gap-2 text-sm">
            {[
              "Invoices",
              "Receipts",
              "API keys",
              "Members",
              "Audit log",
              "Webhooks",
              "Domains",
              "Backups",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <DialogClose>Save changes</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Switch } from "@/components/ui/switch/switch";

export function AccountDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Account settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account settings</DialogTitle>
          <DialogDescription>Name, email, and notification preferences.</DialogDescription>
        </DialogHeader>
        <Label htmlFor="account-name">Display name</Label>
        <Input id="account-name" defaultValue="Sarang Kumar" />
        <Label htmlFor="account-email">Email</Label>
        <Input id="account-email" defaultValue="sarang@example.com" />
        <Label htmlFor="account-updates">Product updates</Label>
        <Switch id="account-updates" defaultChecked />
        <Checkbox id="account-activity" defaultChecked />
        <Label htmlFor="account-activity">Email me about activity</Label>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose>Save changes</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
`,
  },
];

export default async function DialogPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/dialog/dialog.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Dialog"
      description="A modal panel for a focused task."
      overview={
        <>
          <p>
            Dialog is built with React and the browser. It does not use a dialog
            library. Pass one element to <code>DialogTrigger</code>. The trigger
            receives the click handler and the ref. There is no{" "}
            <code>asChild</code> prop.
          </p>
          <p>
            <code>DialogTitle</code> and <code>DialogDescription</code> supply
            the ids for <code>aria-labelledby</code> and{" "}
            <code>aria-describedby</code>.
          </p>
        </>
      }
      install="vinyaas add dialog"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/dialog/dialog.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            The panel is <code>role=&quot;dialog&quot;</code> and{" "}
            <code>aria-modal=&quot;true&quot;</code>.
          </li>
          <li>Escape closes the top-most dialog.</li>
          <li>Focus moves into the dialog and returns to the trigger.</li>
          <li>The page body does not scroll while a dialog is open.</li>
          <li>Long content scrolls inside the panel.</li>
        </ul>
      }
      source={source}
    >
      <Dialog>
        <DialogTrigger>
          <Button>Edit profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update your public profile.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ComponentReference>
  );
}
