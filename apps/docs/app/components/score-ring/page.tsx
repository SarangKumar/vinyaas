import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import { ScoreRing } from "@/registry/new-york/ui/score-ring";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("score-ring");

const usage = `import { ScoreRing } from "@/components/ui/score-ring";

export function Performance() {
  return <ScoreRing value={86} label="Performance score" />;
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "number",
    description: "Score from 0 to max. Values outside the range are clamped.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "100",
    description: "Score that fills the whole ring.",
  },
  {
    prop: "size",
    type: '"xs" | "sm" | "default" | "lg"',
    defaultValue: '"default"',
    description: "Ring diameter: 32px, 48px, 64px, or 96px.",
  },
  {
    prop: "fromColor",
    type: "string",
    defaultValue: '"var(--color-red-500, #ef4444)"',
    description: "Ring color at a score of 0. Any CSS color.",
  },
  {
    prop: "toColor",
    type: "string",
    defaultValue: '"var(--color-green-500, #22c55e)"',
    description: "Ring color at the maximum score. Any CSS color.",
  },
  {
    prop: "showValue",
    type: "boolean",
    defaultValue: "true",
    description: "Show the rounded score in the middle of the ring.",
  },
  {
    prop: "children",
    type: "ReactNode",
    description: "Replaces the score text in the middle of the ring.",
  },
  {
    prop: "label",
    type: "string",
    description: "Accessible name for the meter, such as Performance score.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "default",
    title: "Default",
    description:
      "The ring color blends from red at 0 to green at 100, so low scores read as warnings.",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-6">
        {[12, 48, 74, 96].map((value) => (
          <ScoreRing key={value} value={value} label={`Score ${value}`} />
        ))}
      </div>
    ),
    code: `<ScoreRing value={12} label="Score 12" />
<ScoreRing value={48} label="Score 48" />
<ScoreRing value={74} label="Score 74" />
<ScoreRing value={96} label="Score 96" />`,
  },
  {
    id: "sizes",
    title: "Sizes",
    description:
      "xs, sm, default, and lg scale the ring, stroke, and score text together.",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-6">
        <ScoreRing size="xs" value={82} label="Extra small" />
        <ScoreRing size="sm" value={82} label="Small" />
        <ScoreRing value={82} label="Default" />
        <ScoreRing size="lg" value={82} label="Large" />
      </div>
    ),
    code: `<ScoreRing size="xs" value={82} label="Extra small" />
<ScoreRing size="sm" value={82} label="Small" />
<ScoreRing value={82} label="Default" />
<ScoreRing size="lg" value={82} label="Large" />`,
  },
  {
    id: "colors",
    title: "Custom colors",
    description:
      "fromColor is the color at 0 and toColor is the color at max. Use any CSS color, including theme variables.",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-6">
        <ScoreRing
          value={35}
          fromColor="var(--color-amber-500, #f59e0b)"
          toColor="var(--color-sky-500, #0ea5e9)"
          label="Amber to sky"
        />
        <ScoreRing
          value={80}
          fromColor="var(--color-amber-500, #f59e0b)"
          toColor="var(--color-sky-500, #0ea5e9)"
          label="Amber to sky"
        />
        <ScoreRing
          value={65}
          fromColor="var(--muted-foreground)"
          toColor="var(--primary)"
          label="Theme colors"
        />
      </div>
    ),
    code: `<ScoreRing
  value={35}
  fromColor="var(--color-amber-500)"
  toColor="var(--color-sky-500)"
  label="Amber to sky"
/>
<ScoreRing
  value={65}
  fromColor="var(--muted-foreground)"
  toColor="var(--primary)"
  label="Theme colors"
/>`,
  },
  {
    id: "custom-content",
    title: "Custom content and range",
    description:
      "max changes the full-ring score. children replaces the number, and showValue={false} hides it.",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-6">
        <ScoreRing size="lg" value={4.2} max={5} label="Rating 4.2 of 5">
          4.2
        </ScoreRing>
        <ScoreRing size="lg" value={68} showValue={false} label="Progress" />
      </div>
    ),
    code: `<ScoreRing size="lg" value={4.2} max={5} label="Rating 4.2 of 5">
  4.2
</ScoreRing>
<ScoreRing size="lg" value={68} showValue={false} label="Progress" />`,
  },
];

const inPracticeSource = `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";

const audits = [
  ["Performance", 92],
  ["Accessibility", 78],
  ["Best practices", 54],
  ["SEO", 31],
] as const;

export function AuditSummary() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Site audit</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-4">
        {audits.map(([name, score]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <ScoreRing value={score} label={name + " score"} />
            <p className="text-muted-foreground text-xs">{name}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
`;

const audits = [
  ["Performance", 92],
  ["Accessibility", 78],
  ["Best practices", 54],
  ["SEO", 31],
] as const;

const inPractice: ComponentInPractice = {
  description:
    "An audit card shows four category scores. The ring color alone separates healthy scores from failing ones.",
  preview: (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Site audit</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {audits.map(([name, score]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <ScoreRing value={score} label={`${name} score`} />
            <p className="text-muted-foreground text-center text-xs">{name}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  ),
  code: inPracticeSource,
};

export default async function ScoreRingPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/score-ring/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Score Ring"
      description="A circular score meter whose color blends from a start to an end color."
      overview={
        <>
          <p>
            ScoreRing draws a progress ring for a score and shows the number in
            the middle. The stroke color is mixed between <code>fromColor</code>{" "}
            and <code>toColor</code> by the score, so 0 is red and 100 is green
            unless you pass other colors.
          </p>
          <p>
            It is a <code>role=&quot;meter&quot;</code>. Use Progress for task
            completion and ScoreRing for a quality or rating score.
          </p>
        </>
      }
      install="vinyaas add score-ring"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/score-ring/index.tsx</code>. It imports{" "}
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
            The ring is a <code>role=&quot;meter&quot;</code> with{" "}
            <code>aria-valuenow</code>, <code>aria-valuemin</code>, and{" "}
            <code>aria-valuemax</code>. The SVG is hidden from assistive
            technology.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Pass <code>label</code> so the meter has an accessible name.
            </li>
            <li>
              Do not rely on color alone; keep the number visible or put the
              score in nearby text.
            </li>
            <li>The fill animation is disabled for reduced motion.</li>
          </ul>
        </>
      }
      source={source}
    >
      <div className="flex items-center gap-6">
        <ScoreRing size="sm" value={28} label="Low score" />
        <ScoreRing value={64} label="Medium score" />
        <ScoreRing size="lg" value={93} label="High score" />
      </div>
    </ComponentReference>
  );
}
