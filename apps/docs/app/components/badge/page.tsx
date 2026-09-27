import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Spinner } from "@/registry/new-york/ui/spinner/spinner";

const usage = `import { Badge } from "@/components/ui/badge/badge";

export function Plan() {
  return <Badge>Pro</Badge>;
}
`;

const api: ApiRow[] = [
  {
    prop: "variant",
    type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"',
    defaultValue: '"default"',
    description: "Visual style.",
  },
  {
    prop: "className",
    type: "string",
    description:
      "Merged onto the badge. Use it to extend the base styles with Tailwind classes.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "external-link",
    title: "External link",
    description:
      "The link variant is visual. Wrap it in an anchor when the label should navigate.",
    preview: (
      <a
        href="https://vinyaas.vercel.app"
        target="_blank"
        rel="noreferrer"
        className="text-primary inline-flex rounded-md"
      >
        <Badge variant="link">
          Documentation
          <ExternalLinkIcon />
        </Badge>
      </a>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";

export function DocsLink() {
  return (
    <a href="https://vinyaas.vercel.app" target="_blank" rel="noreferrer">
      <Badge variant="link">
        Documentation
        <ExternalLinkIcon />
      </Badge>
    </a>
  );
}
`,
  },
  {
    id: "processing",
    title: "Processing",
    description:
      "Put Spinner inside a badge when a status is still in progress. The badge text is the accessible name, so the spinner label stays empty.",
    preview: (
      <Badge variant="secondary">
        <Spinner className="size-3" label="" />
        Processing
      </Badge>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";
import { Spinner } from "@/components/ui/spinner/spinner";

export function ProcessingStatus() {
  return (
    <Badge variant="secondary">
      <Spinner className="size-3" label="" />
      Processing
    </Badge>
  );
}
`,
  },
  {
    id: "custom-color",
    title: "Custom color",
    description:
      "Badge supplies the shape and type size. className replaces the color with your own Tailwind classes.",
    preview: <Badge className="bg-accent text-accent-foreground">Beta</Badge>,
    code: `import { Badge } from "@/components/ui/badge/badge";

export function BetaFlag() {
  return (
    <Badge className="bg-accent text-accent-foreground">Beta</Badge>
  );
}
`,
  },
  {
    id: "icon-left",
    title: "Icon on the left",
    description: "A leading icon can name the offer the badge describes.",
    preview: (
      <Badge>
        <GiftIcon />
        Claim offer
      </Badge>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";

export function Offer() {
  return (
    <Badge>
      <GiftIcon />
      Claim offer
    </Badge>
  );
}
`,
  },
  {
    id: "icon-right",
    title: "Icon on the right",
    description: "A trailing icon can show the action the label refers to.",
    preview: (
      <Badge variant="outline">
        Bookmark
        <BookmarkIcon />
      </Badge>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";

export function Saved() {
  return (
    <Badge variant="outline">
      Bookmark
      <BookmarkIcon />
    </Badge>
  );
}
`,
  },
  {
    id: "variants",
    title: "Variants",
    description:
      "Default, secondary, destructive, outline, ghost, and link cover status, quiet labels, and link-like text.",
    preview: (
      <>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </>
    ),
    code: `import { Badge } from "@/components/ui/badge/badge";

export function StatusLabels() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </>
  );
}
`,
  },
];

export default async function BadgePage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/badge/badge.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Badge"
      description="A compact label for status or category."
      overview={
        <>
          <p>
            Badge is an inline label. It does not handle clicks. Compose it with
            a link, a spinner, or an icon when the label needs more than text.
          </p>
          <p>
            <code>className</code> is merged after the variant, so Tailwind
            utilities can change the color without a new prop.
          </p>
        </>
      }
      install="vinyaas add badge"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/badge/badge.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>
            The text inside the badge is its name. It is not a button. Do not
            use color alone: the label should say the status.
          </p>
          <p>
            Span attributes are passed through. When the badge sits inside a
            link, the link is the control and the badge stays presentational.
          </p>
        </>
      }
      source={source}
    >
      <Badge variant="link">
        Documentation
        <ExternalLinkIcon />
      </Badge>
      <Badge variant="secondary">
        <Spinner className="size-3" label="" />
        Processing
      </Badge>
      <Badge>Default</Badge>
      <Badge variant="outline">Outline</Badge>
    </ComponentReference>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5A1.25 1.25 0 0 0 3.75 13.5h7.5a1.25 1.25 0 0 0 1.25-1.25V10" />
      <path d="M9 2.5h4.5V7" />
      <path d="M13.5 2.5 7.5 8.5" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2.5" y="7" width="11" height="6.5" rx="1" />
      <path d="M2.5 7h11V5.5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1V7Z" />
      <path d="M8 4.5v9" />
      <path d="M8 4.5c0-1.5-1.2-2.5-2.4-2.5S4 3.2 4.6 4.3C5.2 5.4 8 4.5 8 4.5Z" />
      <path d="M8 4.5c0-1.5 1.2-2.5 2.4-2.5S12 3.2 11.4 4.3C10.8 5.4 8 4.5 8 4.5Z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4.5 2.5h7v11l-3.5-2.2L4.5 13.5v-11Z" />
    </svg>
  );
}
