"use client";

import { PlayBlock } from "@/app/home/play-block";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/registry/new-york/ui/command/command";

export function CommandBlock() {
  return (
    <PlayBlock title="Jump to">
      <Command className="bg-secondary">
        <CommandInput aria-label="Jump to" placeholder="Search actions" />
        <CommandList>
          <CommandGroup heading="Workspace">
            <CommandItem value="Open billing">
              Open billing
              <CommandShortcut>B</CommandShortcut>
            </CommandItem>
            <CommandItem value="Invite teammate">
              Invite teammate
              <CommandShortcut>I</CommandShortcut>
            </CommandItem>
            <CommandItem value="View deploys">View deploys</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PlayBlock>
  );
}
