"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Label } from "@/registry/new-york/ui/label/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select/native-select";
import { Separator } from "@/registry/new-york/ui/separator/separator";

export function PayoutThresholdBlock() {
  return (
    <PlayBlock title="Payout Threshold">
      <div className="grid min-w-0 gap-1.5">
        <Label htmlFor="play-payout-currency">Currency</Label>
        <NativeSelect
          id="play-payout-currency"
          aria-label="Currency"
          defaultValue="usd"
        >
          <NativeSelectOption value="usd">USD — US Dollar</NativeSelectOption>
          <NativeSelectOption value="eur">EUR — Euro</NativeSelectOption>
          <NativeSelectOption value="inr">
            INR — Indian Rupee
          </NativeSelectOption>
        </NativeSelect>
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
