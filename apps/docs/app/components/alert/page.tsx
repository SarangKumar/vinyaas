import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("alert");

function AlertCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" strokeLinecap="round" />
      <path d="M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}

const usage = `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Notice() {
  return (
    <Alert>
      <AlertTitle>Deployment complete</AlertTitle>
      <AlertDescription>Production is now running the latest build.</AlertDescription>
    </Alert>
  );
}
`;

const variantsCode = `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function AlertCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" strokeLinecap="round" />
      <path d="M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}

export function AlertVariants() {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row">
      <Alert className="max-w-md">
        <div className="flex items-start justify-between gap-3">
          <AlertTitle>Deployment complete</AlertTitle>
          <Badge variant="secondary">Production</Badge>
        </div>
        <AlertDescription>
          Production is now running the latest build.
        </AlertDescription>
        <Button variant="outline" className="mt-2 w-fit">
          View deployment
        </Button>
      </Alert>
      <Alert variant="destructive" className="max-w-md">
        <AlertCircleIcon />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your payment could not be processed. Please check your payment method
          and try again.
        </AlertDescription>
        <Button variant="outline" className="mt-2 w-fit">
          Try again
        </Button>
      </Alert>
    </div>
  );
}
`;

const billingCardCode = `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AlertCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" strokeLinecap="round" />
      <path d="M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}

export function BillingFailureCard() {
  return (
    <Card className="w-full max-w-md text-left">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Visa ending in 4242 · Renews Apr 1</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>
            We could not charge your card for the Pro plan. Update the payment
            method, then retry.
          </AlertDescription>
          <Button variant="outline" className="mt-2 w-fit">
            Retry payment
          </Button>
        </Alert>
      </CardContent>
    </Card>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "variant",
    type: '"default" | "destructive"',
    defaultValue: '"default"',
    description:
      "default is a neutral notice on a muted surface. destructive keeps that surface and uses danger text, icon, and border.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the alert, title, or description with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "variants",
    title: "Variants",
    description:
      "Default carries a status badge and action. Destructive keeps the muted surface and uses danger text, icon, and border.",
    preview: (
      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <Alert className="max-w-md text-left">
          <div className="flex items-start justify-between gap-3">
            <AlertTitle>Deployment complete</AlertTitle>
            <Badge variant="secondary">Production</Badge>
          </div>
          <AlertDescription>
            Production is now running the latest build.
          </AlertDescription>
          <Button variant="outline" className="mt-2 w-fit">
            View deployment
          </Button>
        </Alert>
        <Alert variant="destructive" className="max-w-md text-left">
          <AlertCircleIcon />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>
            Your payment could not be processed. Please check your payment
            method and try again.
          </AlertDescription>
          <Button variant="outline" className="mt-2 w-fit">
            Try again
          </Button>
        </Alert>
      </div>
    ),
    code: { tsx: variantsCode, jsx: variantsCode },
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A billing Card carries a destructive Alert when a charge fails. The retry action stays inside the notice.",
  preview: (
    <Card className="w-full max-w-md text-left">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Visa ending in 4242 · Renews Apr 1</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>
            We could not charge your card for the Pro plan. Update the payment
            method, then retry.
          </AlertDescription>
          <Button variant="outline" className="mt-2 w-fit">
            Retry payment
          </Button>
        </Alert>
      </CardContent>
    </Card>
  ),
  code: { tsx: billingCardCode, jsx: billingCardCode },
};

export default async function AlertPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/alert/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Alert"
      description="A notice for a status that should be announced."
      overview={
        <p>
          Alert is a container with <code>role=&quot;alert&quot;</code>. The
          title and description are paragraphs. Place an svg first when the
          notice needs an icon. Compose a badge or a button inside when it needs
          a status or an action.
        </p>
      }
      install="vinyaas add alert"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/alert/index.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <p>
          The root is an alert, so assistive technology can announce it. The
          title and description do not get extra roles. The icon is hidden from
          assistive technology. Destructive alerts keep the failure in the text
          and use danger color for the text, icon, and border.
        </p>
      }
      source={source}
    >
      <Alert className="max-w-md text-left">
        <AlertTitle>Deployment complete</AlertTitle>
        <AlertDescription>
          Production is now running the latest build.
        </AlertDescription>
      </Alert>
    </ComponentReference>
  );
}
