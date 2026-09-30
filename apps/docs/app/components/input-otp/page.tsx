import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import { VerificationCodeDemo } from "./input-otp-demos";

export const metadata: Metadata = componentPageMetadata("input-otp");

function Slots({ length, split }: { length: number; split?: boolean }) {
  const indexes = Array.from({ length }, (_, index) => index);
  const midpoint = Math.ceil(length / 2);

  if (!split) {
    return (
      <InputOTPGroup>
        {indexes.map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    );
  }

  return (
    <>
      <InputOTPGroup>
        {indexes.slice(0, midpoint).map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {indexes.slice(midpoint).map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </>
  );
}

const usage = `import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

export function Code() {
  return (
    <InputOTP length={6} aria-label="Verification code">
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
    </InputOTP>
  );
}
`;

const verificationCode = `import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

export function VerificationCode() {
  const [value, setValue] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [resending, setResending] = useState(false);

  function verify(code: string) {
    if (verifying || code.length !== 6) {
      return;
    }

    setVerifying(true);
    setStatus("idle");
    window.setTimeout(() => {
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
      className="grid max-w-sm gap-4"
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
        onChange={(next) => {
          setValue(next);
          if (status !== "idle") {
            setStatus("idle");
          }
        }}
        onComplete={verify}
      >
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
      </InputOTP>
      {status === "error" ? (
        <p className="text-destructive text-sm" role="alert">
          That code is incorrect. Try again or resend a new one.
        </p>
      ) : null}
      {status === "success" ? (
        <p className="text-muted-foreground text-sm" role="status">
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
`;

const api: ApiRow[] = [
  {
    prop: "length",
    type: "number",
    description: "How many digits the field accepts. Defaults to 6.",
  },
  {
    prop: "value",
    type: "string",
    description: "Controlled digits. Non-digits are ignored.",
  },
  {
    prop: "onChange",
    type: "(value: string) => void",
    description: "Called with the cleaned digit string.",
  },
  {
    prop: "onComplete",
    type: "(value: string) => void",
    description:
      "Called once when the value reaches length. Fires again after a digit is removed and the code is completed again. Does not fire while disabled.",
  },
  {
    prop: "invalid",
    type: "boolean",
    description: "Sets aria-invalid and the destructive slot border.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "pin",
    title: "PIN",
    description: "A shorter code uses the same slots with length 4.",
    preview: (
      <InputOTP length={4} aria-label="PIN">
        <Slots length={4} />
      </InputOTP>
    ),
    code: usage,
  },
  {
    id: "invalid",
    title: "Invalid",
    description: "invalid marks the field and the slots.",
    preview: (
      <InputOTP length={6} invalid defaultValue="123" aria-label="Invalid code">
        <Slots length={6} split />
      </InputOTP>
    ),
    code: usage,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "A disabled code cannot be edited.",
    preview: (
      <InputOTP
        length={6}
        disabled
        defaultValue="123456"
        aria-label="Disabled code"
      >
        <Slots length={6} split />
      </InputOTP>
    ),
    code: usage,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Confirm a sign-in email with a six-digit code, Verify, Resend, and success or error copy.",
  preview: <VerificationCodeDemo />,
  code: verificationCode,
};

export default async function InputOTPPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/input-otp/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Input OTP"
      description="A one-time code made of grouped digit slots."
      overview={
        <p>
          One native input holds the digits, so paste, arrows, and backspace
          stay with the browser. The slots are visual. Set <code>name</code>{" "}
          when the value should submit with a form. Use <code>onComplete</code>{" "}
          to react when every digit is filled.
        </p>
      }
      install="vinyaas add input-otp"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/input-otp/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>The input is named with aria-label or a label and id.</li>
          <li>Slots are hidden from assistive technology.</li>
          <li>invalid sets aria-invalid.</li>
          <li>Paste fills the digits from the clipboard.</li>
        </ul>
      }
      source={source}
    >
      <InputOTP length={6} aria-label="Verification code">
        <Slots length={6} split />
      </InputOTP>
    </ComponentReference>
  );
}
