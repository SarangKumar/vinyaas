import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import { Progress } from "@/registry/new-york/ui/progress";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("progress");

const usage = `import { Progress } from "@/components/ui/progress";

export function UploadProgress() {
  return <Progress aria-label="Upload" value={40} max={100} />;
}
`;

const uploadPanelCode = `import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export function UploadPanel() {
  return (
    <div className="grid w-full max-w-md gap-3 text-left">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor="upload-progress">Uploading report.pdf</Label>
        <span className="text-muted-foreground text-sm tabular-nums">40%</span>
      </div>
      <Progress
        id="upload-progress"
        aria-label="Uploading report.pdf"
        value={40}
        max={100}
      />
      <p className="text-muted-foreground text-sm">
        2 of 5 MB uploaded. Keep this tab open until the transfer finishes.
      </p>
      <Button type="button" variant="outline" className="w-fit">
        Cancel upload
      </Button>
    </div>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "number",
    description: "Current amount. Omit it for the native indeterminate state.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "1",
    description: "Maximum amount. The browser default is 1.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the progress element with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "determinate",
    title: "Determinate",
    description: "value and max describe how much of the work is complete.",
    preview: (
      <Progress
        aria-label="Upload"
        value={40}
        max={100}
        className="w-full max-w-sm"
      />
    ),
    code: `<Progress aria-label="Upload" value={40} max={100} />`,
  },
  {
    id: "custom-max",
    title: "Custom max",
    description: "max can match a count, such as 3 of 8 files.",
    preview: (
      <Progress
        aria-label="Files copied"
        value={3}
        max={8}
        className="w-full max-w-sm"
      />
    ),
    code: `<Progress aria-label="Files copied" value={3} max={8} />`,
  },
  {
    id: "indeterminate",
    title: "Indeterminate",
    description:
      "Omit value when the duration is unknown. The element stays a native progress indicator without a fill.",
    preview: (
      <Progress aria-label="Checking for updates" className="w-full max-w-sm" />
    ),
    code: `<Progress aria-label="Checking for updates" />`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "An upload panel shows the file name, percent complete, status copy, and a Cancel action beside Progress.",
  preview: (
    <div className="grid w-full max-w-md gap-3 text-left">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor="practice-upload-progress">Uploading report.pdf</Label>
        <span className="text-muted-foreground text-sm tabular-nums">40%</span>
      </div>
      <Progress
        id="practice-upload-progress"
        aria-label="Uploading report.pdf"
        value={40}
        max={100}
      />
      <p className="text-muted-foreground text-sm">
        2 of 5 MB uploaded. Keep this tab open until the transfer finishes.
      </p>
      <Button type="button" variant="outline" className="w-fit">
        Cancel upload
      </Button>
    </div>
  ),
  code: uploadPanelCode,
};

export default async function ProgressPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/progress/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Progress"
      description="A native progress indicator for a known amount of work."
      overview={
        <>
          <p>
            Progress renders a native <code>progress</code> element. Pass{" "}
            <code>value</code> and <code>max</code> when the amount is known.
            Omit <code>value</code> when it is not.
          </p>
          <p>
            The track and fill use semantic colors. The element keeps the
            browser progress semantics, including the current value, instead of
            a generic bar.
          </p>
        </>
      }
      install="vinyaas add progress"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/progress/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The element is a native progress bar. Assistive technology reads its
            value and maximum. It does not add a separate ARIA role.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Name it with <code>aria-label</code> or a label, because the bar
              has no visible text.
            </li>
            <li>
              A missing <code>value</code> is the indeterminate state. A value
              of 0 is empty progress, not indeterminate.
            </li>
            <li>
              The browser default <code>max</code> is 1. Set it when the scale
              is different.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <Progress
        aria-label="Upload"
        value={40}
        max={100}
        className="w-full max-w-sm"
      />
    </ComponentReference>
  );
}
