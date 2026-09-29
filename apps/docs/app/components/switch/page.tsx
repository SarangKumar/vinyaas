import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Label } from "@/registry/new-york/ui/label";
import { Switch } from "@/registry/new-york/ui/switch";
import { ControlledSwitch } from "./controlled-switch";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("switch");

const usage = `import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Alerts() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="alerts" />
      <Label htmlFor="alerts">Alerts</Label>
    </div>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "checked",
    type: "boolean",
    description: "Controlled on state. Omit it for an uncontrolled switch.",
  },
  {
    prop: "defaultChecked",
    type: "boolean",
    defaultValue: "false",
    description: "Initial on state for an uncontrolled switch.",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
    description: "Called with the next state after a click.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Native disabled button. It cannot be toggled.",
  },
  {
    prop: "name",
    type: "string",
    description: "Set on the button. A switch is not submitted with the form.",
  },
  {
    prop: "value",
    type: "string",
    description: "Set on the button. It is not included in form data.",
  },
  {
    prop: "required",
    type: "boolean",
    description:
      "Passed through to the button. It does not constrain the form.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the button with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "An uncontrolled switch starts off.",
    preview: <Switch aria-label="Alerts" />,
    code: `<Switch aria-label="Alerts" />`,
  },
  {
    id: "controlled",
    title: "Controlled",
    description: "checked and onCheckedChange keep the state in the parent.",
    preview: <ControlledSwitch />,
    code: `const [checked, setChecked] = useState(true);

<Switch checked={checked} onCheckedChange={setChecked} />`,
  },
  {
    id: "disabled",
    title: "Disabled",
    description:
      "A disabled switch keeps its current state and ignores clicks.",
    preview: <Switch aria-label="Alerts" disabled defaultChecked />,
    code: `<Switch aria-label="Alerts" disabled defaultChecked />`,
  },
  {
    id: "label",
    title: "Label",
    description:
      "htmlFor matches the switch id. Clicking the label toggles it.",
    preview: (
      <div className="flex items-center gap-3">
        <Switch id="labeled-alerts" />
        <Label htmlFor="labeled-alerts">Alerts</Label>
      </div>
    ),
    code: `<div className="flex items-center gap-3">
  <Switch id="alerts" />
  <Label htmlFor="alerts">Alerts</Label>
</div>`,
  },
  {
    id: "form",
    title: "Form",
    description:
      "The switch is a button, so name and value are not included in the submitted form data. Use Checkbox when the value must be submitted.",
    preview: (
      <form className="flex items-center gap-3">
        <Switch id="form-alerts" name="alerts" value="on" />
        <Label htmlFor="form-alerts">Alerts</Label>
      </form>
    ),
    code: `<form>
  <Switch id="alerts" name="alerts" value="on" />
  <Label htmlFor="alerts">Alerts</Label>
</form>`,
  },
];

export default async function SwitchPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/switch/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Switch"
      description="A switch for a binary setting."
      overview={
        <>
          <p>
            Switch renders a native button with{" "}
            <code>role=&quot;switch&quot;</code>. Click, Space, and Enter toggle
            it. That is the button&apos;s own keyboard behavior.
          </p>
          <p>
            It does not participate in native form submission. <code>name</code>{" "}
            and <code>value</code> are present on the button, and a{" "}
            <code>type=&quot;button&quot;</code> is not a successful form
            control. Use Checkbox when the choice should be submitted.
          </p>
        </>
      }
      install="vinyaas add switch"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/switch/index.tsx</code>. It imports{" "}
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
            The control is a button with <code>role=&quot;switch&quot;</code>{" "}
            and <code>aria-checked</code>. It does not add{" "}
            <code>aria-disabled</code>.
          </p>
          <ul className="list-disc pl-5">
            <li>Name it with a label and matching id, or with aria-label.</li>
            <li>Space and Enter toggle it when it has focus.</li>
            <li>disabled blocks activation. The control stays in the tree.</li>
            <li>Focus uses a visible focus-visible ring.</li>
          </ul>
        </>
      }
      source={source}
    >
      <div className="flex items-center gap-3">
        <Switch id="preview-alerts" />
        <Label htmlFor="preview-alerts">Alerts</Label>
      </div>
    </ComponentReference>
  );
}
