"use client";

import { PlayBlock } from "@/app/home/play-block";
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

/**
 * Compact command search — no app-shell header or navbar.
 */
export function CommandSearchBlock() {
  return (
    <PlayBlock title="Search" description="Jump to a page or run a command.">
      <p className="text-muted-foreground text-xs">
        Press <Kbd>⌘K</Kbd>
      </p>
      <Command className="bg-secondary border-border rounded-md border">
        <CommandInput
          aria-label="Search components"
          placeholder="Search components and pages"
        />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
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
