"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import { Separator } from "@/registry/new-york/ui/separator/separator";

export function PaymentConfirmationBlock() {
  const [sent, setSent] = useState(false);

  return (
    <PlayBlock title="Payment" description="Latest successful charge.">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">Payment successful</p>
          <p className="text-foreground mt-1 text-3xl font-semibold tracking-tight">
            $249.00
          </p>
        </div>
        <Badge>{sent ? "Receipt sent" : "Paid"}</Badge>
      </div>
      <Separator />
      <dl className="grid gap-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Method</dt>
          <dd className="text-right">Visa ···· 4242</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Invoice</dt>
          <dd className="font-mono text-xs">#INV-2048</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Billed to</dt>
          <dd className="truncate text-right">Ada Lovelace</dd>
        </div>
      </dl>
      <div className="flex min-w-0 flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => setSent(true)}>
          Download receipt
        </Button>
        <Button type="button" size="sm" variant="outline">
          View invoice
        </Button>
      </div>
    </PlayBlock>
  );
}
