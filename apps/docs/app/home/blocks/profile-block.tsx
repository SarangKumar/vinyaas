"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar/avatar";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu/dropdown-menu";

export function ProfileBlock() {
  return (
    <PlayBlock title="Profile">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Ada Lovelace</p>
          <p className="text-muted-foreground text-xs">
            Mathematician · London
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="Profile actions"
            >
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Copy profile link</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Badge variant="outline">Notes editor</Badge>
      <div className="flex gap-2">
        <Button type="button" size="sm">
          Message
        </Button>
        <Button type="button" size="sm" variant="outline">
          Follow
        </Button>
      </div>
    </PlayBlock>
  );
}
