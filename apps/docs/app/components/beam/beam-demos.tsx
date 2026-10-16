"use client";

import { useRef } from "react";
import { Beam, BeamNode } from "@/registry/new-york/ui/beam";
import type {
  BeamTrack,
  BeamShape,
  BeamPulse,
} from "@/registry/new-york/ui/beam";
import {
  ComponentDemo,
  type ControlDef,
  type ControlValues,
} from "@/components/component-demo";

/* ── Basic demo ──────────────────────────────────────────────────────────── */

export function BeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center gap-40 py-10"
    >
      <BeamNode ref={fromRef}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
        </svg>
      </BeamNode>
      <BeamNode ref={toRef} highlight>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      </BeamNode>
      <Beam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
    </div>
  );
}

/* ── AI document processing ──────────────────────────────────────────────── */

export function AIFlowDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-between px-12 py-10"
    >
      <div className="flex flex-col items-center gap-2">
        <BeamNode ref={docsRef}>
          {/* Document icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4M8 13h8M8 17h5" />
          </svg>
        </BeamNode>
        <span className="text-muted-foreground text-xs">Documents</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <BeamNode ref={modelRef} highlight size="lg">
          {/* Brain/AI icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375M6.003 5.125A3 3 0 0 0 6.4 6.5" />
          </svg>
        </BeamNode>
        <span className="text-muted-foreground text-xs">AI Model</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <BeamNode ref={resultRef}>
          {/* Chart icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </BeamNode>
        <span className="text-muted-foreground text-xs">Results</span>
      </div>

      <Beam
        containerRef={containerRef}
        fromRef={docsRef}
        toRef={modelRef}
        duration={2.5}
      />
      <Beam
        containerRef={containerRef}
        fromRef={modelRef}
        toRef={resultRef}
        duration={2.5}
        delay={0.6}
        pulseColor="var(--primary)"
      />
    </div>
  );
}

/* ── Bidirectional sync ──────────────────────────────────────────────────── */

export function SyncDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center gap-48 py-10"
    >
      <div className="flex flex-col items-center gap-2">
        <BeamNode ref={leftRef} highlight>
          {/* Database icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
          </svg>
        </BeamNode>
        <span className="text-muted-foreground text-xs">Primary</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <BeamNode ref={rightRef} highlight>
          {/* Cloud icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
        </BeamNode>
        <span className="text-muted-foreground text-xs">Replica</span>
      </div>

      {/* Forward beam */}
      <Beam
        containerRef={containerRef}
        fromRef={leftRef}
        toRef={rightRef}
        curvature={-40}
        duration={2}
        track="dashed"
      />
      {/* Reverse beam */}
      <Beam
        containerRef={containerRef}
        fromRef={leftRef}
        toRef={rightRef}
        curvature={40}
        reverse
        duration={2}
        delay={1}
        track="dashed"
        pulseColor="color-mix(in oklch, var(--primary) 70%, var(--destructive))"
      />
    </div>
  );
}

/* ── Hub and spoke ───────────────────────────────────────────────────────── */

export function HubDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-center gap-8 py-8"
    >
      {/* Top node */}
      <div className="flex flex-col items-center gap-2">
        <BeamNode ref={topRef} size="sm">
          {/* User icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
          </svg>
        </BeamNode>
        <span className="text-muted-foreground text-xs">Client</span>
      </div>

      {/* Hub */}
      <BeamNode ref={hubRef} highlight size="lg">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
      </BeamNode>

      {/* Bottom row */}
      <div className="flex w-full justify-around">
        <div className="flex flex-col items-center gap-2">
          <BeamNode ref={bottomLeftRef} size="sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            </svg>
          </BeamNode>
          <span className="text-muted-foreground text-xs">Auth</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <BeamNode ref={bottomRightRef} size="sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
              <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
            </svg>
          </BeamNode>
          <span className="text-muted-foreground text-xs">Storage</span>
        </div>
      </div>

      <Beam
        containerRef={containerRef}
        fromRef={topRef}
        toRef={hubRef}
        duration={2}
      />
      <Beam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={bottomLeftRef}
        duration={2}
        delay={0.4}
      />
      <Beam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={bottomRightRef}
        duration={2}
        delay={0.8}
      />
    </div>
  );
}

/* ── Interactive single-beam demo (used with controls panel) ─────────────── */

