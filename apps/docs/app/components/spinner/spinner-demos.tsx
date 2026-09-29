"use client";

import { useState } from "react";

import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Spinner } from "@/registry/new-york/ui/spinner";

export function SubmitSpinner() {
  const [pending, setPending] = useState(false);

  return (
    <Button
      type="button"
      className="gap-2"
      disabled={pending}
      onClick={() => {
        setPending(true);
        window.setTimeout(() => setPending(false), 1200);
      }}
    >
      {pending ? <Spinner label="" /> : null}
      {pending ? "Saving changes" : "Save changes"}
    </Button>
  );
}

export function FormSubmitSpinner() {
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid w-full max-w-sm gap-4 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        setPending(true);
        window.setTimeout(() => setPending(false), 1200);
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="spinner-display-name">Display name</Label>
        <Input
          id="spinner-display-name"
          defaultValue="Ada Lovelace"
          disabled={pending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="spinner-email">Email</Label>
        <Input
          id="spinner-email"
          type="email"
          defaultValue="ada@analytical.engine"
          disabled={pending}
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" className="gap-2" disabled={pending}>
          {pending ? <Spinner label="" /> : null}
          {pending ? "Saving" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" disabled={pending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
