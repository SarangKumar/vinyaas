"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import { frameIntervalMs } from "@/components/companion/runtime/animation";
import { nextAnimationFrameIndex } from "@/components/companion/companion-runtime";

type CompanionSpriteProps = {
  name: string;
  frames: StaticImageData[];
  fps?: number;
  size?: number;
  playing?: boolean;
  /** Controlled frame index from the runtime animation controller. */
  frameIndex?: number;
  className?: string;
  alt?: string;
};

/**
 * Generic pixel-art sprite renderer.
 * Can self-tick (showcase) or display a controlled frame from the runtime engine.
 */
export function CompanionSprite({
  name,
  frames,
  fps = 5,
  size = 72,
  playing = true,
  frameIndex: controlledFrame,
  className,
  alt,
}: CompanionSpriteProps) {
  const activeFrames = frames.length > 0 ? frames : [];
  const controlled = controlledFrame !== undefined;
  const framesKey = activeFrames.join("\0");
  const [frameIndex, setFrameIndex] = useState(0);
  const [framesEpoch, setFramesEpoch] = useState(framesKey);

  if (!controlled && framesEpoch !== framesKey) {
    setFramesEpoch(framesKey);
    setFrameIndex(0);
  }

  useEffect(() => {
    if (controlled || !playing || activeFrames.length <= 1) {
      return;
    }

    const id = window.setInterval(() => {
      setFrameIndex((current) =>
        nextAnimationFrameIndex(current, activeFrames.length),
      );
    }, frameIntervalMs(fps));

    return () => window.clearInterval(id);
  }, [activeFrames.length, controlled, fps, playing]);

  const index = controlled
    ? Math.min(controlledFrame, Math.max(0, activeFrames.length - 1))
    : frameIndex;
  const src = activeFrames[index] ?? activeFrames[0];

  if (!src) {
    return null;
  }

  return (
    <div
      data-companion-sprite={name.toLowerCase()}
      data-companion-frame={index}
      className={["inline-flex items-center justify-center", className]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt ?? name}
        width={size}
        height={size}
        unoptimized
        priority={false}
        className="h-full w-full select-none"
        style={{ imageRendering: "pixelated" }}
        draggable={false}
      />
    </div>
  );
}
