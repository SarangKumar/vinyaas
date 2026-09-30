"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { toast } from "@/registry/new-york/ui/toast";

export function FeedbackBlock() {
  return (
    <PlayBlock
      title="Send feedback"
      description="Share a note with the product team."
    >
      <form
        className="grid min-w-0 gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          toast.add({
            title: "Feedback sent",
            description: "Thanks — we will review this shortly.",
            type: "success",
          });
        }}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="play-feedback">Message</Label>
          <Textarea
            id="play-feedback"
            aria-label="Feedback message"
            placeholder="What should we improve next?"
            rows={4}
            defaultValue="The homepage showcase makes it clear which components to reach for."
          />
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <Button type="submit" size="sm">
            Send feedback
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              toast.add({
                title: "Draft saved",
                description: "Your note is stored locally.",
                type: "info",
              })
            }
          >
            Save draft
          </Button>
        </div>
      </form>
    </PlayBlock>
  );
}
