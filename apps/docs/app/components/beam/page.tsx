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
import { BeamDemo, PipelineDemo } from "./beam-demos";

export const metadata: Metadata = componentPageMetadata("beam");

const usage = `import { Beam, BeamNode } from "@/components/ui/beam";
import { useRef } from "react";

export function FlowDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex items-center gap-16 p-8">
      <BeamNode ref={fromRef}>A</BeamNode>
      <BeamNode ref={toRef} highlight>B</BeamNode>
      <Beam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
    </div>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "containerRef",
    type: "RefObject<HTMLElement | null>",
    description:
      "Positioned element the beam is drawn in. Both ends must be inside it.",
  },
  {
    prop: "fromRef",
    type: "RefObject<HTMLElement | null>",
    description: "Element the beam starts at.",
  },
  {
    prop: "toRef",
    type: "RefObject<HTMLElement | null>",
    description: "Element the beam ends at.",
  },
  {
    prop: "curvature",
    type: "number",
    defaultValue: "0",
    description:
      "Bend in px, perpendicular to the line from start to end. Positive bends left of the direction of travel.",
  },
  {
    prop: "reverse",
    type: "boolean",
    defaultValue: "false",
    description: "Run the pulse from `to` back to `from`.",
  },
  {
    prop: "duration",
    type: "number",
    defaultValue: "3",
    description: "Seconds for one pulse to cross the path.",
  },
  {
    prop: "delay",
    type: "number",
    defaultValue: "0",
    description:
      "Seconds before the first pulse. Use to stagger beams along a flow.",
  },
  {
    prop: "pulseLength",
    type: "number",
    defaultValue: "0.2",
    description: 'Ray length as a share of the path, 0–1 (`pulse="ray"` only).',
  },
  {
    prop: "pathColor",
    type: "string",
    defaultValue: '"color-mix(in oklch, var(--foreground) 22%, transparent)"',
    description: "Track and arrowhead color. Any CSS color.",
  },
  {
    prop: "pulseColor",
    type: "string",
    defaultValue: '"var(--primary)"',
    description: "Pulse color. Any CSS color.",
  },
  {
    prop: "width",
    type: "number",
    defaultValue: "1",
    description: "Track stroke width in px.",
  },
  {
    prop: "track",
    type: '"dotted" | "dashed" | "solid"',
    defaultValue: '"dotted"',
    description: "Track style.",
  },
  {
    prop: "arrow",
    type: "boolean",
    defaultValue: "false",
    description: "Arrowhead at the end of the track.",
  },
  {
    prop: "gap",
    type: "number",
    defaultValue: "6",
    description: "Gap in px between each node's edge and the beam end.",
  },
  {
    prop: "shape",
    type: '"arc" | "curve"',
    defaultValue: '"arc"',
    description:
      "arc: bent by curvature. curve: an S-curve that leaves and enters along the main direction.",
  },
  {
    prop: "pulse",
    type: '"ray" | "dot"',
    defaultValue: '"ray"',
    description: "What travels along the path.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "default",
    title: "Default",
    description:
      "A dotted arc with a glowing ray pulse from source to destination.",
    preview: <BeamDemo />,
    code: `"use client";
import { useRef } from "react";
import { Beam, BeamNode } from "@/components/ui/beam";

export function Demo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex items-center gap-20 p-8">
      <BeamNode ref={fromRef}><SourceIcon /></BeamNode>
      <BeamNode ref={toRef} highlight><DestIcon /></BeamNode>
      <Beam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
    </div>
  );
}`,
  },
];

const inPracticeSource = `"use client";
import { useRef } from "react";
import { Beam, BeamNode } from "@/components/ui/beam";

const steps = [
  { label: "Ingest", icon: <DatabaseIcon /> },
  { label: "Process", icon: <CpuIcon />, highlight: true },
  { label: "Deliver", icon: <SendIcon /> },
];

export function Pipeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  return (
    <div ref={containerRef} className="relative flex items-center justify-between gap-8 p-8">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-col items-center gap-2">
          <BeamNode ref={refs[i]} highlight={step.highlight}>
            {step.icon}
          </BeamNode>
          <span className="text-xs text-muted-foreground">{step.label}</span>
        </div>
      ))}
      {refs.slice(0, -1).map((ref, i) => (
        <Beam
          key={i}
          containerRef={containerRef}
          fromRef={ref}
          toRef={refs[i + 1]!}
          delay={i * 0.8}
        />
      ))}
    </div>
  );
}
`;

const inPractice: ComponentInPractice = {
  description:
    "A three-step data pipeline diagram showing beams staggered between ingestion, processing, and delivery.",
  preview: <PipelineDemo />,
  code: inPracticeSource,
};

export default async function BeamPage() {
  const [indexSource, cssSource] = await Promise.all([
    readFile(
      path.join(process.cwd(), "registry/new-york/ui/beam/index.tsx"),
      "utf8",
    ),
    readFile(
      path.join(process.cwd(), "registry/new-york/ui/beam/beam.css"),
      "utf8",
    ),
  ]);

  const source = `${indexSource}\n\n/* beam.css */\n${cssSource}`;

  return (
    <ComponentReference
      title="Beam"
      description="An animated connector between two elements with a glowing pulse that travels along the path."
      overview={
        <>
          <p>
            Beam draws an SVG path between two DOM elements — both must be
            inside a common positioned container — and animates a glowing streak
            (or dot) along it.
          </p>
          <p>
            The component is <code>aria-hidden</code> and purely decorative; the
            nodes themselves carry the meaning. Use <code>BeamNode</code> for
            the round icon endpoints, or pass any ref&apos;d element as{" "}
            <code>fromRef</code> / <code>toRef</code>.
          </p>
        </>
      }
      install="vinyaas add beam"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/beam/index.tsx</code> and{" "}
          <code>components/ui/beam/beam.css</code>. Both files are required. The
          component imports <code>cn</code> from <code>@/lib/utils</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            Beam is decorative. The SVG carries{" "}
            <code>aria-hidden=&quot;true&quot;</code> and is never announced by
            assistive technology.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Put accessible names and roles on the nodes, not on the beam.
            </li>
            <li>
              The pulse animation is disabled under{" "}
              <code>prefers-reduced-motion</code>.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <BeamDemo />
    </ComponentReference>
  );
}
