"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  getCatalogEntry,
  type CompanionAnimationRole,
} from "@/components/companion/catalog";
import { useCompanionInstance } from "@/components/companion/companion-provider";
import { CompanionSprite } from "@/components/companion/companion-sprite";
import {
  createCompanionEngine,
  engineDispatchTrigger,
  engineEndDrag,
  engineMoveDrag,
  engineSetInstanceProfile,
  engineStartDrag,
  engineTick,
  engineTriggerClick,
  engineTriggerDoubleClick,
  type CompanionEngineSnapshot,
} from "@/components/companion/runtime/engine";
import {
  COMPANION_FLOOR_INSET,
  COMPANION_SIZE,
  type LandingSurface,
} from "@/components/companion/runtime/physics";

function isCompanionChrome(el: Element) {
  return Boolean(
    el.closest(
      "[data-companion-layer], [data-companion-host], [data-companion-sprite]",
    ),
  );
}

function collectLandingSurfaces(sampleX: number): LandingSurface[] {
  if (typeof document === "undefined") {
    return [];
  }

  const surfaces: LandingSurface[] = [];
  const seen = new Set<Element>();
  const step = 10;

  for (let y = 0; y < window.innerHeight; y += step) {
    const stack =
      typeof document.elementsFromPoint === "function"
        ? document.elementsFromPoint(sampleX, y)
        : [];

    for (const el of stack) {
      if (!(el instanceof Element) || seen.has(el) || isCompanionChrome(el)) {
        continue;
      }

      const style = getComputedStyle(el);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.pointerEvents === "none"
      ) {
        continue;
      }

      const rect = el.getBoundingClientRect();
      if (rect.width < 48 || rect.height < 12) {
        continue;
      }

      if (
        rect.width >= window.innerWidth - 8 &&
        rect.height >= window.innerHeight - 8
      ) {
        continue;
      }

      if (Number.parseFloat(style.opacity || "1") < 0.15) {
        continue;
      }

      seen.add(el);
      surfaces.push({
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      });
    }
  }

  return surfaces;
}

function distanceToCompanion(
  clientX: number,
  clientY: number,
  position: { x: number; y: number },
  size: number,
): number {
  const cx = position.x + size / 2;
  const cy = position.y + size / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  return Math.hypot(dx, dy);
}

/**
 * Global companion host — thin React adapter over the runtime engine.
 * Navigation preserves companion id, position, and runtime state via the provider.
 */
