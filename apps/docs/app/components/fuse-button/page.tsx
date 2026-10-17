import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";
import { DefaultDemo, CircleDemo, InPracticeDemo } from "./fuse-button-demos";
import { FuseButtonInteractiveSection } from "./fuse-button-previews";

export const metadata: Metadata = componentPageMetadata("fuse-button");

const usage = `"use client";
import { useState } from "react";
import { FuseButton } from "@/components/ui/fuse-button";

export function DeleteAction() {
  const [active, setActive] = useState(false);

  return (
    <FuseButton
      variant="destructive"
      active={active}
      onActivate={() => setActive(true)}
      onFire={() => {
        setActive(false);
        // perform delete
      }}
      onUndo={() => setActive(false)}
    >
      Delete
    </FuseButton>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "active",
    type: "boolean",
    description:
      "Whether the fuse is lit. The parent sets this to true in onActivate after validation.",
  },
  {
    prop: "onActivate",
    type: "() => void",
    description: "Called when the button is pressed while idle.",
  },
  {
    prop: "onFire",
    type: "() => void",
    description:
      "Called when the fuse burns out. The parent should set active back to false.",
  },
  {
    prop: "onUndo",
    type: "() => void",
    description:
      "Called when the button is pressed while lit. The parent should set active back to false.",
  },
  {
    prop: "duration",
    type: "number",
    defaultValue: "5000",
    description: "Length of the fuse in ms.",
  },
  {
    prop: "undoLabel",
    type: "string",
    defaultValue: '"Undo"',
    description:
      "Label shown while lit, followed by the seconds left. For icon sizes this becomes the accessible name.",
  },
  {
    prop: "shape",
    type: '"rect" | "circle"',
    defaultValue: '"rect"',
    description:
      "rect traces the button corner radius. circle makes the button round and burns along a true circle.",
  },
  {
    prop: "variant",
    type: 'ButtonProps["variant"]',
    description:
      "Button variant for the idle state. Destructive buttons burn red.",
  },
  {
    prop: "size",
    type: 'ButtonProps["size"]',
    description: "Button size. Icon sizes show only the countdown number.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "default",
    title: "Default",
    description:
      "Click to light the fuse. A glowing border burns down from the top. Click again before it runs out to undo.",
    preview: <DefaultDemo />,
    code: `"use client";
import { useState } from "react";
import { FuseButton } from "@/components/ui/fuse-button";

export function Demo() {
  const [active, setActive] = useState(false);

  return (
    <FuseButton
      variant="destructive"
      active={active}
      onActivate={() => setActive(true)}
      onFire={() => setActive(false)}
      onUndo={() => setActive(false)}
    >
      Delete
    </FuseButton>
  );
}`,
  },
  {
    id: "circle",
    title: "Icon / circle",
    description:
      'Icon-size buttons use shape="circle" for a round fuse. The countdown number appears inside.',
    preview: <CircleDemo />,
    code: `"use client";
import { useState } from "react";
import { FuseButton } from "@/components/ui/fuse-button";

export function Demo() {
  const [active, setActive] = useState(false);

  return (
    <FuseButton
      size="icon"
      variant="destructive"
      shape="circle"
      active={active}
      onActivate={() => setActive(true)}
      onFire={() => setActive(false)}
      onUndo={() => setActive(false)}
      aria-label="Delete"
    >
      <TrashIcon />
    </FuseButton>
  );
}`,
  },
];

const inPracticeSource = `"use client";
import { useState } from "react";
import { FuseButton } from "@/components/ui/fuse-button";

export function FileRow({ name }: { name: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{name}</span>
      <FuseButton
        size="sm"
        variant="destructive"
        active={active}
        onActivate={() => setActive(true)}
        onFire={() => {
          setActive(false);
          deleteFile(name);
        }}
        onUndo={() => setActive(false)}
        duration={4000}
      >
        Delete
      </FuseButton>
    </div>
  );
}
`;

const inPractice: ComponentInPractice = {
  description:
    "A file row with a destructive delete action. The 4-second fuse gives users a moment to reconsider without a separate confirmation dialog.",
  preview: <InPracticeDemo />,
  code: inPracticeSource,
};

export default async function FuseButtonPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/fuse-button/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Fuse Button"
      description="A button with a burning fuse that gives users a countdown to undo a destructive action."
      overview={
        <>
          <p>
            FuseButton wraps Button with a fuse mechanic: pressing the idle
            button lights the fuse, which burns as a glowing border from the top
            middle clockwise. A second press while it burns cancels the action.
            When the fuse reaches zero, <code>onFire</code> is called.
          </p>
          <p>
            State is fully controlled by the parent. The parent decides whether
            to light the fuse in <code>onActivate</code> (e.g., after
            validation), and it resets <code>active</code> to false in both{" "}
            <code>onFire</code> and <code>onUndo</code>.
          </p>
        </>
      }
      install="vinyaas add fuse-button"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/fuse-button/index.tsx</code>. It imports{" "}
          <code>Button</code> from <code>@/components/ui/button</code> and{" "}
          <code>cn</code> from <code>@/lib/utils</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      previewSection={<FuseButtonInteractiveSection />}
      api={api}
      accessibility={
        <>
          <p>
            FuseButton is a native <code>&lt;button&gt;</code> in both states.
            Keyboard users can activate it with Enter or Space. It stays
            focusable and clickable while the fuse burns.
          </p>
          <ul className="list-disc pl-5">
            <li>
              For icon-only buttons, pass <code>aria-label</code>. While the
              fuse burns, the label switches to <code>undoLabel</code> so screen
              readers announce the undo affordance.
            </li>
            <li>
              The SVG fuse graphic is <code>aria-hidden</code> — the
              button&apos;s text label or countdown communicates state.
            </li>
            <li>
              The button uses <code>tabular-nums</code> while active so the
              layout stays stable as the number changes.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <DefaultDemo />
    </ComponentReference>
  );
}
