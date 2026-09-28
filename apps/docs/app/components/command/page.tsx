import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar/avatar";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/registry/new-york/ui/command/command";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("command");

const usage = `import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command/command";

export function PageSearch() {
  return (
    <Command>
      <CommandInput aria-label="Search pages" placeholder="Search pages" />
      <CommandList>
        <CommandEmpty>No matching pages.</CommandEmpty>
        <CommandGroup heading="Components">
          <CommandItem value="Button">Button</CommandItem>
          <CommandItem value="Input">Input</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "string",
    description: "The text CommandItem matches against the query.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Keeps an item visible and skips it with the arrow keys.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "pages",
    title: "Documentation search",
    description:
      "Groups filter as the query changes. Enter activates the highlighted item.",
    preview: (
      <Command className="w-full max-w-md">
        <CommandInput
          aria-label="Search pages"
          placeholder="Search components..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Components">
            <CommandItem value="Accordion">
              Accordion
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem value="Alert">
              Alert
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem value="Avatar">
              Avatar
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Getting Started">
            <CommandItem value="Introduction">
              Introduction
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem value="Installation">
              Installation
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    code: usage,
  },
  {
    id: "actions",
    title: "Quick actions",
    description: "A palette can open settings, a profile, or sign out.",
    preview: (
      <Command className="w-full max-w-md">
        <CommandInput aria-label="Quick actions" placeholder="Quick actions" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem value="Create project">Create project</CommandItem>
            <CommandItem value="Open settings">Open settings</CommandItem>
            <CommandItem value="View profile">View profile</CommandItem>
            <CommandItem value="Sign out">Sign out</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    code: `import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command/command";

export function QuickActions() {
  return (
    <Command>
      <CommandInput aria-label="Quick actions" placeholder="Quick actions" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem value="Create project">Create project</CommandItem>
          <CommandItem value="Open settings">Open settings</CommandItem>
          <CommandItem value="View profile">View profile</CommandItem>
          <CommandItem value="Sign out">Sign out</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
`,
  },
  {
    id: "palette",
    title: "Command palette",
    description: "Navigation and actions can share one list.",
    preview: (
      <Command className="w-full max-w-md">
        <CommandInput
          aria-label="Command palette"
          placeholder="Type a command"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem value="Introduction">Introduction</CommandItem>
            <CommandItem value="Components">Components</CommandItem>
            <CommandItem value="Installation">Installation</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem value="Create component">Create component</CommandItem>
            <CommandItem value="Copy CLI command">Copy CLI command</CommandItem>
            <CommandItem value="Open GitHub">Open GitHub</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    code: usage,
  },
  {
    id: "people",
    title: "Searchable people",
    description: "A result can include an avatar and a status badge.",
    preview: (
      <Command className="w-full max-w-md">
        <CommandInput aria-label="Search people" placeholder="Search people" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="People">
            <CommandItem value="Ada Lovelace mathematician">
              <Avatar>
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <span className="grid min-w-0">
                <span>Ada Lovelace</span>
                <span className="text-muted-foreground text-xs">
                  Mathematician
                </span>
              </span>
              <Badge>Available</Badge>
            </CommandItem>
            <CommandItem value="Grace Hopper">
              <Avatar>
                <AvatarFallback>GH</AvatarFallback>
              </Avatar>
              <span className="grid min-w-0">
                <span>Grace Hopper</span>
                <span className="text-muted-foreground text-xs">
                  Computer scientist
                </span>
              </span>
              <Badge variant="secondary">Away</Badge>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    code: `import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command/command";

export function PeopleSearch() {
  return (
    <Command>
      <CommandInput aria-label="Search people" placeholder="Search people" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="People">
          <CommandItem value="Ada Lovelace">
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            Ada Lovelace
            <Badge>Available</Badge>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
`,
  },
];

export default async function CommandPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/command/command.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Command"
      description="A searchable list for pages and actions."
      overview={
        <p>
          CommandInput filters CommandItem values. Arrow keys move the active
          item. Enter activates it. The docs search dialog uses this list, and
          the component itself stays free of documentation routes.
        </p>
      }
      install="vinyaas add command"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/command/command.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>The input is a combobox and the list is a listbox.</li>
          <li>
            Items are options. The active item sets aria-activedescendant.
          </li>
          <li>
            Disabled items stay in the list and are skipped by the arrows.
          </li>
        </ul>
      }
      source={source}
    >
      <Command className="w-full max-w-md">
        <CommandInput
          aria-label="Search pages"
          placeholder="Search components..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Components">
            <CommandItem value="Button">
              Button
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem value="Input">
              Input
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </ComponentReference>
  );
}
