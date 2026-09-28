"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Alert, AlertTitle } from "@/registry/new-york/ui/alert/alert";
import { Button } from "@/registry/new-york/ui/button/button";
import { Separator } from "@/registry/new-york/ui/separator/separator";

export function InvoiceBlock() {
  const [paid, setPaid] = useState(false);

  return (
    <PlayBlock title="March invoice">
      <div className="flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight">₹12,400</p>
        <p className="text-muted-foreground text-xs">Due 28 Sep</p>
      </div>
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Studio plan</dt>
          <dd>₹9,600</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Extra seats</dt>
          <dd>₹2,800</dd>
        </div>
      </dl>
      <Separator />
      {paid ? (
        <Alert>
          <AlertTitle>Payment captured</AlertTitle>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertTitle>Card declined</AlertTitle>
        </Alert>
      )}
      <Button
        type="button"
        variant={paid ? "outline" : "default"}
        onClick={() => setPaid(true)}
        disabled={paid}
      >
        {paid ? "Paid" : "Retry payment"}
      </Button>
    </PlayBlock>
  );
}
