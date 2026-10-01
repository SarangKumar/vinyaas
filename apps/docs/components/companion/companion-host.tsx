"use client";

import { useEffect, useRef, useState } from "react";

import { companionCatalog } from "@/components/companion/catalog";
import { useCompanionInstance } from "@/components/companion/companion-provider";
import { CompanionSprite } from "@/components/companion/companion-sprite";
import {
  clampCompanionPosition,
  companionFloorY,
  COMPANION_FLOOR_INSET,
  COMPANION_SIZE,
  shouldFallOnDrop,
  stepCompanionFall,
  type CompanionMotionState,
} from "@/components/companion/companion-runtime";

/**
 * Global floating companion layer for the docs site.
 * Mounted once under CompanionProvider — not inside route pages.
 * Plays idle frames, supports drag, and falls with simple gravity on drop.
 */
export function CompanionHost() {
  const { instance, setPosition } = useCompanionInstance();
  const entry =
    companionCatalog.find((item) => item.meta.id === instance.companionId) ??
    companionCatalog[0];
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const positionRef = useRef(instance.position);
  const velocityRef = useRef(0);
  const [motion, setMotion] = useState<CompanionMotionState>("idle");

  useEffect(() => {
    positionRef.current = instance.position;
  }, [instance.position]);

  useEffect(() => {
    if (motion !== "dragging") {
      return;
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragOffset.current) {
        return;
      }

      const next = clampCompanionPosition(
        event.clientX - dragOffset.current.x,
        event.clientY - dragOffset.current.y,
        window.innerWidth,
        window.innerHeight,
      );
      setPosition(next);
    }

    function onPointerUp() {
      dragOffset.current = null;
      const current = positionRef.current;
      if (!current) {
        setMotion("idle");
        return;
      }

      const floorY = companionFloorY(window.innerHeight);
      if (shouldFallOnDrop(current.y, floorY)) {
        velocityRef.current = 0;
        setMotion("falling");
      } else {
        setMotion("idle");
      }
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [motion, setPosition]);

  useEffect(() => {
    if (motion !== "falling") {
      return;
    }

    let frame = 0;
    let last = performance.now();
    let active = true;

    function tick(now: number) {
      if (!active) {
        return;
      }

      const dt = Math.min(2.5, (now - last) / (1000 / 60));
      last = now;

      const current = positionRef.current;
      if (!current) {
        setMotion("idle");
        return;
      }

      const floorY = companionFloorY(window.innerHeight);
      const stepped = stepCompanionFall(
        current.y,
        velocityRef.current,
        floorY,
        dt,
      );
      velocityRef.current = stepped.vy;
      const next = clampCompanionPosition(
        current.x,
        stepped.y,
        window.innerWidth,
        window.innerHeight,
      );
      setPosition(next);

      if (stepped.landed) {
        velocityRef.current = 0;
        setMotion("idle");
        return;
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [motion, setPosition]);

  if (!entry) {
    return null;
  }

  const placed = instance.position !== null;
  const clip = motion === "falling" ? entry.clips.fall : entry.clips.idle;
  const dragging = motion === "dragging";

  return (
    <div
      data-companion-layer
      className="pointer-events-none fixed inset-0 z-50 print:hidden"
      aria-hidden="true"
    >
      <div
        data-companion-host
        data-companion-instance={instance.instanceId}
        data-companion-id={entry.meta.id}
        data-companion-motion={motion}
        data-companion-dragging={dragging ? "true" : "false"}
        className="pointer-events-auto absolute touch-none select-none"
        style={
          placed
            ? {
                left: instance.position!.x,
                top: instance.position!.y,
                right: "auto",
                bottom: "auto",
                width: COMPANION_SIZE,
                height: COMPANION_SIZE,
                cursor: dragging ? "grabbing" : "grab",
              }
            : {
                right: COMPANION_FLOOR_INSET,
                bottom: COMPANION_FLOOR_INSET,
                width: COMPANION_SIZE,
                height: COMPANION_SIZE,
                cursor: dragging ? "grabbing" : "grab",
              }
        }
        onPointerDown={(event) => {
          if (event.button !== 0) {
            return;
          }

          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          dragOffset.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          };
          velocityRef.current = 0;
          setPosition({ x: rect.left, y: rect.top });
          setMotion("dragging");
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
      >
        <CompanionSprite
          name={entry.meta.name}
          frames={clip.frames}
          fps={clip.fps}
          size={COMPANION_SIZE}
          playing
          className="pointer-events-none"
        />
      </div>
    </div>
  );
}
