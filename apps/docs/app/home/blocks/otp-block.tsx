"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp";

export function OtpBlock() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"waiting" | "ready">("waiting");

  return (
    <PlayBlock title="Verify email">
      <p className="text-muted-foreground text-sm">
        Enter the 6-digit code sent to ada@analytical.engine.
      </p>
      <InputOTP
        value={code}
        onChange={(value) => {
          setCode(value);
          if (value.length < 6) {
            setStatus("waiting");
          }
        }}
        onComplete={() => setStatus("ready")}
        aria-label="Email code"
        className="max-w-full"
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <Badge variant="outline">
          {status === "ready" ? "Ready" : "Waiting"}
        </Badge>
        <Button type="button" variant="ghost" size="sm">
          Resend code
        </Button>
      </div>
    </PlayBlock>
  );
}