export function CompanionHost() {
  const { instance, patchInstance } = useCompanionInstance();
  const pathname = usePathname();
  const entry = getCatalogEntry(instance.companionId);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const dragMovedRef = useRef(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathnameRef = useRef<string | null>(null);
  const engineRef = useRef<CompanionEngineSnapshot | null>(null);
  const patchRef = useRef(patchInstance);
  const instanceRef = useRef(instance);
  const [snapshot, setSnapshot] = useState<CompanionEngineSnapshot | null>(
    null,
  );

  patchRef.current = patchInstance;
  instanceRef.current = instance;

  // Create / rehydrate engine when companion species changes.
  useEffect(() => {
    if (!entry) {
      return;
    }

    const engine = createCompanionEngine({
      config: entry.meta,
      position: instanceRef.current.position,
      state: instanceRef.current.runtimeState,
      instanceProfileId: instanceRef.current.instanceProfileId,
    });
    engineRef.current = engine;
    setSnapshot(engine);
  }, [entry]);

  // Apply personality instance profile overrides without remounting assets.
  useEffect(() => {
    if (!entry || !engineRef.current) {
      return;
    }

    const next = engineSetInstanceProfile(
      engineRef.current,
      entry.meta,
      instance.instanceProfileId,
    );
    engineRef.current = next;
    setSnapshot(next);
  }, [entry, instance.instanceProfileId]);

  // Keep a live engine ticking for animation + physics.
  useEffect(() => {
    if (!entry) {
      return;
    }

    let frame = 0;
    let last = performance.now();
    let active = true;

    function tick(now: number) {
      if (!active || !engineRef.current || !entry) {
        return;
      }

      const dtMs = Math.min(48, now - last);
      last = now;
      const sampleX =
        engineRef.current.physics.position.x + COMPANION_SIZE / 2;
      const surfaces =
        engineRef.current.state === "falling"
          ? collectLandingSurfaces(sampleX)
          : [];

      const next = engineTick(
        engineRef.current,
        entry.meta,
        dtMs,
        { width: window.innerWidth, height: window.innerHeight },
        surfaces,
      );

      engineRef.current = next;
      setSnapshot(next);

      const current = instanceRef.current;
      if (
        next.placed &&
        (current.position?.x !== next.physics.position.x ||
          current.position?.y !== next.physics.position.y ||
          current.runtimeState !== next.state)
      ) {
        patchRef.current({
          position: next.physics.position,
          runtimeState: next.state,
        });
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [entry]);

  // page_navigation trigger — fire after the initial mount path is recorded.
  useEffect(() => {
    if (!entry || !engineRef.current) {
      return;
    }

    if (pathnameRef.current === null) {
      pathnameRef.current = pathname;
      return;
    }

    if (pathnameRef.current === pathname) {
      return;
    }

    pathnameRef.current = pathname;
    if (
      engineRef.current.state !== "idle" &&
      engineRef.current.state !== "sleeping"
    ) {
      return;
    }

    const next = engineDispatchTrigger(
      engineRef.current,
      entry.meta,
      {
        trigger: "page_navigation",
        payload: { pathname },
      },
      Date.now(),
      { width: window.innerWidth, height: window.innerHeight },
    );
    engineRef.current = next;
    setSnapshot(next);
    patchRef.current({ runtimeState: next.state });
  }, [entry, pathname]);

  // cursor_nearby trigger — generic proximity, no companion-specific checks.
  useEffect(() => {
    if (!entry) {
      return;
    }

    function onPointerMove(event: PointerEvent) {
      if (!engineRef.current || !entry) {
        return;
      }
      if (
        engineRef.current.state !== "idle" &&
        engineRef.current.state !== "sleeping"
      ) {
        return;
      }

      if (!engineRef.current.placed) {
        return;
      }

      const distance = distanceToCompanion(
        event.clientX,
        event.clientY,
        engineRef.current.physics.position,
        COMPANION_SIZE,
      );

      if (distance > engineRef.current.personality.cursorNearbyRadius) {
        return;
      }

      const next = engineDispatchTrigger(
        engineRef.current,
        entry.meta,
        {
          trigger: "cursor_nearby",
          payload: {
            cursorDistance: distance,
            cursorNearbyRadius: engineRef.current.personality.cursorNearbyRadius,
          },
        },
        Date.now(),
        { width: window.innerWidth, height: window.innerHeight },
      );

      if (next === engineRef.current) {
        return;
      }

      engineRef.current = next;
      setSnapshot(next);
      patchRef.current({ runtimeState: next.state });
    }

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [entry]);

  useEffect(() => {
    if (!snapshot || snapshot.state !== "dragging") {
      return;
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragOffset.current || !engineRef.current || !entry) {
        return;
      }

      const nextPos = {
        x: event.clientX - dragOffset.current.x,
        y: event.clientY - dragOffset.current.y,
      };
      const previous = engineRef.current.physics.position;
      if (
        Math.abs(previous.x - nextPos.x) > 3 ||
        Math.abs(previous.y - nextPos.y) > 3
      ) {
        dragMovedRef.current = true;
      }

      const moved = engineMoveDrag(engineRef.current, nextPos, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      engineRef.current = moved;
      setSnapshot(moved);
      patchRef.current({
        position: moved.physics.position,
        runtimeState: moved.state,
      });
    }

    function onPointerUp() {
      if (!engineRef.current || !entry) {
        return;
      }

      dragOffset.current = null;
      const sampleX =
        engineRef.current.physics.position.x + COMPANION_SIZE / 2;
      const ended = engineEndDrag(
        engineRef.current,
        entry.meta,
        { width: window.innerWidth, height: window.innerHeight },
        collectLandingSurfaces(sampleX),
      );
      engineRef.current = ended;
      setSnapshot(ended);
      patchRef.current({
        position: ended.physics.position,
        runtimeState: ended.state,
      });
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [entry, snapshot?.state]);

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  if (!entry || !snapshot) {
    return null;
  }

  const clipKey = (snapshot.animation.clipId in entry.clips
    ? snapshot.animation.clipId
    : "idle") as CompanionAnimationRole;
  const clip = entry.clips[clipKey] ?? entry.clips.idle;
  const dragging = snapshot.state === "dragging";
  const placed = snapshot.placed;

  return (
    <div
      data-companion-layer
      className="pointer-events-none fixed inset-0 z-40 print:hidden"
      aria-hidden="true"
    >
      <div
        data-companion-host
        data-companion-instance={instance.instanceId}
        data-companion-id={entry.meta.id}
        data-companion-profile={snapshot.instanceProfileId ?? undefined}
        data-companion-mood={snapshot.mood}
        data-companion-motion={snapshot.state}
        data-companion-role={snapshot.animation.clipId}
        data-companion-dragging={dragging ? "true" : "false"}
        className="pointer-events-auto absolute touch-none select-none"
        style={
          placed
            ? {
                left: snapshot.physics.position.x,
                top: snapshot.physics.position.y,
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
          if (event.button !== 0 || !engineRef.current || !entry) {
            return;
          }

          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          dragOffset.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          };
          dragMovedRef.current = false;
          const started = engineStartDrag(engineRef.current, entry.meta, {
            x: rect.left,
            y: rect.top,
          });
          engineRef.current = started;
          setSnapshot(started);
          patchRef.current({
            position: started.physics.position,
            runtimeState: started.state,
          });
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onClick={() => {
          if (
            !engineRef.current ||
            !entry ||
            dragMovedRef.current ||
            (snapshot.state !== "idle" && snapshot.state !== "sleeping")
          ) {
            return;
          }

          if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current);
          }

          // Defer single-click so double_click can cancel it.
          clickTimerRef.current = setTimeout(() => {
            if (!engineRef.current || !entry) {
              return;
            }
            const clicked = engineTriggerClick(engineRef.current, entry.meta);
            engineRef.current = clicked;
            setSnapshot(clicked);
            patchRef.current({ runtimeState: clicked.state });
          }, 220);
        }}
        onDoubleClick={() => {
          if (
            !engineRef.current ||
            !entry ||
            dragMovedRef.current ||
            (snapshot.state !== "idle" && snapshot.state !== "sleeping")
          ) {
            return;
          }

          if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;
          }

          const jumped = engineTriggerDoubleClick(
            engineRef.current,
            entry.meta,
          );
          engineRef.current = jumped;
          setSnapshot(jumped);
          patchRef.current({ runtimeState: jumped.state });
        }}
      >
        <CompanionSprite
          name={snapshot.displayName}
          frames={clip.frames}
          fps={clip.fps}
          frameIndex={snapshot.animation.frameIndex}
          size={COMPANION_SIZE}
          playing={false}
          className="pointer-events-none"
        />
      </div>
    </div>
  );
}
