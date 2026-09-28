import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { SearchIcon } from "@/components/icons";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/registry/new-york/ui/input-group/input-group";
import { Kbd } from "@/registry/new-york/ui/kbd/kbd";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("input-group");

const usage = `import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group/input-group";

export function SearchField() {
  return (
    <InputGroup>
      <InputGroupAddon>Search</InputGroupAddon>
      <InputGroupInput aria-label="Search" placeholder="Search users" />
    </InputGroup>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "className",
    type: "string",
    description: "Merged onto the group, addon, field, or button with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "search",
    title: "Search",
    description: "A leading icon sits in the same field as the text.",
    preview: (
      <InputGroup className="max-w-sm">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search users" placeholder="Search users" />
      </InputGroup>
    ),
    code: usage,
  },
  {
    id: "currency",
    title: "Currency",
    description: "A text addon names the unit without a second control.",
    preview: (
      <InputGroup className="max-w-sm">
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Amount" defaultValue="24" />
        <InputGroupText>USD</InputGroupText>
      </InputGroup>
    ),
    code: `import { InputGroup, InputGroupInput, InputGroupText } from "@/components/ui/input-group/input-group";

export function Amount() {
  return (
    <InputGroup>
      <InputGroupText>$</InputGroupText>
      <InputGroupInput aria-label="Amount" defaultValue="24" />
      <InputGroupText>USD</InputGroupText>
    </InputGroup>
  );
}
`,
  },
  {
    id: "url",
    title: "URL",
    description: "The protocol stays visible beside the editable host.",
    preview: (
      <InputGroup className="max-w-sm">
        <InputGroupText>https://</InputGroupText>
        <InputGroupInput aria-label="Website" placeholder="vinyaas.dev" />
      </InputGroup>
    ),
    code: usage,
  },
  {
    id: "command",
    title: "Command",
    description: "A keyboard hint uses Kbd inside the same row.",
    preview: (
      <InputGroup className="max-w-sm">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search docs" placeholder="Search docs" />
        <Kbd>⌘K</Kbd>
      </InputGroup>
    ),
    code: usage,
  },
  {
    id: "action",
    title: "Trailing action",
    description: "A button inside the group submits or copies the value.",
    preview: (
      <InputGroup className="max-w-sm">
        <InputGroupInput
          aria-label="Invite email"
          placeholder="ada@example.com"
        />
        <InputGroupButton>Invite</InputGroupButton>
      </InputGroup>
    ),
    code: usage,
  },
  {
    id: "notes",
    title: "Textarea",
    description: "A multiline field can share the group with a count.",
    preview: (
      <div className="grid max-w-sm gap-2">
        <InputGroup>
          <InputGroupTextarea
            aria-label="Notes"
            defaultValue="Ship the notes."
          />
        </InputGroup>
        <p className="text-muted-foreground text-xs">15 characters</p>
        <Button size="sm">Save note</Button>
      </div>
    ),
    code: usage,
  },
];

export default async function InputGroupPage() {
  const source = await readFile(
    path.join(
      process.cwd(),
      "registry/new-york/ui/input-group/input-group.tsx",
    ),
    "utf8",
  );

  return (
    <ComponentReference
      title="Input Group"
      description="A field with icons, text, and actions in one row."
      overview={
        <p>
          InputGroup draws the border and background. InputGroupInput and
          InputGroupTextarea are the native fields. Addons, text, and buttons
          sit in the same row. Pair it with Kbd or Button when the page already
          installs those components.
        </p>
      }
      install="vinyaas add input-group"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/input-group/input-group.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>Name the input or textarea with aria-label or a label.</li>
          <li>Icons inside an addon are decorative.</li>
          <li>InputGroupButton is a native button.</li>
        </ul>
      }
      source={source}
    >
      <InputGroup className="max-w-sm">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search" placeholder="Search users" />
      </InputGroup>
    </ComponentReference>
  );
}
