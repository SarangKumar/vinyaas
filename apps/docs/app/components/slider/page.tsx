import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Label } from "@/registry/new-york/ui/label/label";
import { RangeSlider, Slider } from "@/registry/new-york/ui/slider/slider";

const usage = `import { Slider } from "@/components/ui/slider/slider";

export function Volume() {
  return <Slider aria-label="Volume" defaultValue={40} />;
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "number",
    description: "Controlled value. Omit it to use defaultValue.",
  },
  {
    prop: "defaultValue",
    type: "number",
    description: "Initial value for an uncontrolled slider.",
  },
  {
    prop: "min",
    type: "number",
    defaultValue: "0",
    description: "Lowest value.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "100",
    description: "Highest value.",
  },
  {
    prop: "step",
    type: "number",
    defaultValue: "1",
    description: "Step between values.",
  },
  {
    prop: "onValueChange",
    type: "(value: number) => void",
    description: "Called with the numeric value when the slider moves.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the range input with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "volume",
    title: "Volume",
    description:
      "A labelled range for a setting with a known minimum and maximum.",
    preview: (
      <div className="grid w-full max-w-sm gap-2 text-left">
        <Label htmlFor="volume">Volume</Label>
        <Slider id="volume" defaultValue={40} />
      </div>
    ),
    code: `import { Label } from "@/components/ui/label/label";
import { Slider } from "@/components/ui/slider/slider";

export function Volume() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="volume">Volume</Label>
      <Slider id="volume" defaultValue={40} />
    </div>
  );
}
`,
  },
  {
    id: "zoom",
    title: "Bounded step",
    description: "min, max, and step stay on the native range input.",
    preview: (
      <div className="grid w-full max-w-sm gap-2 text-left">
        <Label htmlFor="zoom">Zoom</Label>
        <Slider id="zoom" min={1} max={4} step={1} defaultValue={2} />
      </div>
    ),
    code: `import { Label } from "@/components/ui/label/label";
import { Slider } from "@/components/ui/slider/slider";

export function Zoom() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="zoom">Zoom</Label>
      <Slider id="zoom" min={1} max={4} step={1} defaultValue={2} />
    </div>
  );
}
`,
  },
  {
    id: "range",
    title: "Range",
    description:
      "Two native range inputs share one track. The selected interval uses the foreground token. The rest of the track stays muted.",
    preview: (
      <div className="grid w-full max-w-sm gap-2 text-left">
        <Label id="price-label">Price</Label>
        <RangeSlider aria-labelledby="price-label" defaultValue={[20, 80]} />
      </div>
    ),
    code: `import { Label } from "@/components/ui/label/label";
import { RangeSlider } from "@/components/ui/slider/slider";

export function PriceRange() {
  return (
    <div className="grid gap-2">
      <Label id="price-label">Price</Label>
      <RangeSlider aria-labelledby="price-label" defaultValue={[20, 80]} />
    </div>
  );
}
`,
  },
];

export default async function SliderPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/slider/slider.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Slider"
      description="A native range input for a value between two bounds."
      overview={
        <p>
          Slider is an <code>input</code> with{" "}
          <code>type=&quot;range&quot;</code>. The browser supplies the keyboard
          and the value. Name it with <code>aria-label</code> or a{" "}
          <code>Label</code>.
        </p>
      }
      install="vinyaas add slider"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/slider/slider.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <p>
          The control is a native slider. Keyboard users change it with the
          arrow keys. Give it a name through a label or <code>aria-label</code>.
        </p>
      }
      source={source}
    >
      <div className="grid w-full max-w-sm gap-2 text-left">
        <Label htmlFor="preview-volume">Volume</Label>
        <Slider id="preview-volume" defaultValue={40} />
      </div>
    </ComponentReference>
  );
}
