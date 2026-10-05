"use client";

import { PlayBlock } from "@/app/home/play-block";
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

export function SelectBlock() {
  return (
    <PlayBlock
      title="Select"
      description="Searchable timezone picker with grouped options."
    >
      <div className="grid gap-2">
        <Label htmlFor="home-timezone">Timezone</Label>
        <Select defaultValue="ist">
          <SelectTrigger id="home-timezone" className="w-full">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent searchPlaceholder="Search timezones">
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
    </PlayBlock>
  );
}
