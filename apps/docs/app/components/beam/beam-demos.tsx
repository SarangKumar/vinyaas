"use client";

import { useRef } from "react";
import { Beam, BeamNode } from "@/registry/new-york/ui/beam";

export function BeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center gap-20 py-8"
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

export function PipelineDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ingestRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const deliverRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-between gap-8 px-8 py-10"
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
