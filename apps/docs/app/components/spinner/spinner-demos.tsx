"use client";

import { useState } from "react";

import { Button } from "@/registry/new-york/ui/button";
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
      className="flex items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setPending(true);
        window.setTimeout(() => setPending(false), 1200);
      }}
    >
      <Button type="submit" className="gap-2" disabled={pending}>
        {pending ? <Spinner label="" /> : null}
        {pending ? "Saving" : "Save"}
      </Button>
    </form>
  );
}
