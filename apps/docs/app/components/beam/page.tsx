import { readFile } from "node:fs/promises";
import path from "node:path";
import { api } from "./beam-api";
import type { ComponentInPractice } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";
import { BeamInteractiveSection, PipelineDemo } from "./beam-demos";

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
      previewSection={<BeamInteractiveSection />}
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
    />
  );
}
