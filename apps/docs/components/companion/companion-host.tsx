"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

import { CompanionActor } from "@/components/companion/companion-actor";
import { useCompanions } from "@/components/companion/companion-provider";
import type { CompanionSurfaceRect } from "@/components/companion/runtime/surfaces";
import { COMPANION_SURFACE_ACTIVE_ATTR } from "@/components/companion/runtime/surfaces";

/**
 * Global companion host — renders every live instance.
 * Navigation preserves instances via the provider.
 */
export function CompanionHost() {
  const { instances, patchInstance, removeInstance } = useCompanions();
  const pathname = usePathname();
  const pathnameRef = useRef<string | null>(null);
  const rejectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const occupied = useMemo(
    () => instances.map((item) => ({ x: item.x, y: item.y })),
    [instances],
  );

  const onDragSurfaceChange = useCallback(
    (surface: CompanionSurfaceRect | null, valid: boolean) => {
      // Clear prior reject markers.
      document
        .querySelectorAll("[data-companion-surface-reject]")
        .forEach((el) => el.removeAttribute("data-companion-surface-reject"));

      if (!valid && !surface) {
        // Invalid drop zone — subtle layer cue via attribute on the host layer.
        const layer = document.querySelector("[data-companion-layer]");
        if (layer instanceof HTMLElement) {
          layer.setAttribute("data-companion-drag-invalid", "");
          if (rejectTimerRef.current) {
            clearTimeout(rejectTimerRef.current);
          }
          rejectTimerRef.current = setTimeout(() => {
            layer.removeAttribute("data-companion-drag-invalid");
          }, 120);
        }
        return;
      }

      document
        .querySelector("[data-companion-layer]")
        ?.removeAttribute("data-companion-drag-invalid");

      if (
        surface &&
        !surface.element.hasAttribute(COMPANION_SURFACE_ACTIVE_ATTR)
      ) {
        // Highlight is applied inside the actor; this path is a no-op safeguard.
      }
    },
    [],
  );

  // page_navigation — broadcast to idle actors via DOM custom event (actors listen optionally).
  useEffect(() => {
    if (pathnameRef.current === null) {
      pathnameRef.current = pathname;
      return;
    }
    if (pathnameRef.current === pathname) {
      return;
    }
    pathnameRef.current = pathname;
    window.dispatchEvent(
      new CustomEvent("vinyaas:companion-navigate", {
        detail: { pathname },
      }),
    );
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (rejectTimerRef.current) {
        clearTimeout(rejectTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      data-companion-layer
      className="pointer-events-none fixed inset-0 z-40 print:hidden"
      aria-hidden={instances.length === 0 ? true : undefined}
    >
      {instances.map((instance) => (
        <CompanionActor
          key={instance.id}
          instance={instance}
          occupied={occupied}
          patchInstance={patchInstance}
          removeInstance={removeInstance}
          onDragSurfaceChange={onDragSurfaceChange}
        />
      ))}
    </div>
  );
}
