import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover/popover";
import { ProfileSettings } from "./profile-settings";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("popover");

const usage = `import { Button } from "@/components/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

export function Details() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button type="button">Details</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Installed as source.</p>
      </PopoverContent>
    </Popover>
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
    description: "Initial open state for an uncontrolled popover.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Called when the popover opens or closes.",
  },
  {
    prop: "side",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"bottom"',
    description: "Preferred side of the trigger.",
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    defaultValue: '"center"',
    description: "Alignment along the chosen side.",
  },
];

const profileSource = `import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";
import { Separator } from "@/components/ui/separator/separator";
import { Switch } from "@/components/ui/switch/switch";

export function ProfileSettings() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button type="button" variant="outline">
          Profile
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">Account</p>
          <Badge>Pro</Badge>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="profile-name">Name</Label>
          <Input id="profile-name" defaultValue="Ada Lovelace" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" type="email" defaultValue="ada@example.com" />
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="profile-notifications">Notifications</Label>
          <Switch id="profile-notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="profile-privacy">Privacy</Label>
          <Switch id="profile-privacy" />
        </div>
        <Button type="button">Save account</Button>
      </PopoverContent>
    </Popover>
  );
}
`;

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description:
      "Click the trigger. Escape or an outside click closes it and returns focus.",
    preview: (
      <Popover>
        <PopoverTrigger>
          <Button type="button">Details</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Installed as source.</p>
        </PopoverContent>
      </Popover>
    ),
    code: `import { Button } from "@/components/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

export function Details() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button type="button">Details</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Installed as source.</p>
      </PopoverContent>
    </Popover>
  );
}
`,
  },
  {
    id: "profile-settings",
    title: "Profile settings",
    description:
      "A settings panel combines a badge, fields, switches, and a save button. Long content scrolls inside the panel.",
    preview: <ProfileSettings />,
    code: profileSource,
  },
  {
    id: "alignment",
    title: "Alignment",
    description:
      "side and align place the panel around the trigger. The panel follows the trigger when the page scrolls.",
    preview: (
      <Popover>
        <PopoverTrigger>
          <Button type="button" variant="outline">
            Align
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start">
          <p>Aligned to the start of the trigger.</p>
        </PopoverContent>
      </Popover>
    ),
    code: `import { Button } from "@/components/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

export function AlignedDetails() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button type="button" variant="outline">
          Align
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start">
        <p>Aligned to the start of the trigger.</p>
      </PopoverContent>
    </Popover>
  );
}
`,
  },
];

export default async function PopoverPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/popover/popover.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Popover"
      description="A floating panel with interactive content."
      overview={
        <>
          <p>
            Popover opens from a click or keyboard activation of its trigger.
            The panel is portaled to the document body. Escape and an outside
            click close it, and focus returns to the trigger.
          </p>
          <p>
            Unlike Tooltip, the panel can contain buttons, fields, and links.
            Focus is not trapped: tabbing can leave the panel. The panel is
            positioned against the trigger and moves when the page scrolls.
            Content taller than the viewport scrolls inside the panel.
          </p>
        </>
      }
      install="vinyaas add popover"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/popover/popover.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>
            The trigger sets <code>aria-expanded</code>,{" "}
            <code>aria-haspopup=&quot;dialog&quot;</code>, and{" "}
            <code>aria-controls</code>. The panel is a non-modal{" "}
            <code>dialog</code>.
          </p>
          <ul className="list-disc pl-5">
            <li>Opening moves focus to the first control, or to the panel.</li>
            <li>Escape and an outside click close it and return focus.</li>
            <li>Each popover keeps its own open state.</li>
          </ul>
        </>
      }
      source={source}
    >
      <Popover>
        <PopoverTrigger>
          <Button type="button">Details</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Installed as source.</p>
        </PopoverContent>
      </Popover>
    </ComponentReference>
  );
}
