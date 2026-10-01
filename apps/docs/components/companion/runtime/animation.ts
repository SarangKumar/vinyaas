/**
 * Animation controller driven by companion metadata clips.
 */

import {
  defaultClipLoop,
  resolveClipDefinition,
  type CompanionAnimationsDefinition,
  type CompanionAnimationClipDefinition,
} from "@/components/companion/runtime/schema";

export type AnimationControllerState = {
  clipId: string;
  frameIndex: number;
  elapsedInFrameMs: number;
  loop: boolean;
  fps: number;
  frameCount: number;
  /** True when a one-shot clip finished its last frame. */
  finished: boolean;
};

export function createAnimationController(
  clipId: string,
  clip: CompanionAnimationClipDefinition,
): AnimationControllerState {
  return {
    clipId,
    frameIndex: 0,
    elapsedInFrameMs: 0,
    loop: clip.loop ?? defaultClipLoop(clipId),
    fps: clip.fps ?? 5,
    frameCount: Math.max(1, clip.frames.length),
    finished: false,
  };
}

export function frameIntervalMs(fps: number) {
  return Math.max(50, Math.round(1000 / Math.max(1, fps)));
}

export function nextAnimationFrameIndex(
  current: number,
  frameCount: number,
  loop: boolean,
): { index: number; finished: boolean } {
  if (frameCount <= 0) {
    return { index: 0, finished: true };
  }

  if (current + 1 < frameCount) {
    return { index: current + 1, finished: false };
  }

  if (loop) {
    return { index: 0, finished: false };
  }

  return { index: current, finished: true };
}

/**
 * Advance the animation clock. Returns a new controller state.
 */
export function tickAnimation(
  current: AnimationControllerState,
  dtMs: number,
): AnimationControllerState {
  if (current.finished) {
    return current;
  }

  if (current.frameCount <= 1 && !current.loop) {
    return { ...current, finished: true };
  }

  if (current.frameCount <= 1) {
    return current;
  }

  let elapsed = current.elapsedInFrameMs + dtMs;
  let frameIndex = current.frameIndex;
  let finished: boolean = current.finished;
  const interval = frameIntervalMs(current.fps);

  while (elapsed >= interval && !finished) {
    elapsed -= interval;
    const next = nextAnimationFrameIndex(
      frameIndex,
      current.frameCount,
      current.loop,
    );
    frameIndex = next.index;
    finished = next.finished;
  }

  return {
    ...current,
    frameIndex,
    elapsedInFrameMs: finished ? 0 : elapsed,
    finished,
  };
}

export function playAnimationClip(
  animations: CompanionAnimationsDefinition,
  clipId: string,
  fallbackClipId = "idle",
): AnimationControllerState {
  const preferred = resolveClipDefinition(animations, clipId);
  const fallback = resolveClipDefinition(animations, fallbackClipId);
  const clip = preferred ?? fallback;

  if (!clip) {
    return createAnimationController("idle", {
      frames: ["assets/idle.png"],
      fps: 5,
      loop: true,
    });
  }

  const resolvedId = preferred ? clipId : fallbackClipId;
  return createAnimationController(resolvedId, clip);
}

export function selectAnimationClipId(
  animations: CompanionAnimationsDefinition,
  preferred: string,
  fallback = "idle",
): string {
  if (resolveClipDefinition(animations, preferred)) {
    return preferred;
  }
  if (resolveClipDefinition(animations, fallback)) {
    return fallback;
  }
  const first = Object.keys(animations)[0];
  return first ?? "idle";
}
