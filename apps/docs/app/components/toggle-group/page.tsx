import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york/ui/toggle-group";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "../toggle/icons";

export const metadata: Metadata = componentPageMetadata("toggle-group");

const usage = `import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

export function Alignment() {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "multiple",
    type: "boolean",
    defaultValue: "false",
    description:
      "ToggleGroup. Allow several items pressed at once. By default one item is pressed at a time and pressing it again clears the group.",
  },
  {
    prop: "value",
    type: "string[]",
    description: "ToggleGroup. Controlled pressed item values.",
  },
  {
    prop: "defaultValue",
    type: "string[]",
    defaultValue: "[]",
    description:
      "ToggleGroup. Initial pressed values for an uncontrolled group.",
  },
  {
    prop: "onValueChange",
    type: "(value: string[]) => void",
    description: "ToggleGroup. Called with the next pressed values.",
  },
  {
    prop: "variant",
    type: '"default" | "outline"',
    defaultValue: '"default"',
    description: "ToggleGroup. Applied to every item.",
  },
  {
    prop: "size",
    type: '"sm" | "default" | "lg"',
    defaultValue: '"default"',
    description: "ToggleGroup. Applied to every item.",
  },
  {
    prop: "spacing",
    type: "number",
    defaultValue: "0",
    description:
      "ToggleGroup. Gap between items in 4px steps. 0 joins the items into one bar with shared borders.",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description:
      "ToggleGroup. Sets the layout direction and which arrow keys move focus.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description:
      "ToggleGroup disables every item. ToggleGroupItem disables one.",
  },
  {
    prop: "value",
    type: "string",
    description: "ToggleGroupItem. Required. The value reported by the group.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "single",
    title: "Single selection",
    description:
      "By default one item is pressed at a time, like a segmented control. Press the active item again to clear it.",
    preview: (
      <ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    ),
    code: `<ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
  <ToggleGroupItem value="left" aria-label="Align left">
    <AlignLeftIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align center">
    <AlignCenterIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Align right">
    <AlignRightIcon />
  </ToggleGroupItem>
</ToggleGroup>`,
  },
  {
    id: "multiple",
    title: "Multiple selection",
    description: "multiple lets any combination of items stay pressed.",
    preview: (
      <ToggleGroup
        multiple
        variant="outline"
        aria-label="Text style"
        defaultValue={["bold", "underline"]}
      >
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    ),
    code: `<ToggleGroup
  multiple
  variant="outline"
  aria-label="Text style"
  defaultValue={["bold", "underline"]}
>
  <ToggleGroupItem value="bold" aria-label="Bold">
    <BoldIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic">
    <ItalicIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Underline">
    <UnderlineIcon />
  </ToggleGroupItem>
</ToggleGroup>`,
  },
  {
    id: "outline",
    title: "Outline with text",
    description:
      "The outline variant joins the items into one bordered bar. Text labels work like icons.",
    preview: (
      <ToggleGroup variant="outline" aria-label="View" defaultValue={["month"]}>
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    ),
    code: `<ToggleGroup variant="outline" aria-label="View" defaultValue={["month"]}>
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
</ToggleGroup>`,
  },
  {
    id: "sizes",
    title: "Sizes",
    description: "sm, default, and lg match the Button height scale.",
    preview: (
      <div className="flex flex-col items-center gap-3">
        {(["sm", "default", "lg"] as const).map((size) => (
          <ToggleGroup
            key={size}
            variant="outline"
            size={size}
            aria-label={`${size} size`}
            defaultValue={["a"]}
          >
            <ToggleGroupItem value="a">One</ToggleGroupItem>
            <ToggleGroupItem value="b">Two</ToggleGroupItem>
            <ToggleGroupItem value="c">Three</ToggleGroupItem>
          </ToggleGroup>
        ))}
      </div>
    ),
    code: `<ToggleGroup variant="outline" size="sm" defaultValue={["a"]}>
  <ToggleGroupItem value="a">One</ToggleGroupItem>
  <ToggleGroupItem value="b">Two</ToggleGroupItem>
  <ToggleGroupItem value="c">Three</ToggleGroupItem>
