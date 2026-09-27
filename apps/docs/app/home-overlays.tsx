"use client";

import { Button } from "@/registry/new-york/ui/button/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover/popover";
import { toast } from "@/registry/new-york/ui/toast/toast";
import { Tooltip } from "@/registry/new-york/ui/tooltip/tooltip";

export function HomeOverlays() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tooltip content="Installed as source">
        <Button type="button" variant="outline">
          Hint
        </Button>
      </Tooltip>
      <Popover>
        <PopoverTrigger>
          <Button type="button" variant="outline">
            Details
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Each component is copied into your project.</p>
        </PopoverContent>
      </Popover>
      <Button type="button" onClick={() => toast.add({ title: "Saved" })}>
        Notify
      </Button>
    </div>
  );
}
