import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp/input-otp";
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

const usage = `import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp/input-otp";

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

import { Button } from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp/input-otp";
import { Spinner } from "@/components/ui/spinner/spinner";
import { toast } from "@/components/ui/toast/toast";

export function VerificationCode() {
  const [value, setValue] = useState("");
  const [verifying, setVerifying] = useState(false);

  function verify(code: string) {
    if (verifying || code.length !== 6) {
      return;
    }

    setVerifying(true);
    toast.add({
      title: "Verification code",
      description: code,
      type: "success",
    });
    window.setTimeout(() => setVerifying(false), 1200);
  }

  return (
    <form
      className="grid max-w-sm gap-3"
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
      <Button type="submit" size="sm" className="gap-2" disabled={verifying}>
        {verifying ? <Spinner label="" /> : null}
        {verifying ? "Verifying" : "Verify"}
      </Button>
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
    id: "otp",
    title: "Verification code",
    description:
      "Six digits, split into two groups. Completing the code submits it, shows a toast, and puts Verify into a verifying state.",
    preview: <VerificationCodeDemo />,
    code: verificationCode,
  },
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

export default async function InputOTPPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/input-otp/input-otp.tsx"),
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
          <code>components/ui/input-otp/input-otp.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
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
