"use client";

import React, { useId, useLayoutEffect, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";

import "./beam.css";

type Point = { x: number; y: number };

export type BeamTrack = "dotted" | "dashed" | "solid";
/**
 * `arc`: bent only by `curvature` (straight when it is 0). `curve`: always curved — an S-curve
 * that leaves and enters along the main direction, bowing gently when the nodes line up.
 */
export type BeamShape = "arc" | "curve";
/** `ray`: a glowing streak. `dot`: a single glowing dot. */
export type BeamPulse = "ray" | "dot";

export type BeamProps = Omit<React.ComponentProps<"svg">, "ref"> & {
  /** Positioned element the beam is drawn in. Both ends must be inside it. */
  containerRef: RefObject<HTMLElement | null>;
  /** Element the beam starts at. */
  fromRef: RefObject<HTMLElement | null>;
  /** Element the beam ends at. */
  toRef: RefObject<HTMLElement | null>;
  /**
   * Bend in px, perpendicular to the line from start to end. Positive bends to the left of
   * the direction of travel. A pair of beams A→B and B→A with the same curvature draws a loop.
   */
  curvature?: number;
  /** Run the pulse from `to` back to `from`. */
  reverse?: boolean;
  /** Seconds for one pulse to cross the path. Defaults to 3. */
  duration?: number;
  /** Seconds before the first pulse. Use it to stagger beams along a flow. */
  delay?: number;
  /** Ray length as a share of the path, 0–1 (`pulse="ray"` only). Defaults to 0.2. */
  pulseLength?: number;
  /** Track (static path) and arrowhead color. Any CSS color, including `var(--…)`. */
  pathColor?: string;
  /** Pulse color. Any CSS color. Defaults to the primary color. */
  pulseColor?: string;
  /** Track stroke width in px. Defaults to 1. */
  width?: number;
  /** Track style. Defaults to dotted. */
  track?: BeamTrack;
  /** Arrowhead at the end of the track. Off unless set. */
  arrow?: boolean;
  /** Gap in px between each node's edge and the beam end. Defaults to 6. */
  gap?: number;
  /** Path shape. Defaults to `arc`. */
  shape?: BeamShape;
  /** What travels along the path. Defaults to `ray`. */
  pulse?: BeamPulse;
};

const CURVE_REACH = 0.3;
const CURVE_ALIGNED = 0.25;
const CURVE_BOW = 0.07;

const TRACK_DASH: Record<BeamTrack, string | undefined> = {
  dotted: "0 4",
  dashed: "5 5",
  solid: undefined,
};

function circleIn(el: HTMLElement, box: DOMRect): Point & { r: number } {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left - box.left + rect.width / 2,
    y: rect.top - box.top + rect.height / 2,
    r: Math.min(rect.width, rect.height) / 2,
  };
}

function toward(from: Point, to: Point, distance: number): Point {
  const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  return {
    x: from.x + ((to.x - from.x) / len) * distance,
    y: from.y + ((to.y - from.y) / len) * distance,
  };
}

type Geometry = { d: string; length: number; w: number; h: number };

function cubicAt(p0: Point, c1: Point, c2: Point, p1: Point, t: number): Point {
  const u = 1 - t;
  return {
    x:
      u * u * u * p0.x +
      3 * u * u * t * c1.x +
      3 * u * t * t * c2.x +
      t * t * t * p1.x,
    y:
      u * u * u * p0.y +
      3 * u * u * t * c1.y +
      3 * u * t * t * c2.y +
      t * t * t * p1.y,
  };
}

function beamPath(
  a: Point & { r: number },
  b: Point & { r: number },
  curvature: number,
  gap: number,
  shape: BeamShape,
): { d: string; length: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = dy / len;
  const ny = -dx / len;

  let c1: Point;
  let c2: Point;

  if (shape === "curve") {
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    c1 = horizontal
      ? { x: a.x + dx * CURVE_REACH, y: a.y }
      : { x: a.x, y: a.y + dy * CURVE_REACH };
    c2 = horizontal
      ? { x: b.x - dx * CURVE_REACH, y: b.y }
      : { x: b.x, y: b.y - dy * CURVE_REACH };
    const minor = horizontal ? Math.abs(dy) : Math.abs(dx);
    const major = horizontal ? Math.abs(dx) : Math.abs(dy);
    const bow =
      (minor < major * CURVE_ALIGNED ? len * CURVE_BOW : 0) + curvature;
    c1 = { x: c1.x + nx * bow, y: c1.y + ny * bow };
    c2 = { x: c2.x + nx * bow, y: c2.y + ny * bow };
  } else {
    const q = {
      x: (a.x + b.x) / 2 + nx * curvature,
      y: (a.y + b.y) / 2 + ny * curvature,
    };
    c1 = { x: a.x + ((q.x - a.x) * 2) / 3, y: a.y + ((q.y - a.y) * 2) / 3 };
    c2 = { x: b.x + ((q.x - b.x) * 2) / 3, y: b.y + ((q.y - b.y) * 2) / 3 };
  }

  const start = toward(a, c1, a.r + gap);
  const end = toward(b, c2, b.r + gap);
  const steps = Math.max(16, Math.ceil(len / 4));
  let length = 0;
  let prev = start;

  for (let i = 1; i <= steps; i++) {
    const p = cubicAt(start, c1, c2, end, i / steps);
    length += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }

  return {
    d: `M ${start.x},${start.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`,
    length,
  };
}

