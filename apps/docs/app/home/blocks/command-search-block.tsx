"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/registry/new-york/ui/command";
import { Kbd } from "@/registry/new-york/ui/kbd";

export function CommandSearchBlock() {
  return (
    <PlayBlock
      title="Search"
      description="Jump to pages, components, and commands."
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Badge variant="outline">Recent</Badge>
        <span className="text-muted-foreground text-xs">
          Press <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </div>
      <Command className="bg-secondary border-border rounded-md border">
        <CommandInput
          aria-label="Search components"
          placeholder="Search components and pages"
        />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Recent pages">
            <CommandItem value="Button docs">
              Button docs
              <CommandShortcut>B</CommandShortcut>
            </CommandItem>
            <CommandItem value="Installation">
              Installation
              <CommandShortcut>I</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Commands">
            <CommandItem value="Copy install command">
              Copy install command
            </CommandItem>
            <CommandItem value="Toggle theme">Toggle theme</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PlayBlock>
  );
}