const beamControls: ControlDef[] = [
  {
    key: "curvature",
    label: "Curvature",
    type: "range",
    default: 0,
    min: -120,
    max: 120,
  },
  {
    key: "duration",
    label: "Duration",
    type: "range",
    default: 3,
    min: 0.5,
    max: 10,
    step: 0.5,
    unit: "s",
  },
  {
    key: "pulseLength",
    label: "Pulse Length",
    type: "range",
    default: 0.2,
    min: 0.05,
    max: 0.8,
    step: 0.05,
  },
  {
    key: "width",
    label: "Width",
    type: "range",
    default: 1,
    min: 1,
    max: 6,
    step: 0.5,
  },
  { key: "gap", label: "Gap", type: "range", default: 6, min: 0, max: 24 },
  {
    key: "pulseColor",
    label: "Pulse Color",
    type: "color",
    default: "#8b5cf6",
  },
  {
    key: "track",
    label: "Track",
    type: "select",
    default: "dotted",
    options: [
      { value: "dotted", label: "Dotted" },
      { value: "dashed", label: "Dashed" },
      { value: "solid", label: "Solid" },
    ],
  },
  {
    key: "shape",
    label: "Shape",
    type: "select",
    default: "arc",
    options: [
      { value: "arc", label: "Arc" },
      { value: "curve", label: "Curve" },
    ],
  },
  {
    key: "pulse",
    label: "Pulse",
    type: "select",
    default: "ray",
    options: [
      { value: "ray", label: "Ray" },
      { value: "dot", label: "Dot" },
    ],
  },
  { key: "reverse", label: "Reverse", type: "toggle", default: false },
  { key: "arrow", label: "Arrow", type: "toggle", default: false },
];

function beamCode(v: ControlValues): string {
  const extraProps = [
    v.curvature !== 0 && `  curvature={${v.curvature}}`,
    v.duration !== 3 && `  duration={${v.duration}}`,
    v.pulseLength !== 0.2 && `  pulseLength={${v.pulseLength}}`,
    v.width !== 1 && `  width={${v.width}}`,
    v.gap !== 6 && `  gap={${v.gap}}`,
    v.pulseColor !== "#8b5cf6" && `  pulseColor="${v.pulseColor}"`,
    v.track !== "dotted" && `  track="${v.track}"`,
    v.shape !== "arc" && `  shape="${v.shape}"`,
    v.pulse !== "ray" && `  pulse="${v.pulse}"`,
    v.reverse && `  reverse`,
    v.arrow && `  arrow`,
  ]
    .filter(Boolean)
    .join("\n");

  return `"use client";
import { useRef } from "react";
import { Beam, BeamNode } from "@/components/ui/beam";

export function Demo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center gap-40 py-10">
      <BeamNode ref={fromRef}>{/* source icon */}</BeamNode>
      <BeamNode ref={toRef} highlight>{/* dest icon */}</BeamNode>
      <Beam
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}${extraProps ? "\n" + extraProps : ""}
      />
    </div>
  );
}`;
}

/** Self-contained interactive demo — keeps beamCode/beamControls on the client. */
export function BeamInteractiveSection() {
  return (
    <ComponentDemo
      preview={BeamInteractivePreview}
      code={beamCode}
      controls={beamControls}
    />
  );
}

function BeamInteractivePreview(values: ControlValues) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center gap-40 py-10"
    >
      <BeamNode ref={fromRef}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
        </svg>
      </BeamNode>
      <BeamNode ref={toRef} highlight>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      </BeamNode>
      <Beam
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}
        curvature={values.curvature as number}
        duration={values.duration as number}
        pulseLength={values.pulseLength as number}
        width={values.width as number}
        gap={values.gap as number}
        pulseColor={values.pulseColor as string}
        track={values.track as BeamTrack}
        shape={values.shape as BeamShape}
        pulse={values.pulse as BeamPulse}
        reverse={values.reverse as boolean}
        arrow={values.arrow as boolean}
      />
    </div>
  );
}

/* ── Pipeline (in-practice) ──────────────────────────────────────────────── */

export function PipelineDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ingestRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const deliverRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-between px-12 py-10"
    >
      <div className="flex flex-col items-center gap-2">
        <BeamNode ref={ingestRef}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
          </svg>
        </BeamNode>
        <span className="text-muted-foreground text-xs">Ingest</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BeamNode ref={processRef} highlight>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
          </svg>
        </BeamNode>
        <span className="text-muted-foreground text-xs">Process</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BeamNode ref={deliverRef}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </BeamNode>
        <span className="text-muted-foreground text-xs">Deliver</span>
      </div>
      <Beam
        containerRef={containerRef}
        fromRef={ingestRef}
        toRef={processRef}
      />
      <Beam
        containerRef={containerRef}
        fromRef={processRef}
        toRef={deliverRef}
        delay={0.8}
      />
    </div>
  );
}
