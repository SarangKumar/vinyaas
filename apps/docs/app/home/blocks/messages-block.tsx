"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Marker, MarkerContent } from "@/registry/new-york/ui/marker";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area";
import { Separator } from "@/registry/new-york/ui/separator";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { toast } from "@/registry/new-york/ui/toast";

export function MessagesBlock() {
  return (
    <PlayBlock
      title="Notes thread"
      description="Reply in context with a toast confirmation."
    >
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <ScrollArea className="max-h-40">
        <div className="flex items-start gap-3 pr-2">
          <Avatar className="size-8">
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <div className="bg-muted min-w-0 rounded-md px-3 py-2">
            <p className="text-sm">The compiler patch is ready for review.</p>
            <p className="text-muted-foreground mt-1 text-xs">9:41</p>
          </div>
        </div>
      </ScrollArea>
      <div className="flex min-w-0 items-center gap-2">
        <Badge variant="outline">Grace Hopper</Badge>
        <Separator orientation="vertical" />
        <p className="text-muted-foreground text-xs">1 unread</p>
      </div>
      <form
        className="grid min-w-0 gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          toast.add({
            title: "Reply sent",
            description: "Grace Hopper will be notified.",
            type: "success",
          });
        }}
      >
        <Textarea
          aria-label="Message"
          placeholder="Write a reply…"
          rows={3}
          defaultValue="Looks good — ship it after the docs pass."
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            Send
          </Button>
        </div>
      </form>
    </PlayBlock>
  );
}
