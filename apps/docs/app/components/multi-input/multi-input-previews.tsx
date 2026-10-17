"use client";

import { useState } from "react";

import type { ControlValues } from "@/components/component-demo";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import { MultiInput } from "@/registry/new-york/ui/multi-input";

export function MultiInputPreview({ values }: { values: ControlValues }) {
  const max = Number(values.max);

  return (
    <MultiInput
      aria-label="Recipients"
      className="max-w-sm"
      defaultValue={["design", "engineering"]}
      placeholder={(values.placeholder as string) || "Add a team…"}
      max={Number.isFinite(max) && max > 0 ? max : undefined}
      disabled={values.disabled as boolean}
      invalid={values.invalid as boolean}
      allowDuplicates={values.allowDuplicates as boolean}
    />
  );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** `validate` is a function prop, so this preview has to live client-side. */
export function ValidatedDemo() {
  return (
    <MultiInput
      aria-label="Email recipients"
      className="max-w-sm"
      validate={(value) => EMAIL.test(value)}
      placeholder="ada@example.com"
    />
  );
}

export function InviteFormDemo() {
  const [emails, setEmails] = useState<string[]>(["ada@vinyaas.dev"]);

  return (
    <form
      className="grid w-full max-w-md gap-3 text-left"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Label htmlFor="practice-invite-emails">Invite teammates</Label>
      <MultiInput
        id="practice-invite-emails"
        name="emails"
        value={emails}
        onValueChange={setEmails}
        separators={[",", " "]}
        validate={(value) => EMAIL.test(value)}
        max={10}
        placeholder="ada@example.com"
      />
      <p className="text-muted-foreground text-sm">
        {emails.length} of 10 invites. Separate addresses with a comma or a
        space.
      </p>
      <Button type="submit" disabled={emails.length === 0}>
        Send invites
      </Button>
    </form>
  );
}
