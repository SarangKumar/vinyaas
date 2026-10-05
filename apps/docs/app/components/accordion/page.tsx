import { readFile } from "node:fs/promises";
import path from "node:path";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Label } from "@/registry/new-york/ui/label";
import { Switch } from "@/registry/new-york/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york/ui/accordion";
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

export const metadata: Metadata = componentPageMetadata("accordion");

const usage = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <Accordion type="single" collapsible defaultValue="what">
      <AccordionItem value="what">
        <AccordionTrigger>What is Vinyaas?</AccordionTrigger>
        <AccordionContent>
          A source-installed component library.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
`;

const billingFaqCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BillingFaq() {
  return (
    <Card className="w-full max-w-md gap-0 p-0 text-left">
      <CardHeader className="gap-1.5 px-4 pt-4 pb-3">
        <CardTitle className="text-base">Subscription & Billing</CardTitle>
        <CardDescription>
          Common questions about your account, plans, payments and
          cancellations.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-0 px-0 pb-1">
        <Accordion
          type="single"
          collapsible
          defaultValue="plans"
          className="border-0"
        >
          <AccordionItem value="plans">
            <AccordionTrigger>What subscription plans do you offer?</AccordionTrigger>
            <AccordionContent>
              We offer three subscription tiers: Starter, Pro, and Business.
              Each plan includes a different mix of billing cycles, storage,
              API access, and support response times.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="billing">
            <AccordionTrigger>How does billing work?</AccordionTrigger>
            <AccordionContent>
              Plans renew automatically at the end of each billing period. You
              can switch between monthly and yearly pricing from account
              settings at any time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cancel">
            <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
            <AccordionContent>
              Cancel from Billing in account settings. Access continues through
              the end of the current period, and you can resubscribe whenever
              you are ready.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "type",
    type: '"single" | "multiple"',
    defaultValue: '"single"',
    description: "single keeps one item open. multiple allows several.",
  },
  {
    prop: "value",
    type: "string | string[]",
    description:
      "Controlled open item, or the list of open items when type is multiple.",
  },
  {
    prop: "defaultValue",
    type: "string | string[]",
    description: "The item or items open on first render.",
  },
  {
    prop: "collapsible",
    type: "boolean",
    defaultValue: "true",
    description: "When type is single, allows the open item to close.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables the whole accordion, or one AccordionItem.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "faq",
    title: "FAQ",
    description: "One answer is open. Opening another closes the first.",
    preview: (
      <Accordion
        type="single"
        collapsible
        defaultValue="what"
        className="w-full max-w-md text-left"
      >
        <AccordionItem value="what">
          <AccordionTrigger>What is Vinyaas?</AccordionTrigger>
          <AccordionContent>
            Vinyaas copies each component into your project as source.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="install">
          <AccordionTrigger>How does installation work?</AccordionTrigger>
          <AccordionContent>
            Run vinyaas init, then vinyaas add and the component name.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="source">
          <AccordionTrigger>Where does the source live?</AccordionTrigger>
          <AccordionContent>
            In your repository, under the path from components.json.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="customize">
          <AccordionTrigger>Can I customize the component?</AccordionTrigger>
          <AccordionContent>
            Yes. The installed file is yours to edit.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: usage,
  },
  {
    id: "settings",
    title: "Settings",
    description:
      "Several sections can stay open. Each panel holds a switch or a checkbox with its label.",
    preview: (
      <Accordion
        type="multiple"
        defaultValue={["notifications"]}
        className="w-full max-w-md text-left"
      >
        <AccordionItem value="notifications">
          <AccordionTrigger>Notifications</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center justify-between gap-3 py-1">
              <Label htmlFor="product-updates-example">Product updates</Label>
              <Switch id="product-updates-example" defaultChecked />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="email">
          <AccordionTrigger>Email</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2 py-1">
              <Checkbox id="activity-mail-example" defaultChecked />
              <Label htmlFor="activity-mail-example">
                Email me about activity
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SettingsAccordion() {
  return (
    <Accordion type="multiple" defaultValue={["notifications"]}>
      <AccordionItem value="notifications">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>
          <Label htmlFor="product-updates">Product updates</Label>
          <Switch id="product-updates" defaultChecked />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="email">
        <AccordionTrigger>Email</AccordionTrigger>
        <AccordionContent>
          <Checkbox id="activity-mail" defaultChecked />
          <Label htmlFor="activity-mail">Email me about activity</Label>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A billing FAQ inside a Card. The first question opens by default; the rest stay collapsed until selected.",
  preview: (
    <Card className="w-full max-w-md gap-0 p-0 text-left">
      <CardHeader className="gap-1.5 px-4 pt-4 pb-3">
        <CardTitle className="text-base">Subscription & Billing</CardTitle>
        <CardDescription>
          Common questions about your account, plans, payments and
          cancellations.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-0 px-0 pb-1">
        <Accordion
          type="single"
          collapsible
          defaultValue="plans"
          className="border-0"
        >
          <AccordionItem value="plans">
            <AccordionTrigger>
              What subscription plans do you offer?
            </AccordionTrigger>
            <AccordionContent>
              We offer three subscription tiers: Starter, Pro, and Business.
              Each plan includes a different mix of billing cycles, storage, API
              access, and support response times.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="billing">
            <AccordionTrigger>How does billing work?</AccordionTrigger>
            <AccordionContent>
              Plans renew automatically at the end of each billing period. You
              can switch between monthly and yearly pricing from account
              settings at any time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cancel">
            <AccordionTrigger>
              How do I cancel my subscription?
            </AccordionTrigger>
            <AccordionContent>
              Cancel from Billing in account settings. Access continues through
              the end of the current period, and you can resubscribe whenever
              you are ready.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  ),
  code: { tsx: billingFaqCode, jsx: billingFaqCode },
};

export default async function AccordionPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/accordion/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Accordion"
      description="A stack of sections that expand and collapse."
      overview={
        <p>
          Each trigger is a button. <code>type=&quot;single&quot;</code> keeps
          one section open. <code>type=&quot;multiple&quot;</code> allows
          several. Arrow keys move between triggers.
        </p>
      }
      install="vinyaas add accordion"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/accordion/index.tsx</code> and copy{" "}
          <code>accordion.css</code> beside it. It imports <code>cn</code> from{" "}
          <code>@/lib/utils</code>. The project also needs <code>clsx</code> and{" "}
          <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The trigger uses <code>aria-expanded</code> and{" "}
            <code>aria-controls</code>. The panel uses the matching id. A
            disabled item is a disabled button.
          </p>
          <ul className="list-disc pl-5">
            <li>Enter and Space toggle the focused trigger.</li>
            <li>Arrow Up and Arrow Down move between triggers.</li>
            <li>Home and End move to the first and last enabled trigger.</li>
          </ul>
        </>
      }
      source={source}
    >
      <Accordion
        type="single"
        collapsible
        defaultValue="what"
        className="w-full max-w-md text-left"
      >
        <AccordionItem value="what">
          <AccordionTrigger>What is Vinyaas?</AccordionTrigger>
          <AccordionContent>
            Vinyaas copies each component into your project as source.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ComponentReference>
  );
}
