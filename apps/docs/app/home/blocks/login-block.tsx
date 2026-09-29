"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Separator } from "@/registry/new-york/ui/separator";
import { toast } from "@/registry/new-york/ui/toast";

export function LoginBlock() {
  const [visible, setVisible] = useState(false);

  return (
    <PlayBlock title="Sign in" description="Email, password, or OAuth.">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          toast.add({ title: "Signed in", description: "Welcome back, Ada." });
        }}
      >
        <div className="grid gap-2">
          <Button type="button" variant="outline" className="w-full">
            Continue with Google
          </Button>
          <Button type="button" variant="outline" className="w-full">
            Continue with GitHub
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">or email</span>
          <Separator className="flex-1" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="play-email">Email</Label>
          <Input
            id="play-email"
            type="email"
            autoComplete="username"
            defaultValue="ada@analytical.engine"
            className="max-w-full min-w-0"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <Label htmlFor="play-password">Password</Label>
            <button
              type="button"
              className="text-muted-foreground shrink-0 text-xs underline-offset-2 hover:underline"
            >
              Forgot password
            </button>
          </div>
          <Input
            id="play-password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            defaultValue="notes"
            className="max-w-full min-w-0"
          />
          <button
            type="button"
            className="text-muted-foreground justify-self-start text-xs"
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? "Hide password" : "Show password"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="play-remember" defaultChecked />
          <Label htmlFor="play-remember">Remember this device</Label>
        </div>
        <Button type="submit" className="w-full">
          Sign in with email
        </Button>
      </form>
    </PlayBlock>
  );
}
