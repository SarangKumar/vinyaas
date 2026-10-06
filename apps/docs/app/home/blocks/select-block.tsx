"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";

/**
 * Compact timezone picker with a single action — stays light in the masonry.
 */
export function SelectBlock() {
  return (
    <PlayBlock
      title="Timezone"
      description="Choose a default timezone for the workspace."
    >
      <div className="grid gap-2">
        <Label htmlFor="home-timezone">Timezone</Label>
        <Select defaultValue="ist">
          <SelectTrigger id="home-timezone" className="w-full">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Americas</SelectLabel>
              <SelectItem value="est">Eastern (EST)</SelectItem>
              <SelectItem value="cst">Central (CST)</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Asia</SelectLabel>
              <SelectItem value="ist">India (IST)</SelectItem>
              <SelectItem value="jst">Japan (JST)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button type="button" size="sm" className="w-fit">
        Save preference
      </Button>
    </PlayBlock>
  );
}
