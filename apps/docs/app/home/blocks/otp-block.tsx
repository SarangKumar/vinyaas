"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp/input-otp";

export function OtpBlock() {
  const [code, setCode] = useState("");

  return (
    <PlayBlock title="Verify email">
      <p className="text-muted-foreground text-sm">
        Enter the 6-digit code sent to ada@analytical.engine.
      </p>
      <InputOTP value={code} onChange={setCode} aria-label="Email code">
        <InputOTPGroup className="max-w-full flex-wrap">
          {Array.from({ length: 6 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <Badge variant="outline">
          {code.length === 6 ? "Ready" : "Waiting"}
        </Badge>
        <Button type="button" variant="ghost" size="sm">
          Resend code
        </Button>
      </div>
    </PlayBlock>
  );
}
