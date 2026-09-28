import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert/alert";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
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

const usage = `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert/alert";

export function Notice() {
  return (
    <Alert>
      <AlertTitle>Deployment complete</AlertTitle>
      <AlertDescription>Production is now running the latest build.</AlertDescription>
    </Alert>
  );
}
`;

const successCode = `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert/alert";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";

export function DeploymentAlert() {
  return (
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
  );
}
`;

const failedCode = `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert/alert";
import { Button } from "@/components/ui/button/button";

function AlertCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" strokeLinecap="round" />
      <path d="M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}

export function PaymentAlert() {
  return (
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
    id: "deployment",
    title: "Deployment",
    description:
      "A status badge and an action sit with the notice. The alert does not own the icon or the button.",
    preview: (
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
    ),
    code: successCode,
  },
  {
    id: "payment-failed",
    title: "Payment failed",
    description:
      "The first svg is the icon. Destructive alerts keep the muted surface and use danger text, icon, and border. The action picks up that color.",
    preview: (
      <Alert variant="destructive" className="max-w-md text-left">
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
    ),
    code: failedCode,
  },
];

export default async function AlertPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/alert/alert.tsx"),
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
          <code>components/ui/alert/alert.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
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
