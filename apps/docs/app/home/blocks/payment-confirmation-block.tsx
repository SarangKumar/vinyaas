"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";

export function PaymentConfirmationBlock() {
  const [sent, setSent] = useState(false);

  return (
    <PlayBlock title="Payment received">
      <div className="flex items-center justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight">₹4,800</p>
        <Badge>{sent ? "Receipt sent" : "Paid"}</Badge>
      </div>
      <dl className="grid gap-1 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Method</dt>
          <dd>Visa ·· 4242</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Reference</dt>
          <dd className="font-mono text-xs">txn_18m4</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => setSent(true)}>
          Email receipt
        </Button>
        <Button type="button" size="sm" variant="outline">
          View invoice
        </Button>
      </div>
    </PlayBlock>
  );
}
