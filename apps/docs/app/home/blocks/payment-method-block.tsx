"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu/dropdown-menu";

export function PaymentMethodBlock() {
  return (
    <PlayBlock title="Payment method">
      <div className="flex min-w-0 items-center gap-3">
        <div className="bg-secondary text-secondary-foreground grid size-10 shrink-0 place-items-center rounded-md text-xs font-medium">
          Visa
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Ada Lovelace</p>
          <p className="text-muted-foreground font-mono text-xs">···· 4242</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          Default
        </Badge>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Card actions"
          >
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit card</DropdownMenuItem>
          <DropdownMenuItem>Remove card</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </PlayBlock>
  );
}
