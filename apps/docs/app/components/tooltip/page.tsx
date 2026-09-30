import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  BasicTooltip,
  KeyboardTooltip,
  PositionTooltips,
  ToolbarTooltips,
} from "./tooltip-demos";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("tooltip");

const usage = `import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

export function Hint() {
  return (
    <Tooltip content="Saved locally">
      <Button type="button">Hint</Button>
    </Tooltip>
  );
}
`;

const toolbarCode = `import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

export function FormattingToolbar() {
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="border-border bg-background flex flex-wrap items-center gap-1 rounded-lg border p-1"
    >
      <Tooltip content="Undo">
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Undo">
          Undo
        </Button>
      </Tooltip>
      <Tooltip content="Bold">
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Bold">
          Bold
        </Button>
      </Tooltip>
      <Tooltip content="Italic">
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Italic">
          Italic
        </Button>
      </Tooltip>
      <Tooltip content="Insert link">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Insert link"
        >
          Link
        </Button>
      </Tooltip>
    </div>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "content",
    type: "ReactNode",
    description: "Short, non-interactive text shown beside the trigger.",
  },
  {
    prop: "side",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"top"',
    description: "Preferred side. It flips when that side does not fit.",
  },
  {
    prop: "delayDuration",
    type: "number",
    defaultValue: "400",
    description:
      "Hover delay in milliseconds. Focus shows the tooltip immediately.",
  },
  {
    prop: "children",
    type: "ReactElement",
    description:
      "The trigger. It receives aria-describedby while the tooltip is open.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Hover the button or move focus to it.",
    preview: <BasicTooltip />,
    code: `<Tooltip content="Saved locally">
  <Button type="button">Hint</Button>
</Tooltip>`,
  },
  {
    id: "keyboard",
    title: "Keyboard",
    description:
      "Focus opens the tooltip. Escape closes it. Focus stays on the trigger.",
    preview: <KeyboardTooltip />,
    code: `<Tooltip content="Saved locally">
  <Button type="button">Focus me</Button>
</Tooltip>`,
  },
  {
    id: "position",
    title: "Position",
    description:
      "side places the tooltip and its pointer above, below, or beside the trigger.",
    preview: <PositionTooltips />,
    code: `import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

export function Placements() {
  return (
    <>
      <Tooltip content="Above the trigger" side="top">
        <Button type="button" variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Below the trigger" side="bottom">
        <Button type="button" variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left of the trigger" side="left">
        <Button type="button" variant="outline">Left</Button>
      </Tooltip>
      <Tooltip content="Right of the trigger" side="right">
        <Button type="button" variant="outline">Right</Button>
      </Tooltip>
    </>
  );
}
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Icon-only toolbar controls keep visible labels in Tooltips. Each button still has an accessible name.",
  preview: <ToolbarTooltips />,
  code: { tsx: toolbarCode, jsx: toolbarCode },
};

export default async function TooltipPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/tooltip/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Tooltip"
      description="A short label for a control."
      overview={
        <>
          <p>
            Tooltip shows concise text on hover and on keyboard focus. A pointer
            connects the panel to its trigger. It is portaled to the document
            body so the article does not clip it.
          </p>
          <p>
            The content is not interactive. Do not put buttons, links, or inputs
            inside it. Use Popover when the floating content needs controls.
          </p>
        </>
      }
      install="vinyaas add tooltip"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/tooltip/index.tsx</code> and copy{" "}
          <code>tooltip.css</code> beside it. It imports <code>cn</code> from{" "}
          <code>@/lib/utils</code>. The project also needs <code>clsx</code> and{" "}
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
            The open tooltip has <code>role=&quot;tooltip&quot;</code> and the
            trigger points to it with <code>aria-describedby</code>. The tooltip
            is not in the tab order and does not take focus.
          </p>
          <ul className="list-disc pl-5">
            <li>Focus shows it immediately. Hover waits for delayDuration.</li>
            <li>Escape hides it while the trigger is focused.</li>
            <li>
              A disabled control cannot be focused, so the keyboard path is
              unavailable.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <BasicTooltip />
    </ComponentReference>
  );
}
