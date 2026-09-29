"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";

export function SignupBlock() {
  return (
    <PlayBlock
      title="Create an account"
      description="Open a workspace for your team."
    >
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-1.5">
          <Label htmlFor="play-name">Name</Label>
          <Input id="play-name" defaultValue="Ada Lovelace" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="play-signup-email">Work email</Label>
          <Input
            id="play-signup-email"
            type="email"
            defaultValue="ada@analytical.engine"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="play-signup-password">Password</Label>
          <Input
            id="play-signup-password"
            type="password"
            defaultValue="notes"
          />
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="play-terms" />
          <Label htmlFor="play-terms">I agree to the workspace terms</Label>
        </div>
        <Button type="submit">Create account</Button>
        <Button type="button" variant="outline">
          Continue with GitHub
        </Button>
      </form>
    </PlayBlock>
  );
}
