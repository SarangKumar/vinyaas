"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button/button";
import { Input } from "@/registry/new-york/ui/input/input";
import { Label } from "@/registry/new-york/ui/label/label";

export function MilestoneBlock() {
  return (
    <PlayBlock title="Set a new milestone">
      <form
        className="grid min-w-0 gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="play-goal-name">Goal Name</Label>
          <Input id="play-goal-name" defaultValue="Launch v1.0" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="play-goal-amount">Target Amount</Label>
          <Input id="play-goal-amount" defaultValue="$15,000" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="play-goal-date">Target Date</Label>
          <Input id="play-goal-date" defaultValue="Dec 2026" />
        </div>
        <div className="flex min-w-0 flex-col gap-2 pt-1">
          <Button type="submit" className="w-full">
            Create Goal
          </Button>
          <Button type="button" variant="ghost" className="w-full">
            Cancel
          </Button>
        </div>
      </form>
    </PlayBlock>
  );
}
