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
import { Separator } from "@/registry/new-york/ui/separator";

export function ProfileBlock() {
  return (
    <PlayBlock title="Profile" description="Public workspace identity.">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar className="size-12">
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium">Ada Lovelace</p>
            <Badge variant="secondary">Verified</Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Senior Product Designer
          </p>
          <p className="text-muted-foreground text-sm">San Francisco · UTC−7</p>
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Copy profile link</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <p className="text-muted-foreground text-xs">Last active 4 minutes ago</p>
      <div className="flex min-w-0 flex-wrap gap-2">
        <Button type="button" size="sm">
          Message
        </Button>
        <Button type="button" size="sm" variant="outline">
          View profile
        </Button>
      </div>
    </PlayBlock>
  );
}
