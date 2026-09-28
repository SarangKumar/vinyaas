import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
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
      <Command className="max-w-sm">
        <CommandInput aria-label="Search pages" placeholder="Search pages" />
        <CommandList>
          <CommandEmpty>No matching pages.</CommandEmpty>
          <CommandGroup heading="Getting Started">
            <CommandItem value="Installation setup">
              Installation
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Components">
            <CommandItem value="Button">Button</CommandItem>
            <CommandItem value="Input field">Input</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    code: usage,
  },
  {
    id: "actions",
    title: "Actions",
    description: "A command list can mix status and a disabled action.",
    preview: (
      <Command className="max-w-sm">
        <CommandInput
          aria-label="Project actions"
          placeholder="Project actions"
        />
        <CommandList>
          <CommandEmpty>No matching actions.</CommandEmpty>
          <CommandGroup heading="Project">
            <CommandItem value="Publish">
              Publish <Badge variant="secondary">Ready</Badge>
            </CommandItem>
            <CommandItem value="Archive" disabled>
              Archive
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    code: usage,
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
          item. Enter activates it. The docs navbar uses this list inside a
          dialog and opens it with ⌘K or Ctrl K.
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
      <Command className="max-w-sm">
        <CommandInput aria-label="Search pages" placeholder="Search pages" />
        <CommandList>
          <CommandEmpty>No matching pages.</CommandEmpty>
          <CommandGroup heading="Components">
            <CommandItem value="Button">Button</CommandItem>
            <CommandItem value="Input">Input</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </ComponentReference>
  );
}