/**
 * An animated connector between two elements: a dotted track with a glowing pulse that
 * travels along it. Place inside a `position: relative` container next to the nodes, and
 * pass refs to the container and both nodes. Decorative only (`aria-hidden`); the nodes
 * should carry the meaning.
 */
export function Beam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  pulseLength = 0.2,
  pathColor = "color-mix(in oklch, var(--foreground) 22%, transparent)",
  pulseColor = "var(--primary)",
  width = 1,
  track = "dotted",
  arrow = false,
  gap = 6,
  shape = "arc",
  pulse = "ray",
  className,
  style,
  ...props
}: BeamProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const glowId = `beam-glow-${uid}`;
  const arrowId = `beam-arrow-${uid}`;
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return setGeometry(null);
      const box = container.getBoundingClientRect();
      const path = beamPath(
        circleIn(from, box),
        circleIn(to, box),
        curvature,
        gap,
        shape,
      );
      setGeometry({ ...path, w: box.width, h: box.height });
    };

    const ro = new ResizeObserver(measure);
    const observe = () => {
      for (const el of [containerRef.current, fromRef.current, toRef.current]) {
        if (el) ro.observe(el);
      }
      measure();
    };

    observe();
    const raf = requestAnimationFrame(observe);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [containerRef, fromRef, toRef, curvature, gap, shape]);

  if (!geometry) return null;

  const L = geometry.length;
  const span = pulse === "dot" ? 0 : pulseLength * L;
  const dashArray = `${span} ${L * 2}`;
  const pulseWidth = pulse === "dot" ? width + 3 : width + 0.5;

  return (
    <svg
      aria-hidden
      data-slot="beam"
      width={geometry.w}
      height={geometry.h}
      viewBox={`0 0 ${geometry.w} ${geometry.h}`}
      fill="none"
      className={cn(
        "pointer-events-none absolute top-0 left-0 overflow-visible",
        className,
      )}
      style={style}
      {...props}
    >
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        {arrow ? (
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path d="M 1 1 L 9 5 L 1 9 z" style={{ fill: pathColor }} />
          </marker>
        ) : null}
      </defs>
      <path
        d={geometry.d}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={TRACK_DASH[track]}
        markerEnd={arrow ? `url(#${arrowId})` : undefined}
        style={{ stroke: pathColor }}
      />
      {[true, false].map((glow) => (
        <path
          key={glow ? "glow" : "pulse"}
          d={geometry.d}
          strokeWidth={glow ? pulseWidth * 2.2 : pulseWidth}
          strokeLinecap="round"
          filter={glow ? `url(#${glowId})` : undefined}
          opacity={glow ? (pulse === "dot" ? 0.6 : 0.7) : 1}
          data-reverse={reverse ? "" : undefined}
          data-pulse={pulse}
          className="vinyaas-beam-pulse"
          style={
            {
              stroke: pulseColor,
              strokeDasharray: dashArray,
              "--beam-from": `${span + 1}px`,
              "--beam-to": `${-L - 1}px`,
              "--beam-duration": `${duration}s`,
              "--beam-delay": `${delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}

export type BeamNodeSize = "sm" | "default" | "lg";

const nodeSizes: Record<BeamNodeSize, string> = {
  sm: "size-9 [&_svg]:size-4",
  default: "size-11 [&_svg]:size-5",
  lg: "size-14 [&_svg]:size-6",
};

export type BeamNodeProps = React.ComponentProps<"div"> & {
  size?: BeamNodeSize;
  /** Brand-tinted node (primary ring and icon) for the step to look at first. */
  highlight?: boolean;
};

/**
 * A round icon node for beam diagrams. Opaque, so it sits cleanly over beam ends.
 * Pass the ref to the matching `Beam` as `fromRef` / `toRef`.
 */
export function BeamNode({
  size = "default",
  highlight = false,
  className,
  children,
  ...props
}: BeamNodeProps) {
  return (
    <div
      data-slot="beam-node"
      data-highlight={highlight || undefined}
      className={cn(
        "bg-card text-foreground border-border relative z-10 flex shrink-0 items-center justify-center rounded-full border shadow-sm transition-[color,border-color,box-shadow] duration-200",
        highlight &&
          "border-primary/50 text-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_12%,transparent),0_0_18px_color-mix(in_oklch,var(--primary)_40%,transparent)]",
        nodeSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
