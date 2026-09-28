"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button/button";
import { Spinner } from "@/registry/new-york/ui/spinner/spinner";
import { Textarea } from "@/registry/new-york/ui/textarea/textarea";

export function ChatBlock() {
  return (
    <PlayBlock>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h2 className="text-foreground text-sm font-medium tracking-tight">
          New Chat
        </h2>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-label="Refresh chat"
        >
          Refresh
        </Button>
      </div>
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 py-6 text-center">
        <div className="border-border bg-muted flex size-10 items-center justify-center rounded-full border">
          <Spinner className="size-4" />
        </div>
        <p className="text-foreground text-sm font-medium">
          How can I help you today?
        </p>
        <p className="text-muted-foreground max-w-[16rem] text-xs leading-5">
          Ask about components, installation, or how to compose a form.
        </p>
      </div>
      <form
        className="grid min-w-0 gap-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <Textarea
          aria-label="Chat message"
          placeholder="Message Vinyaas…"
          rows={2}
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
