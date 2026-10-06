"use client";

import { useSyncExternalStore } from "react";

import {
  getShowcaseColumnCount,
  type ShowcaseColumnCount,
} from "./playground-layout";

const MEDIA_QUERIES = [
  `(min-width: 1900px)`,
  `(min-width: 1400px)`,
  `(min-width: 1024px)`,
  `(min-width: 768px)`,
] as const;

function subscribe(onStoreChange: () => void) {
  const media = MEDIA_QUERIES.map((query) => window.matchMedia(query));

  for (const mq of media) {
    mq.addEventListener("change", onStoreChange);
  }
  window.addEventListener("resize", onStoreChange);

  return () => {
    for (const mq of media) {
      mq.removeEventListener("change", onStoreChange);
    }
    window.removeEventListener("resize", onStoreChange);
  };
}

function getSnapshot(): ShowcaseColumnCount {
  return getShowcaseColumnCount(window.innerWidth);
}

/** SSR / first paint — mid laptop (3 cols) until the client measures. */
function getServerSnapshot(): ShowcaseColumnCount {
  return 3;
}

/** Active homepage showcase column count (1→2→3→4→5 with the grid ladder). */
export function useShowcaseColumnCount(): ShowcaseColumnCount {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
