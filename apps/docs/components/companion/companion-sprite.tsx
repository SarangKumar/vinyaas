"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import {
  frameIntervalMs,
  nextAnimationFrameIndex,
} from "@/components/companion/companion-runtime";

type CompanionSpriteProps = {
  name: string;
  frames: StaticImageData[];
  fps?: number;
  size?: number;
  playing?: boolean;
  className?: string;
  alt?: string;
};

/**
 * Generic pixel-art sprite that cycles animation frames from companion metadata.
 */
export function CompanionSprite({
  name,
  frames,
  fps = 5,
  size = 72,
  playing = true,
  className,
  alt,
}: CompanionSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const activeFrames = frames.length > 0 ? frames : [];

  useEffect(() => {
    setFrameIndex(0);
  }, [frames]);

  useEffect(() => {
    if (!playing || activeFrames.length <= 1) {
      return;
    }

    const id = window.setInterval(() => {
      setFrameIndex((current) =>
        nextAnimationFrameIndex(current, activeFrames.length),
      );
    }, frameIntervalMs(fps));

    return () => window.clearInterval(id);
  }, [activeFrames.length, fps, playing]);

  const src = activeFrames[frameIndex] ?? activeFrames[0];

  if (!src) {
    return null;
  }

  return (
    <div
      data-companion-sprite={name.toLowerCase()}
      data-companion-frame={frameIndex}
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
