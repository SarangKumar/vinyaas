"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  getCatalogEntry,
  type CompanionAnimationRole,
  type CompanionCatalogEntry,
} from "@/components/companion/catalog";
import type { CompanionInstanceState } from "@/components/companion/companion-provider";
import { CompanionSprite } from "@/components/companion/companion-sprite";
import {
  createCompanionEngine,
  engineDispatchTrigger,
  engineEndDrag,
  engineFollowPerch,
  engineMoveDrag,
  engineStartDrag,
  engineTick,
  engineTriggerClick,
  engineTriggerDoubleClick,
  type CompanionEngineSnapshot,
} from "@/components/companion/runtime/engine";
import {
  companionFloorY,
  COMPANION_SIZE,
  findSurfaceTopBelow,
  isFatalFallAboveSurface,
  type LandingSurface,
} from "@/components/companion/runtime/physics";
import {
  isCompanionInteractive,
  isCompanionVisible,
} from "@/components/companion/runtime/state-machine";
import {
  clearCompanionSurfaceHighlight,
  collectDeclaredCompanionSurfaces,
  findCompanionSurfaceAt,
  findCompanionSurfaceById,
  setCompanionSurfaceHighlight,
  type CompanionSurfaceRect,
} from "@/components/companion/runtime/surfaces";
import { focusRing } from "@/components/focus-ring";
import {
  getCompanionBond,
  recordCompanionDeath,
  recordCompanionInteraction,
  recordCompanionLifetime,
} from "@/components/companion/progression";

type CompanionActorProps = {
  instance: CompanionInstanceState;
  occupied: { x: number; y: number }[];
  patchInstance: (
    id: string,
    patch: Partial<
      Pick<
        CompanionInstanceState,
        "x" | "y" | "state" | "surfaceId" | "deadUntilMs"
      >
    >,
  ) => void;
  removeInstance: (id: string) => void;
  onDragSurfaceChange: (
    surface: CompanionSurfaceRect | null,
    valid: boolean,
  ) => void;
};

function surfacesAsLanding(surfaces: CompanionSurfaceRect[]): LandingSurface[] {
  return surfaces.map((surface) => ({
    top: surface.top,
    left: surface.left,
    right: surface.right,
    bottom: surface.bottom,
  }));
}

function distanceToCompanion(
  clientX: number,
  clientY: number,
  position: { x: number; y: number },
  size: number,
): number {
  const cx = position.x + size / 2;
  const cy = position.y + size / 2;
  return Math.hypot(clientX - cx, clientY - cy);
}

function allowedIdsFor(type: string): ReadonlySet<string> | null {
  if (type !== "ember") {
    return null;
  }
  return new Set(getCompanionBond("ember").unlockedInteractionIds);
}

/**
 * One Companion instance runtime adapter — engine, drag, permanent death.
 */
