"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox/checkbox";
import { Input } from "@/registry/new-york/ui/input/input";
import { Label } from "@/registry/new-york/ui/label/label";
import { toast } from "@/registry/new-york/ui/toast/toast";

export function LoginBlock() {
  const [visible, setVisible] = useState(false);

  return (
    <PlayBlock title="Sign in">
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          toast.add({ title: "Signed in", description: "Welcome back, Ada." });
        }}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="play-email">Email</Label>
          <Input
            id="play-email"
            type="email"
            autoComplete="username"
            defaultValue="ada@analytical.engine"
          />
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="play-password">Password</Label>
            <button
              type="button"
              className="text-muted-foreground text-xs underline-offset-2 hover:underline"
            >
              Forgot password
            </button>
          </div>
          <Input
            id="play-password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            defaultValue="notes"
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
        <Button type="submit">Sign in</Button>
      </form>
    </PlayBlock>
  );
}
