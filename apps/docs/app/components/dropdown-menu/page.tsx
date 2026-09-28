import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu/dropdown-menu";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area/scroll-area";

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function Actions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="More actions"
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          Delete account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const usage = `import { Button } from "@/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";

export function Actions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">⋮</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`;

const menuCode = `import { Button } from "@/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">⋮</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    id: "actions",
    title: "Actions",
    description:
      "A named icon button opens the menu. Items can show a shortcut, stay disabled, or use the destructive color.",
    preview: <Actions />,
    code: { tsx: menuCode, jsx: menuCode },
  },
  {
    id: "in-a-scroll-area",
    title: "In a scrolling region",
    description:
      "The menu is portaled and follows the trigger when the region scrolls.",
    preview: (
      <ScrollArea
        className="border-border h-32 w-full max-w-sm rounded-md border"
        aria-label="Toolbar"
      >
        <div className="flex h-48 items-start justify-end p-3">
          <Actions />
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";

export function ScrollingActions() {
  return (
    <ScrollArea className="h-32 rounded-md border" aria-label="Toolbar">
      <div className="flex h-48 justify-end p-3">{/* menu trigger */}</div>
    </ScrollArea>
  );
}
`,
  },
];

export default async function DropdownMenuPage() {
  const source = await readFile(
    path.join(
      process.cwd(),
      "registry/new-york/ui/dropdown-menu/dropdown-menu.tsx",
    ),
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
          <code>components/ui/dropdown-menu/dropdown-menu.tsx</code>. It imports{" "}
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
      <Actions />
    </ComponentReference>
  );
}