</ToggleGroup>`,
  },
  {
    id: "spacing",
    title: "Spacing",
    description:
      "spacing separates the items. Each one keeps its own rounded border.",
    preview: (
      <ToggleGroup
        variant="outline"
        spacing={2}
        aria-label="Text alignment"
        defaultValue={["center"]}
      >
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    ),
    code: `<ToggleGroup variant="outline" spacing={2} defaultValue={["center"]}>
  <ToggleGroupItem value="left" aria-label="Align left">
    <AlignLeftIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align center">
    <AlignCenterIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Align right">
    <AlignRightIcon />
  </ToggleGroupItem>
</ToggleGroup>`,
  },
  {
    id: "vertical",
    title: "Vertical",
    description:
      "orientation=vertical stacks the items. Up and Down arrows move focus.",
    preview: (
      <ToggleGroup
        orientation="vertical"
        variant="outline"
        aria-label="Text alignment"
        defaultValue={["left"]}
      >
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    ),
    code: `<ToggleGroup orientation="vertical" variant="outline" defaultValue={["left"]}>
  <ToggleGroupItem value="left" aria-label="Align left">
    <AlignLeftIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align center">
    <AlignCenterIcon />
  </ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Align right">
    <AlignRightIcon />
  </ToggleGroupItem>
</ToggleGroup>`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "disabled on the group or on a single item.",
    preview: (
      <div className="flex flex-col items-center gap-3">
        <ToggleGroup variant="outline" disabled aria-label="Disabled group">
          <ToggleGroupItem value="a">One</ToggleGroupItem>
          <ToggleGroupItem value="b">Two</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup variant="outline" aria-label="One disabled item">
          <ToggleGroupItem value="a">One</ToggleGroupItem>
          <ToggleGroupItem value="b" disabled>
            Two
          </ToggleGroupItem>
          <ToggleGroupItem value="c">Three</ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
    code: `<ToggleGroup variant="outline" disabled>
  <ToggleGroupItem value="a">One</ToggleGroupItem>
  <ToggleGroupItem value="b">Two</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup variant="outline">
  <ToggleGroupItem value="a">One</ToggleGroupItem>
  <ToggleGroupItem value="b" disabled>Two</ToggleGroupItem>
  <ToggleGroupItem value="c">Three</ToggleGroupItem>
</ToggleGroup>`,
  },
];

const inPracticeSource = `import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

export function EditorToolbar() {
  return (
    <div className="flex items-center gap-3">
      <ToggleGroup multiple variant="outline" aria-label="Text style">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup variant="outline" aria-label="Alignment" defaultValue={["left"]}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
`;

const inPractice: ComponentInPractice = {
  description:
    "An editor toolbar pairs a multiple-selection style group with a single-selection alignment group.",
  preview: (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ToggleGroup multiple variant="outline" aria-label="Text style">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        variant="outline"
        aria-label="Alignment"
        defaultValue={["left"]}
      >
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
  code: inPracticeSource,
};

export default async function ToggleGroupPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/toggle-group/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Toggle Group"
      description="A set of toggles with single or multiple selection."
      overview={
        <>
          <p>
            ToggleGroup renders a <code>role=&quot;group&quot;</code> of toggle
            buttons that share one value array. It selects a single item by
            default and any combination with <code>multiple</code>.
          </p>
          <p>
            It reuses the Toggle styles, so install pulls in Toggle
            automatically. Items are native buttons with{" "}
            <code>aria-pressed</code>.
          </p>
        </>
      }
      install="vinyaas add toggle-group"
      manual={
        <p>
          After <code>vinyaas init</code>, add <code>toggle</code> first, then
          place the source at <code>components/ui/toggle-group/index.tsx</code>.
          It imports <code>cn</code> from <code>@/lib/utils</code> and{" "}
          <code>toggleVariants</code> from <code>../toggle</code>. The project
          also needs <code>class-variance-authority</code>, <code>clsx</code>,
          and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The group is a <code>role=&quot;group&quot;</code>; name it with{" "}
            <code>aria-label</code> or <code>aria-labelledby</code>. Each item
            reports <code>aria-pressed</code>.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Every item stays in the Tab order. Arrow keys, Home, and End also
              move focus between enabled items.
            </li>
            <li>Space and Enter toggle the focused item.</li>
            <li>Name icon-only items with aria-label.</li>
            <li>Disabled items are skipped by arrow-key movement.</li>
          </ul>
        </>
      }
      source={source}
    >
      <ToggleGroup variant="outline" aria-label="View" defaultValue={["week"]}>
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    </ComponentReference>
  );
}
