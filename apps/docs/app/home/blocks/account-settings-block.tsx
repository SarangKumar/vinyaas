"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox/checkbox";
import { Input } from "@/registry/new-york/ui/input/input";
import { Label } from "@/registry/new-york/ui/label/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select/native-select";
import { Switch } from "@/registry/new-york/ui/switch/switch";

export function AccountSettingsBlock() {
  return (
    <PlayBlock title="Account">
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-1.5">
          <Label htmlFor="play-display">Display name</Label>
          <Input id="play-display" defaultValue="Ada Lovelace" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="play-locale">Locale</Label>
          <NativeSelect id="play-locale" defaultValue="en-IN">
            <NativeSelectOption value="en-IN">
              English (India)
            </NativeSelectOption>
            <NativeSelectOption value="en-US">English (US)</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="play-digest">Weekly digest</Label>
          <Switch id="play-digest" defaultChecked />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="play-public" defaultChecked />
          <Label htmlFor="play-public">Show profile in the directory</Label>
        </div>
        <Button type="submit" size="sm">
          Save account
        </Button>
      </form>
    </PlayBlock>
  );
}
