/**
 * Companion landing surfaces.
 *
 * Prefer explicit `data-companion-surface`. Interactive chrome (buttons,
 * selects, code blocks, cards, playground panels) also counts — plain text
 * and layout wrappers still do not.
 */

export const COMPANION_SURFACE_ATTR = "data-companion-surface";
export const COMPANION_SURFACE_ACTIVE_ATTR = "data-companion-surface-active";

/**
 * Elements that may host a Companion perch.
 * Order matters for `closest()` — more specific surfaces win via DOM ancestry.
 */
export const COMPANION_SURFACE_SELECTOR = [
  `[${COMPANION_SURFACE_ATTR}]`,
  "[data-play-block]",
  "[data-code-frame]",
  "[data-slot='card']",
  "[data-slot='select-trigger']",
  "[data-slot='native-select-wrapper']",
  "[data-slot='native-select']",
  "[data-slot='button']",
  "button",
  "[role='button']",
  "select",
  "pre",
].join(", ");

export type CompanionSurfaceRect = {
  id: string;
  element: HTMLElement;
  top: number;
  left: number;
  right: number;
  bottom: number;
};

function isCompanionChrome(el: Element) {
  return Boolean(
    el.closest(
      "[data-companion-layer], [data-companion-host], [data-companion-sprite], [data-companion-card-control]",
    ),
  );
}

function isPlainTextSurface(el: HTMLElement): boolean {
  const tag = el.tagName.toLowerCase();
  if (
    tag === "p" ||
    tag === "span" ||
    tag === "a" ||
    tag === "li" ||
    tag === "label" ||
    tag === "h1" ||
    tag === "h2" ||
    tag === "h3" ||
    tag === "h4" ||
    tag === "h5" ||
    tag === "h6" ||
    tag === "em" ||
    tag === "strong" ||
    tag === "small" ||
    tag === "code"
  ) {
    // Inline code in prose is not a perch; fenced `pre > code` resolves via `pre`.
    return tag !== "code" || el.parentElement?.tagName.toLowerCase() !== "pre";
  }
  return false;
}

function surfaceIdFor(el: HTMLElement): string {
  const declared = el.getAttribute("data-companion-surface-id");
  if (declared) {
    return declared;
  }
  if (el.id) {
    return el.id;
  }
  const slot = el.getAttribute("data-slot");
  if (slot) {
    return `slot-${slot}-${Math.round(el.getBoundingClientRect().top)}-${Math.round(el.getBoundingClientRect().left)}`;
  }
  return `surface-${el.tagName.toLowerCase()}-${Math.round(el.getBoundingClientRect().top)}-${Math.round(el.getBoundingClientRect().left)}`;
}

export function toCompanionSurfaceRect(el: HTMLElement): CompanionSurfaceRect {
  const rect = el.getBoundingClientRect();
  return {
    id: surfaceIdFor(el),
    element: el,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
  };
}

function isUsableSurface(surface: HTMLElement): boolean {
  if (isPlainTextSurface(surface)) {
    return false;
  }
  const style = getComputedStyle(surface);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    Number.parseFloat(style.opacity || "1") < 0.15
  ) {
    return false;
  }
  const rect = surface.getBoundingClientRect();
  return rect.width >= 16 && rect.height >= 12;
}

/**
 * Resolve the Companion surface under a point.
 * Explicit `data-companion-surface` ancestors win over nested buttons/controls.
 */
export function findCompanionSurfaceAt(
  clientX: number,
  clientY: number,
): CompanionSurfaceRect | null {
  if (typeof document === "undefined") {
    return null;
  }

  const stack =
    typeof document.elementsFromPoint === "function"
      ? document.elementsFromPoint(clientX, clientY)
      : [];

  for (const el of stack) {
    if (!(el instanceof Element) || isCompanionChrome(el)) {
      continue;
    }

    // Prefer an explicitly declared surface in the ancestry.
    const declared = el.closest(`[${COMPANION_SURFACE_ATTR}]`);
    if (declared instanceof HTMLElement && isUsableSurface(declared)) {
      return toCompanionSurfaceRect(declared);
    }

    const surface = el.closest(COMPANION_SURFACE_SELECTOR);
    if (surface instanceof HTMLElement && isUsableSurface(surface)) {
      return toCompanionSurfaceRect(surface);
    }
  }

  return null;
}

/** Resolve a previously recorded perch by surface id. */
export function findCompanionSurfaceById(
  surfaceId: string | null | undefined,
): CompanionSurfaceRect | null {
  if (!surfaceId || typeof document === "undefined") {
    return null;
  }

  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(surfaceId)
      : surfaceId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const declared = document.querySelector(
    `[data-companion-surface-id="${escaped}"]`,
  );
  if (declared instanceof HTMLElement && isUsableSurface(declared)) {
    return toCompanionSurfaceRect(declared);
  }

  for (const surface of collectDeclaredCompanionSurfaces()) {
    if (surface.id === surfaceId) {
      return surface;
    }
  }

  return null;
}

/** All landable surfaces currently in the document (for fall perch tests). */
export function collectDeclaredCompanionSurfaces(): CompanionSurfaceRect[] {
  if (typeof document === "undefined") {
    return [];
  }

  const nodes = document.querySelectorAll(COMPANION_SURFACE_SELECTOR);
  const surfaces: CompanionSurfaceRect[] = [];
  const seen = new Set<HTMLElement>();

  for (const node of nodes) {
    if (!(node instanceof HTMLElement) || isCompanionChrome(node)) {
      continue;
    }
    if (seen.has(node) || !isUsableSurface(node)) {
      continue;
    }

    const rect = node.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      continue;
    }

    seen.add(node);
    surfaces.push(toCompanionSurfaceRect(node));
  }

  return surfaces;
}

export function setCompanionSurfaceHighlight(
  surface: CompanionSurfaceRect | null,
  previous: HTMLElement | null,
): HTMLElement | null {
  if (previous && previous !== surface?.element) {
    previous.removeAttribute(COMPANION_SURFACE_ACTIVE_ATTR);
  }

  if (!surface) {
    return null;
  }

  surface.element.setAttribute(COMPANION_SURFACE_ACTIVE_ATTR, "");
  return surface.element;
}

export function clearCompanionSurfaceHighlight(el: HTMLElement | null) {
  el?.removeAttribute(COMPANION_SURFACE_ACTIVE_ATTR);
}
