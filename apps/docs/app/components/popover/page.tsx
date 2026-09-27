import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button/button";
import { Input } from "@/registry/new-york/ui/input/input";
import { Label } from "@/registry/new-york/ui/label/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover/popover";

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

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Click the trigger. Escape or an outside click closes it.",
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
    code: `<Popover>
  <PopoverTrigger>
    <Button type="button">Details</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Installed as source.</p>
  </PopoverContent>
</Popover>`,
  },
  {
    id: "alignment",
    title: "Alignment",
    description: "side and align place the panel. It shifts to stay in view.",
    preview: (
      <Popover>
        <PopoverTrigger>
          <Button type="button" variant="outline">
            Align
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start">
          <p>Aligned to the start.</p>
        </PopoverContent>
      </Popover>
    ),
    code: `<PopoverContent side="bottom" align="start">
  <p>Aligned to the start.</p>
</PopoverContent>`,
  },
  {
    id: "interactive",
    title: "Interactive",
    description: "Content can contain buttons and other controls.",
    preview: (
      <Popover>
        <PopoverTrigger>
          <Button type="button">Actions</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Button type="button">Save note</Button>
        </PopoverContent>
      </Popover>
    ),
    code: `<PopoverContent>
  <Button type="button">Save note</Button>
</PopoverContent>`,
  },
  {
    id: "form",
    title: "Form",
    description: "A field inside the popover is a normal control.",
    preview: (
      <Popover>
        <PopoverTrigger>
          <Button type="button">Rename</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-2">
            <Label htmlFor="popover-name">Name</Label>
            <Input id="popover-name" defaultValue="Ada" />
          </div>
        </PopoverContent>
      </Popover>
    ),
    code: `<PopoverContent>
  <Label htmlFor="name">Name</Label>
  <Input id="name" defaultValue="Ada" />
</PopoverContent>`,
  },
  {
    id: "close",
    title: "Close",
    description: "Escape closes the popover and returns focus to the trigger.",
    preview: (
      <Popover>
        <PopoverTrigger>
          <Button type="button">Close me</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Press Escape.</p>
        </PopoverContent>
      </Popover>
    ),
    code: `<Popover>
  <PopoverTrigger>
    <Button type="button">Close me</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Press Escape.</p>
  </PopoverContent>
</Popover>`,
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
            Focus is not trapped: tabbing can leave the panel.
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
