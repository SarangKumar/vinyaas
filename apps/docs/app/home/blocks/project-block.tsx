"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { Progress } from "@/registry/new-york/ui/progress";

export function ProjectBlock() {
  const progress = 68;

  return (
    <PlayBlock title="Analytical Engine">
      <div className="flex items-center justify-between gap-2">
        <Badge>On track</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              type="button"
              size="sm"
              variant="outline"
              aria-label="Project actions"
            >
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid min-w-0 gap-1.5">
        <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
          <span>Progress</span>
          <span className="text-foreground tabular-nums">{progress}%</span>
        </div>
        <Progress
          aria-label="Project progress"
          value={progress}
          max={100}
          className="w-full min-w-0"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex -space-x-2">
          {["AL", "GH", "PS"].map((initials) => (
            <Avatar key={initials} className="size-7 border-2">
              <AvatarFallback className="text-[10px]">
                {initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <Button type="button" size="sm">
          Open project
        </Button>
      </div>
    </PlayBlock>
  );
}
