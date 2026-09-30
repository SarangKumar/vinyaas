"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Label } from "@/registry/new-york/ui/label";
import { Slider } from "@/registry/new-york/ui/slider";
import { Switch } from "@/registry/new-york/ui/switch";

export function MediaControlsBlock() {
  const [volume, setVolume] = useState(64);
  const [brightness, setBrightness] = useState(72);

  return (
    <PlayBlock
      title="Studio controls"
      description="Primary track with a bordered thumb."
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Live preview</p>
          <p className="text-muted-foreground text-xs">Scene · Soft daylight</p>
        </div>
        <Badge variant="secondary">Recording</Badge>
      </div>
      <div className="border-border bg-muted/30 flex flex-col gap-4 rounded-xl border p-3.5">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="play-volume">Volume</Label>
            <span className="text-muted-foreground text-xs tabular-nums">
              {volume}%
            </span>
          </div>
          <Slider
            id="play-volume"
            aria-label="Volume"
            value={volume}
            onValueChange={setVolume}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="play-brightness">Brightness</Label>
            <span className="text-muted-foreground text-xs tabular-nums">
              {brightness}%
            </span>
          </div>
          <Slider
            id="play-brightness"
            aria-label="Brightness"
            value={brightness}
            onValueChange={setBrightness}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="play-noise">Noise reduction</Label>
          <Switch id="play-noise" defaultChecked />
        </div>
      </div>
    </PlayBlock>
  );
}
