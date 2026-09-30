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
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [resending, setResending] = useState(false);
  const verifyingRef = useRef(false);

  function verify(code: string) {
    if (verifyingRef.current || code.length !== 6) {
      return;
    }

    verifyingRef.current = true;
    setVerifying(true);
    setStatus("idle");

    window.setTimeout(() => {
      verifyingRef.current = false;
      setVerifying(false);
      if (code === "000000") {
        setStatus("error");
        return;
      }
      setStatus("success");
      toast.add({
        title: "Device verified",
        description: "You can continue to your account.",
        type: "success",
      });
    }, 1200);
  }

  function resend() {
    if (resending || verifying) {
      return;
    }
    setResending(true);
    setStatus("idle");
    setValue("");
    window.setTimeout(() => {
      setResending(false);
      toast.add({
        title: "Code sent",
        description: "Check ada@analytical.engine for a new code.",
        type: "success",
      });
    }, 900);
  }

  return (
    <form
      className="grid w-full max-w-sm gap-4 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        verify(value);
      }}
    >
      <div className="grid gap-1">
        <Label htmlFor="otp">Verification code</Label>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code sent to ada@analytical.engine.
        </p>
      </div>
      <InputOTP
        id="otp"
        length={6}
        value={value}
        invalid={status === "error"}
        aria-label="Verification code"
        aria-describedby={
          status === "error"
            ? "otp-error"
            : status === "success"
              ? "otp-success"
              : undefined
        }
        onChange={(next) => {
          setValue(next);
          if (status !== "idle") {
            setStatus("idle");
          }
        }}
        onComplete={verify}
      >
        <Slots />
      </InputOTP>
      {status === "error" ? (
        <p id="otp-error" className="text-destructive text-sm" role="alert">
          That code is incorrect. Try again or resend a new one.
        </p>
      ) : null}
      {status === "success" ? (
        <p
          id="otp-success"
          className="text-muted-foreground text-sm"
          role="status"
        >
          Device verified. You can continue.
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button type="submit" size="sm" className="gap-2" disabled={verifying}>
          {verifying ? <Spinner label="" /> : null}
          {verifying ? "Verifying" : "Verify"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="gap-2"
          disabled={resending || verifying}
          onClick={resend}
        >
          {resending ? <Spinner label="" /> : null}
          {resending ? "Sending" : "Resend code"}
        </Button>
      </div>
    </form>
  );
}
