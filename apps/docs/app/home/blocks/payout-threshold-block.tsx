"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Label } from "@/registry/new-york/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import { Separator } from "@/registry/new-york/ui/separator";

export function PayoutThresholdBlock() {
  return (
    <PlayBlock title="Payout Threshold">
      <div className="grid min-w-0 gap-1.5">
        <Label htmlFor="play-payout-currency">Currency</Label>
        <Select defaultValue="usd">
          <SelectTrigger id="play-payout-currency" aria-label="Currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">USD — US Dollar</SelectItem>
            <SelectItem value="eur">EUR — Euro</SelectItem>
            <SelectItem value="inr">INR — Indian Rupee</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="flex min-w-0 items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Minimum Payout Amount</p>
          <p className="text-foreground mt-1 text-2xl font-semibold tracking-tight">
            $2,500.00
          </p>
        </div>
        <p className="text-muted-foreground text-xs">Updated 2d ago</p>
      </div>
    </PlayBlock>
  );
}
