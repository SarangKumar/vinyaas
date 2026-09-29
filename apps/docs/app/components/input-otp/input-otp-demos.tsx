"use client";

import { useRef, useState } from "react";

import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp";
import { Spinner } from "@/registry/new-york/ui/spinner";
import { toast } from "@/registry/new-york/ui/toast";

function Slots() {
  return (
    <>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </>
  );
}

export function VerificationCodeDemo() {
  const [value, setValue] = useState("");
  const [verifying, setVerifying] = useState(false);
  const verifyingRef = useRef(false);

  function verify(code: string) {
    if (verifyingRef.current || code.length !== 6) {
      return;
    }

    verifyingRef.current = true;
    setVerifying(true);
    toast.add({
      title: "Verification code",
      description: code,
      type: "success",
    });
    window.setTimeout(() => {
      verifyingRef.current = false;
      setVerifying(false);
    }, 1200);
  }

  return (
    <form
      className="grid max-w-sm gap-3 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        verify(value);
      }}
    >
      <Label htmlFor="otp">Verification code</Label>
      <InputOTP
        id="otp"
        length={6}
        value={value}
        aria-label="Verification code"
        onChange={setValue}
        onComplete={verify}
      >
        <Slots />
      </InputOTP>
      <Button type="submit" size="sm" className="gap-2" disabled={verifying}>
        {verifying ? <Spinner label="" /> : null}
        {verifying ? "Verifying" : "Verify"}
      </Button>
    </form>
  );
}
