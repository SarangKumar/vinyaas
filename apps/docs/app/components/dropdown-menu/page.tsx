import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  AccountMenu,
  CardActionsMenu,
  ProjectMenu,
  TableRowMenu,
  TeamRowMenu,
  UserMenu,
} from "./dropdown-menu-demos";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("dropdown-menu");

const usage = `import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Actions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">⋮</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`;

const teamRowCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TeamRowMenu() {
  return (
    <div className="border-border flex w-full max-w-md items-center gap-3 rounded-lg border p-3">
      <Avatar className="size-9">
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">Aarav Sharma</p>
        <p className="text-muted-foreground truncate text-xs">
          aarav@vinyaas.dev
        </p>
      </div>
      <Badge variant="secondary">Admin</Badge>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Team actions for Aarav Sharma"
          >
            ⋮
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View profile</DropdownMenuItem>
          <DropdownMenuItem>Change role</DropdownMenuItem>
          <DropdownMenuItem>Resend invite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            Remove from team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "open",
    type: "boolean",
    description: "Controlled open state on DropdownMenu.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Called when the menu opens or closes.",
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    defaultValue: '"start"',
    description:
      "Horizontal alignment of DropdownMenuContent against the trigger.",
  },
  {
    prop: "side",
    type: '"top" | "bottom"',
    defaultValue: '"bottom"',
    description:
      "Preferred side. The menu flips when it would leave the viewport.",
  },
  {
    prop: "variant",
    type: '"default" | "destructive"',
    defaultValue: '"default"',
    description:
      "DropdownMenuItem color. destructive uses the danger text color.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the part with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "project",
    title: "Project actions",
    description: "Open, Rename, Move, Share, and Archive for a project.",
    preview: <ProjectMenu />,
    code: usage,
  },
  {
    id: "user",
    title: "User actions",
    description: "View profile, Message, Copy email, and Block.",
    preview: <UserMenu />,
    code: usage,
  },
  {
    id: "account",
    title: "Account menu",
    description:
      "Avatar, name, and email sit beside a menu for profile, settings, theme, and sign out.",
    preview: <AccountMenu />,
    code: usage,
  },
  {
    id: "card-actions",
    title: "Card actions",
    description:
      "A three-dot CardAction opens Edit, Duplicate, Archive, and Delete.",
    preview: <CardActionsMenu />,
    code: usage,
  },
  {
    id: "table-row",
    title: "Table row actions",
    description: "A row menu for View, Edit, Copy ID, and Delete.",
    preview: <TableRowMenu />,
    code: usage,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A team member row pairs Avatar, a role Badge, and a menu for profile, role, invite, and removal.",
  preview: <TeamRowMenu />,
  code: { tsx: teamRowCode, jsx: teamRowCode },
};

export default async function DropdownMenuPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/dropdown-menu/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Dropdown Menu"
      description="A menu of actions anchored to a button."
      overview={
        <p>
          DropdownMenuTrigger clones one button. The menu is portaled, follows
          its trigger while a parent scrolls, and stays inside the viewport.
          Arrow keys move between items. Escape closes the menu and returns
          focus to the trigger.
        </p>
      }
      install="vinyaas add dropdown-menu"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/dropdown-menu/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            The trigger uses aria-haspopup=&quot;menu&quot; and aria-expanded.
          </li>
          <li>
            The panel is role=&quot;menu&quot;. Items are
            role=&quot;menuitem&quot;.
          </li>
          <li>An icon-only trigger needs an accessible name.</li>
          <li>
            Disabled items stay in the menu and are skipped by the arrow keys.
          </li>
          <li>Escape and Tab close the menu. Focus returns to the trigger.</li>
        </ul>
      }
      source={source}
    >
      <ProjectMenu />
    </ComponentReference>
  );
}
