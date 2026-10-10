import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Toggle } from "@/registry/new-york/ui/toggle";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";
import { BoldIcon, ItalicIcon } from "./icons";

export const metadata: Metadata = componentPageMetadata("toggle");

const usage = `import { Toggle } from "@/components/ui/toggle";

export function BoldToggle() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "pressed",
    type: "boolean",
    description:
      "Controlled pressed state. Omit it for an uncontrolled toggle.",
  },
  {
    prop: "defaultPressed",
    type: "boolean",
    defaultValue: "false",
    description: "Initial pressed state for an uncontrolled toggle.",
  },
  {
    prop: "onPressedChange",
    type: "(pressed: boolean) => void",
    description: "Called with the next state after a click.",
  },
  {
    prop: "variant",
    type: '"default" | "outline"',
    defaultValue: '"default"',
    description: "Transparent or bordered toggle.",
  },
  {
    prop: "size",
    type: '"sm" | "default" | "lg"',
    defaultValue: '"default"',
    description: "Heights match Button: h-8, h-9, and h-10.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Native disabled button. It cannot be toggled.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the button with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "default",
    title: "Default",
    description: "An icon toggle needs an aria-label.",
    preview: (
      <Toggle aria-label="Toggle bold">
        <BoldIcon />
      </Toggle>
    ),
    code: `<Toggle aria-label="Toggle bold">
  <BoldIcon />
</Toggle>`,
  },
  {
    id: "outline",
    title: "Outline",
    description: "The outline variant adds a border and keeps the same size.",
    preview: (
      <Toggle variant="outline" aria-label="Toggle italic">
        <ItalicIcon />
      </Toggle>
    ),
    code: `<Toggle variant="outline" aria-label="Toggle italic">
  <ItalicIcon />
</Toggle>`,
  },
  {
    id: "with-text",
    title: "With text",
    description: "Text and an icon sit side by side.",
    preview: (
      <Toggle variant="outline" aria-label="Toggle italic">
        <ItalicIcon />
        Italic
      </Toggle>
    ),
    code: `<Toggle variant="outline" aria-label="Toggle italic">
  <ItalicIcon />
  Italic
</Toggle>`,
  },
  {
    id: "sizes",
    title: "Sizes",
    description: "sm, default, and lg match the Button height scale.",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Toggle variant="outline" size="sm" aria-label="Small">
          Small
        </Toggle>
        <Toggle variant="outline" aria-label="Default">
          Default
        </Toggle>
        <Toggle variant="outline" size="lg" aria-label="Large">
          Large
        </Toggle>
      </div>
    ),
    code: `<Toggle variant="outline" size="sm">Small</Toggle>
<Toggle variant="outline">Default</Toggle>
<Toggle variant="outline" size="lg">Large</Toggle>`,
  },
  {
    id: "pressed-and-disabled",
    title: "Pressed and disabled",
    description: "defaultPressed starts on. disabled ignores clicks.",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Toggle variant="outline" defaultPressed aria-label="Pressed">
          Pressed
        </Toggle>
        <Toggle variant="outline" disabled aria-label="Disabled">
          Disabled
        </Toggle>
      </div>
    ),
    code: `<Toggle variant="outline" defaultPressed>Pressed</Toggle>
<Toggle variant="outline" disabled>Disabled</Toggle>`,
  },
];

const inPracticeSource = `import { Toggle } from "@/components/ui/toggle";

export function FormatBar() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Bold" defaultPressed>
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic">
        <ItalicIcon />
      </Toggle>
    </div>
  );
}
`;

const inPractice: ComponentInPractice = {
  description:
    "Independent formatting toggles. Each keeps its own pressed state; use Toggle Group when the choices belong together.",
  preview: (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Bold" defaultPressed>
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic">
        <ItalicIcon />
      </Toggle>
    </div>
  ),
  code: inPracticeSource,
};

export default async function TogglePage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/toggle/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Toggle"
      description="A two-state button that stays pressed until toggled again."
      overview={
        <>
          <p>
            Toggle is a native <code>button</code> with{" "}
            <code>aria-pressed</code>. Click, Space, and Enter flip it.
          </p>
          <p>
            It works controlled (<code>pressed</code>) or uncontrolled (
            <code>defaultPressed</code>). Use Toggle Group for a set of related
            toggles, and Switch for a setting that applies immediately.
          </p>
        </>
      }
      install="vinyaas add toggle"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/toggle/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>class-variance-authority</code>, <code>clsx</code>, and{" "}
          <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The control is a button with <code>aria-pressed</code>, so assistive
            technology announces it as a toggle button.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Give icon-only toggles an <code>aria-label</code> that names the
              action, not the state.
            </li>
            <li>Space and Enter toggle it when it has focus.</li>
            <li>disabled blocks activation and uses the native attribute.</li>
            <li>Focus uses a visible focus-visible ring.</li>
          </ul>
        </>
      }
      source={source}
    >
      <Toggle variant="outline" aria-label="Toggle bold">
        <BoldIcon />
        Bold
      </Toggle>
    </ComponentReference>
  );
}
