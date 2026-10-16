"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button, type ButtonProps } from "../button";
import { cn } from "@/lib/utils";

export type FuseButtonProps = Omit<ButtonProps, "onClick"> & {
  /**
   * Whether the fuse is lit. Controlled by the parent: the parent validates in `onActivate`
   * and sets this to true; the fuse then burns down, calling `onFire` when it reaches zero.
   */
  active: boolean;
  /** Pressed while idle. The parent decides whether to light the fuse. */
  onActivate: () => void;
  /** The fuse burned out without an undo. The parent should set `active` back to false. */
  onFire: () => void;
  /** Pressed while lit. The parent should set `active` back to false without firing. */
  onUndo: () => void;
  /** Length of the fuse in ms. */
  duration?: number;
  /**
   * Label shown while lit, followed by the seconds left. Icon sizes (`icon`, `icon-sm`,
   * `icon-lg`) have no room for words, so they show only the seconds and this becomes the
   * accessible name.
   */
  undoLabel?: string;
  /**
   * `rect` (default) traces the button's own corner radius. `circle` makes the button round
   * and burns along a true circle; use it for round icon buttons.
   */
  shape?: "rect" | "circle";
};

const FUSE_WIDTH = 2;

function fuseColor(variant: FuseButtonProps["variant"]): string {
  return variant === "destructive" ? "var(--destructive)" : "var(--primary)";
}

const FALLBACK_RADIUS = 6;

function fuseOutline(
  width: number,
  height: number,
  radius: number,
  inset: number,
): string {
  const x0 = inset;
  const y0 = inset;
  const x1 = width - inset;
  const y1 = height - inset;
  const r = radius;
  const cx = width / 2;
  return [
    `M${cx} ${y0}`,
    `H${x1 - r}`,
    `A${r} ${r} 0 0 1 ${x1} ${y0 + r}`,
    `V${y1 - r}`,
    `A${r} ${r} 0 0 1 ${x1 - r} ${y1}`,
    `H${x0 + r}`,
    `A${r} ${r} 0 0 1 ${x0} ${y1 - r}`,
    `V${y0 + r}`,
    `A${r} ${r} 0 0 1 ${x0 + r} ${y0}`,
    `H${cx}`,
  ].join(" ");
}

function fuseCircle(width: number, height: number, inset: number): string {
  const r = Math.min(width, height) / 2 - inset;
  const cx = width / 2;
  const cy = height / 2;
  return `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r}`;
}

function centreRadius(
  button: Element,
  width: number,
  height: number,
  inset: number,
): number {
  const declared = parseFloat(getComputedStyle(button).borderTopLeftRadius);
  const outer = Number.isFinite(declared) ? declared : FALLBACK_RADIUS;
  return Math.max(
    0,
    Math.min(outer - inset, width / 2 - inset, height / 2 - inset),
  );
}

/**
 * An action button whose lit state is an undo on a burning fuse. The fire starts at the top
 * middle of the border and burns clockwise. No toast: the button itself carries the countdown.
 *
 * Takes every Button size, including icon sizes (`icon`, `icon-sm`, `icon-lg`).
 */
export function FuseButton({
  active,
  onActivate,
  onFire,
  onUndo,
  duration = 5000,
  undoLabel = "Undo",
  shape = "rect",
  variant,
  size,
  className,
  disabled,
  children,
  ...props
}: FuseButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [idleSize, setIdleSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(duration / 1000));
  const isIcon = typeof size === "string" && size.startsWith("icon");

  const onFireRef = useRef(onFire);
  useEffect(() => {
    onFireRef.current = onFire;
  });

  useLayoutEffect(() => {
    if (active) return;
    const button = buttonRef.current;
    if (!button) return;
    const measure = () => {
      const width = button.offsetWidth;
      const height = button.offsetHeight;
      setIdleSize((current) =>
        current && current.width === width && current.height === height
          ? current
          : { width, height },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(button);
    return () => ro.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const path = pathRef.current;
      const svg = svgRef.current;
      const button = buttonRef.current;

      if (path && svg && button && !path.getAttribute("d")) {
        const width = button.offsetWidth;
        const height = button.offsetHeight;
        const border = parseFloat(getComputedStyle(button).borderTopWidth) || 0;
        const inset = FUSE_WIDTH / 2;
        svg.style.inset = `${-border}px`;
        svg.style.width = `${width}px`;
        svg.style.height = `${height}px`;
        path.setAttribute("stroke-width", String(FUSE_WIDTH));
        path.setAttribute(
          "d",
          shape === "circle"
            ? fuseCircle(width, height, inset)
            : fuseOutline(
                width,
                height,
                centreRadius(button, width, height, inset),
                inset,
              ),
        );
      }

      const left = Math.max(0, duration - (now - start));
      const share = left / duration;
      path?.style.setProperty("stroke-dasharray", `${share} 2`);
      path?.style.setProperty("stroke-dashoffset", `${share - 1}`);
      const seconds = Math.ceil(left / 1000);
      setSecondsLeft((current) => (current === seconds ? current : seconds));

      if (left <= 0) {
        onFireRef.current();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, duration, shape]);

  return (
    <Button
      {...props}
      ref={buttonRef}
      size={size}
      variant={active ? "outline" : variant}
      disabled={active ? false : disabled}
      onClick={() => (active ? onUndo() : onActivate())}
      className={cn(
        shape === "circle" && "aspect-square rounded-full",
        active && "relative overflow-hidden tabular-nums",
        className,
      )}
      style={
        active && idleSize
          ? { ...props.style, width: idleSize.width, height: idleSize.height }
          : props.style
      }
      aria-label={active && isIcon ? undoLabel : props["aria-label"]}
    >
      {active ? (
        isIcon ? (
          <span className="text-xs">{secondsLeft}</span>
        ) : (
          `${undoLabel} · ${secondsLeft}s`
        )
      ) : (
        children
      )}
      {active ? (
        <svg
          aria-hidden
          ref={svgRef}
          className="pointer-events-none absolute overflow-visible"
        >
          <path
            ref={pathRef}
            pathLength={1}
            fill="none"
            style={{
              stroke: fuseColor(variant),
              filter: `drop-shadow(0 0 3px ${fuseColor(variant)})`,
            }}
          />
        </svg>
      ) : null}
    </Button>
  );
}
