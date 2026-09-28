"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar/avatar";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area/scroll-area";
import { Textarea } from "@/registry/new-york/ui/textarea/textarea";

export function MessagesBlock() {
  return (
    <PlayBlock title="Notes thread">
      <ScrollArea className="max-h-40">
        <div className="flex items-start gap-3 pr-2">
          <Avatar className="size-8">
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <div className="bg-secondary min-w-0 rounded-md px-3 py-2">
            <p className="text-sm">The compiler patch is ready for review.</p>
            <p className="text-muted-foreground mt-1 text-xs">9:41</p>
          </div>
        </div>
      </ScrollArea>
      <Badge variant="outline">Grace Hopper</Badge>
      <form
        className="grid min-w-0 gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <Textarea aria-label="Message" placeholder="Reply" rows={2} />
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            Send
          </Button>
        </div>
      </form>
    </PlayBlock>
  );
}
