import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Switch } from "@/registry/new-york/ui/switch";
import { Textarea } from "@/registry/new-york/ui/textarea";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("dialog");

const usage = `import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
`;

const deleteCode = `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteProjectDialog() {
  return (
    <div className="border-border flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">vinyaas-web</p>
        <p className="text-muted-foreground text-xs">Production · us-east-1</p>
      </div>
      <Dialog>
        <DialogTrigger>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This removes the project and its deployments. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <Badge variant="destructive">vinyaas-web</Badge>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button variant="destructive">Delete project</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button>Save</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        <div className="grid gap-2">
          <Label htmlFor="profile-name">Display name</Label>
          <Input id="profile-name" defaultValue="Sarang Kumar" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea id="profile-bio" defaultValue="Building accessible UI." />
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button>Save</Button>
          </DialogClose>
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
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button>Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
          <li>Invoices</li>
          <li>Receipts</li>
          <li>API keys</li>
          <li>Members</li>
          <li>Audit log</li>
          <li>Webhooks</li>
          <li>Domains</li>
          <li>Backups</li>
        </ul>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A project row keeps the destructive action behind a confirmation. Cancel stays available; the badge names what will be removed.",
  preview: (
    <div className="border-border flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border p-3 text-left">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">vinyaas-web</p>
        <p className="text-muted-foreground text-xs">Production · us-east-1</p>
      </div>
      <Dialog>
        <DialogTrigger>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This removes the project and its deployments. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <Badge variant="destructive">vinyaas-web</Badge>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button variant="destructive">Delete project</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
  code: { tsx: deleteCode, jsx: deleteCode },
};

export default async function DialogPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/dialog/index.tsx"),
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
          <code>components/ui/dialog/index.tsx</code> and copy{" "}
          <code>dialog.css</code> beside it. It imports <code>cn</code> from{" "}
          <code>@/lib/utils</code>. The project also needs <code>clsx</code> and{" "}
          <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
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
          <Button variant="outline">Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button>Continue</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ComponentReference>
  );
}
