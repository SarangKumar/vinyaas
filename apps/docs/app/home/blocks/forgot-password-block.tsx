"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { toast } from "@/registry/new-york/ui/toast";

export function ForgotPasswordBlock() {
  return (
    <PlayBlock title="Reset password">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          toast.add({
            title: "Reset link sent",
            description: "Check ada@analytical.engine.",
          });
        }}
      >
        <p className="text-muted-foreground text-sm leading-6">
          We will email a link that expires in 30 minutes.
        </p>
        <div className="grid gap-1.5">
          <Label htmlFor="play-reset-email">Email</Label>
          <Input
            id="play-reset-email"
            type="email"
            autoComplete="username"
            defaultValue="ada@analytical.engine"
          />
        </div>
        <Button type="submit">Send reset link</Button>
      </form>
    </PlayBlock>
  );
}