export function CompanionActor({
  instance,
  occupied,
  patchInstance,
  removeInstance,
  onDragSurfaceChange,
}: CompanionActorProps) {
  const entry = getCatalogEntry(instance.type);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const dragMovedRef = useRef(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removedRef = useRef(false);
  const lifetimeAccRef = useRef(0);
  const lastXpInteractionRef = useRef<string | null>(null);
  const engineRef = useRef<CompanionEngineSnapshot | null>(null);
  const highlightElRef = useRef<HTMLElement | null>(null);
  const patchRef = useRef(patchInstance);
  const removeRef = useRef(removeInstance);
  const occupiedRef = useRef(occupied);
  const instanceRef = useRef(instance);
  const onDragSurfaceChangeRef = useRef(onDragSurfaceChange);
  const [snapshot, setSnapshot] = useState<CompanionEngineSnapshot | null>(
    () => {
      if (!entry) {
        return null;
      }
      return createCompanionEngine({
        config: entry.meta,
        position: { x: instance.x, y: instance.y },
        state: instance.state,
        instanceProfileId: instance.instanceProfileId,
        surfaceId: instance.surfaceId,
        deadUntilMs: instance.deadUntilMs,
      });
    },
  );

  useEffect(() => {
    engineRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    patchRef.current = patchInstance;
    removeRef.current = removeInstance;
    occupiedRef.current = occupied;
    instanceRef.current = instance;
    onDragSurfaceChangeRef.current = onDragSurfaceChange;
  }, [patchInstance, removeInstance, occupied, instance, onDragSurfaceChange]);

  // page_navigation broadcast from the host
  useEffect(() => {
    if (!entry) {
      return;
    }

    function onNavigate(event: Event) {
      if (!engineRef.current || !entry) {
        return;
      }
      if (
        engineRef.current.state !== "idle" &&
        engineRef.current.state !== "sleeping"
      ) {
        return;
      }
      const detail = (event as CustomEvent<{ pathname?: string }>).detail;
      const next = engineDispatchTrigger(
        engineRef.current,
        entry.meta,
        {
          trigger: "page_navigation",
          payload: { pathname: detail?.pathname },
        },
        Date.now(),
        { width: window.innerWidth, height: window.innerHeight },
        allowedIdsFor(instanceRef.current.type),
      );
      engineRef.current = next;
      setSnapshot(next);
      patchRef.current(instanceRef.current.id, { state: next.state });
    }

    window.addEventListener("vinyaas:companion-navigate", onNavigate);
    return () =>
      window.removeEventListener("vinyaas:companion-navigate", onNavigate);
  }, [entry]);

  // Animation + physics tick
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
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let currentEngine = engineRef.current;
      if (currentEngine.surfaceId) {
        const perch = findCompanionSurfaceById(currentEngine.surfaceId);
        currentEngine = engineFollowPerch(
          currentEngine,
          entry.meta,
          perch
            ? {
                top: perch.top,
                left: perch.left,
                right: perch.right,
                bottom: perch.bottom,
              }
            : null,
          viewport,
          COMPANION_SIZE,
        );
      }

      const surfaces =
        currentEngine.state === "falling" && !currentEngine.deathPending
          ? surfacesAsLanding(collectDeclaredCompanionSurfaces())
          : [];

      const allowed =
        instanceRef.current.type === "ember" ? allowedIdsFor("ember") : null;

      let next = engineTick(
        currentEngine,
        entry.meta,
        dtMs,
        viewport,
        surfaces,
        COMPANION_SIZE,
        Date.now(),
        allowed,
      );

      // After a non-fatal land, bind to the surface underfoot so scroll-follow works.
      if (
        currentEngine.state === "falling" &&
        !currentEngine.deathPending &&
        (next.state === "landing" || next.state === "idle") &&
        !next.surfaceId
      ) {
        const feetX = next.physics.position.x + COMPANION_SIZE / 2;
        const feetY = next.physics.position.y + COMPANION_SIZE - 2;
        const underfoot = findCompanionSurfaceAt(feetX, feetY);
        if (underfoot) {
          next = { ...next, surfaceId: underfoot.id };
        }
      }

      if (
        next.lastInteractionId &&
        next.lastInteractionId !== lastXpInteractionRef.current
      ) {
        lastXpInteractionRef.current = next.lastInteractionId;
        recordCompanionInteraction(
          instanceRef.current.type,
          next.lastInteractionId,
        );
      }

      lifetimeAccRef.current += dtMs;
      if (lifetimeAccRef.current >= 5000) {
        recordCompanionLifetime(
          instanceRef.current.type,
          lifetimeAccRef.current,
        );
        lifetimeAccRef.current = 0;
      }

      engineRef.current = next;
      setSnapshot(next);

      const current = instanceRef.current;
      if (
        current.x !== next.physics.position.x ||
        current.y !== next.physics.position.y ||
        current.state !== next.state ||
        current.surfaceId !== next.surfaceId ||
        current.deadUntilMs !== next.deadUntilMs
      ) {
        patchRef.current(current.id, {
          x: next.physics.position.x,
          y: next.physics.position.y,
          state: next.state,
          surfaceId: next.surfaceId,
          deadUntilMs: next.deadUntilMs,
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

  // Permanent death — record bond, remove instance (no respawn).
  const isDead = snapshot?.state === "dead";
  useEffect(() => {
    if (!isDead || removedRef.current) {
      return;
    }
    removedRef.current = true;
    recordCompanionDeath(instanceRef.current.type);
    removeRef.current(instanceRef.current.id);
  }, [isDead]);

  // cursor_nearby (hover reaction)
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
            cursorNearbyRadius:
              engineRef.current.personality.cursorNearbyRadius,
          },
        },
        Date.now(),
        { width: window.innerWidth, height: window.innerHeight },
        allowedIdsFor(instanceRef.current.type),
      );

      if (next === engineRef.current) {
        return;
      }

      engineRef.current = next;
      setSnapshot(next);
      patchRef.current(instanceRef.current.id, { state: next.state });
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [entry]);

  // Shared drag listeners while this actor is dragging
  const isDragging = snapshot?.state === "dragging";
  useEffect(() => {
    if (!isDragging || !entry) {
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

      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const declared = collectDeclaredCompanionSurfaces();
      const landing = surfacesAsLanding(declared);
      const floorCompanionY = companionFloorY(viewport.height, COMPANION_SIZE);
      const surfaceTopBelow = findSurfaceTopBelow(
        nextPos.x,
        nextPos.y,
        landing,
        floorCompanionY,
        COMPANION_SIZE,
      );
      const fatalHeight = isFatalFallAboveSurface(
        nextPos.y,
        surfaceTopBelow,
        viewport.height,
        COMPANION_SIZE,
      );

      const moved = engineMoveDrag(
        engineRef.current,
        nextPos,
        viewport,
        COMPANION_SIZE,
        { config: entry.meta, fatalHeight },
      );
      engineRef.current = moved;
      setSnapshot(moved);

      const centerX = moved.physics.position.x + COMPANION_SIZE / 2;
      const centerY = moved.physics.position.y + COMPANION_SIZE / 2;
      const surface = findCompanionSurfaceAt(centerX, centerY);
      highlightElRef.current = setCompanionSurfaceHighlight(
        surface,
        highlightElRef.current,
      );
      onDragSurfaceChangeRef.current(surface, Boolean(surface));
    }

    function onPointerUp() {
      if (!engineRef.current || !entry) {
        return;
      }

      dragOffset.current = null;
      clearCompanionSurfaceHighlight(highlightElRef.current);
      highlightElRef.current = null;
      onDragSurfaceChangeRef.current(null, false);

      const pos = engineRef.current.physics.position;
      const declared = collectDeclaredCompanionSurfaces();
      const landing = surfacesAsLanding(declared);
      const floorCompanionY = companionFloorY(
        window.innerHeight,
        COMPANION_SIZE,
      );
      const surfaceTopBelow = findSurfaceTopBelow(
        pos.x,
        pos.y,
        landing,
        floorCompanionY,
        COMPANION_SIZE,
      );
      const deathDrop = isFatalFallAboveSurface(
        pos.y,
        surfaceTopBelow,
        window.innerHeight,
        COMPANION_SIZE,
      );
      const centerX = pos.x + COMPANION_SIZE / 2;
      const centerY = pos.y + COMPANION_SIZE / 2;
      const surface = deathDrop
        ? null
        : findCompanionSurfaceAt(centerX, centerY);

      const ended = engineEndDrag(
        engineRef.current,
        entry.meta,
        { width: window.innerWidth, height: window.innerHeight },
        landing,
        {
          deathDrop,
          dropSurface: surface
            ? {
                top: surface.top,
                left: surface.left,
                right: surface.right,
                bottom: surface.bottom,
              }
            : null,
          surfaceId: surface?.id ?? null,
        },
      );
      engineRef.current = ended;
      setSnapshot(ended);
      patchRef.current(instanceRef.current.id, {
        x: ended.physics.position.x,
        y: ended.physics.position.y,
        state: ended.state,
        surfaceId: ended.surfaceId,
        deadUntilMs: ended.deadUntilMs,
      });
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      clearCompanionSurfaceHighlight(highlightElRef.current);
      highlightElRef.current = null;
    };
  }, [entry, isDragging]);

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      clearCompanionSurfaceHighlight(highlightElRef.current);
    };
  }, []);

  if (!entry || !snapshot) {
    return null;
  }

  return (
    <CompanionActorView
      entry={entry}
      instanceId={instance.id}
      snapshot={snapshot}
      interactive={isCompanionInteractive(snapshot.state)}
      visible={isCompanionVisible(snapshot.state)}
      onPointerDown={(event) => {
        if (
          event.button !== 0 ||
          !engineRef.current ||
          !entry ||
          !isCompanionInteractive(engineRef.current.state)
        ) {
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
        patchRef.current(instance.id, {
          x: started.physics.position.x,
          y: started.physics.position.y,
          state: started.state,
          surfaceId: null,
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

        clickTimerRef.current = setTimeout(() => {
          if (!engineRef.current || !entry) {
            return;
          }
          const clicked = engineTriggerClick(
            engineRef.current,
            entry.meta,
            Date.now(),
            undefined,
            allowedIdsFor(instance.type),
          );
          engineRef.current = clicked;
          setSnapshot(clicked);
          patchRef.current(instance.id, { state: clicked.state });
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
          Date.now(),
          undefined,
          allowedIdsFor(instance.type),
        );
        engineRef.current = jumped;
        setSnapshot(jumped);
        patchRef.current(instance.id, { state: jumped.state });
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }
        if (
          !engineRef.current ||
          !entry ||
          (snapshot.state !== "idle" && snapshot.state !== "sleeping")
        ) {
          return;
        }
        event.preventDefault();
        const clicked = engineTriggerClick(
          engineRef.current,
          entry.meta,
          Date.now(),
          undefined,
          allowedIdsFor(instance.type),
        );
        engineRef.current = clicked;
        setSnapshot(clicked);
        patchRef.current(instance.id, { state: clicked.state });
      }}
      dispatch={(event) => {
        if (!engineRef.current || !entry) {
          return;
        }
        if (
          engineRef.current.state !== "idle" &&
          engineRef.current.state !== "sleeping" &&
          engineRef.current.state !== "interacting"
        ) {
          return;
        }
        const next = engineDispatchTrigger(
          engineRef.current,
          entry.meta,
          event,
          Date.now(),
          { width: window.innerWidth, height: window.innerHeight },
          allowedIdsFor(instance.type),
        );
        if (next === engineRef.current) {
          return;
        }
        engineRef.current = next;
        setSnapshot(next);
        patchRef.current(instance.id, { state: next.state });
      }}
      surfaceId={snapshot.surfaceId}
    />
  );
}

type ActorViewProps = {
  entry: CompanionCatalogEntry;
  instanceId: string;
  snapshot: CompanionEngineSnapshot;
  interactive: boolean;
  visible: boolean;
  surfaceId: string | null;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onClick: () => void;
  onDoubleClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  dispatch: (event: {
    trigger: "scroll" | "surface_action";
    payload?: Record<string, unknown>;
  }) => void;
};

function CompanionActorView({
  entry,
  instanceId,
  snapshot,
  interactive,
  visible,
  surfaceId,
  onPointerDown,
  onClick,
  onDoubleClick,
  onKeyDown,
  dispatch,
}: ActorViewProps) {
  const clipKey = (
    snapshot.animation.clipId in entry.clips
      ? snapshot.animation.clipId
      : "idle"
  ) as CompanionAnimationRole;
  const clip = entry.clips[clipKey] ?? entry.clips.idle;
  const dragging = snapshot.state === "dragging";

  // Scroll reaction — one shared listener per actor; cooldown lives in engine.
  useEffect(() => {
    if (!interactive) {
      return;
    }

    let ticking = false;
    function onScroll() {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        dispatch({ trigger: "scroll" });
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dispatch, interactive]);

  // Surface interaction — react when the perched surface receives a click.
  useEffect(() => {
    if (!interactive || !surfaceId) {
      return;
    }

    function onPointerUp(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const surface = target.closest(
        "[data-companion-surface], button, [role='button'], select, [data-slot='select-trigger'], [data-slot='native-select-wrapper'], [data-code-frame], [data-slot='card'], [data-play-block]",
      );
      if (!(surface instanceof HTMLElement)) {
        return;
      }
      const id =
        surface.getAttribute("data-companion-surface-id") || surface.id || null;
      // Match by element proximity when ids are generated dynamically.
      const rect = surface.getBoundingClientRect();
      const matches =
        id === surfaceId ||
        (snapshot.physics.position.y + COMPANION_SIZE >= rect.top - 2 &&
          snapshot.physics.position.y + COMPANION_SIZE <= rect.top + 8 &&
          snapshot.physics.position.x + COMPANION_SIZE > rect.left &&
          snapshot.physics.position.x < rect.right);

      if (!matches) {
        return;
      }

      dispatch({
        trigger: "surface_action",
        payload: { surfaceId, kind: "click" },
      });
    }

    document.addEventListener("pointerup", onPointerUp, true);
    return () => document.removeEventListener("pointerup", onPointerUp, true);
  }, [dispatch, interactive, surfaceId, snapshot.physics.position]);

  if (!visible) {
    return (
      <div
        data-companion-host
        data-companion-instance={instanceId}
        data-companion-id={entry.meta.id}
        data-companion-motion="dead"
        data-companion-dead=""
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0"
        style={{
          left: snapshot.physics.position.x,
          top: snapshot.physics.position.y,
          width: COMPANION_SIZE,
          height: COMPANION_SIZE,
        }}
      />
    );
  }

  return (
    <div
      data-companion-host
      data-companion-instance={instanceId}
      data-companion-id={entry.meta.id}
      data-companion-profile={snapshot.instanceProfileId ?? undefined}
      data-companion-mood={snapshot.mood}
      data-companion-motion={snapshot.state}
      data-companion-role={snapshot.animation.clipId}
      data-companion-dragging={dragging ? "true" : "false"}
      data-companion-surface-id={surfaceId ?? undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : -1}
      aria-label={
        interactive
          ? `${snapshot.displayName} companion. Activate for a reaction, or drag onto a surface.`
          : undefined
      }
      aria-hidden={interactive ? undefined : true}
      className={[
        "absolute touch-none select-none",
        interactive ? "pointer-events-auto" : "pointer-events-none",
        interactive ? focusRing : "",
        dragging ? "z-10" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        left: snapshot.physics.position.x,
        top: snapshot.physics.position.y,
        width: COMPANION_SIZE,
        height: COMPANION_SIZE,
        cursor: !interactive ? "default" : dragging ? "grabbing" : "grab",
      }}
      onPointerDown={interactive ? onPointerDown : undefined}
      onClick={interactive ? onClick : undefined}
      onDoubleClick={interactive ? onDoubleClick : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
    >
      <CompanionSprite
        name={snapshot.displayName}
        frames={clip.frames}
        fps={clip.fps}
        frameIndex={snapshot.animation.frameIndex}
        size={COMPANION_SIZE}
        playing={false}
        className="pointer-events-none"
        alt=""
      />
    </div>
  );
}
