"use client";

import { useState } from "react";

import { Button } from "@/registry/new-york/ui/button/button";
import { Spinner } from "@/registry/new-york/ui/spinner/spinner";

export function SubmitSpinner() {
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
