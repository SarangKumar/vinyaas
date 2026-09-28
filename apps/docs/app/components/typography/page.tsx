import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  Typography,
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@/registry/new-york/ui/typography/typography";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("typography");

const usage = `import {
  Typography,
  TypographyH1,
  TypographyP,
} from "@/components/ui/typography/typography";

export function Article() {
  return (
    <Typography>
      <TypographyH1>Notes</TypographyH1>
      <TypographyP>Installed as source.</TypographyP>
    </Typography>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "className",
    type: "string",
    description:
      "Merged onto the element with cn. Each export renders its own semantic tag.",
  },
  {
    prop: "children",
    type: "ReactNode",
    description: "The text or nested content for that element.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "article",
    title: "Article",
    description: "A short article uses a title, a lead, body, and a list.",
    preview: (
      <Typography className="max-w-md text-left">
        <TypographyH3>Notes on the engine</TypographyH3>
        <TypographyLead>
          A short account of how the catalog is installed.
        </TypographyLead>
        <TypographyP>
          Each component is a source file in your repository.
        </TypographyP>
        <TypographyList>
          <li>Copy the file</li>
          <li>Install its packages</li>
        </TypographyList>
      </Typography>
    ),
    code: `<Typography>
  <TypographyH3>Notes on the engine</TypographyH3>
  <TypographyLead>A short account of how the catalog is installed.</TypographyLead>
  <TypographyP>Each component is a source file in your repository.</TypographyP>
  <TypographyList>
    <li>Copy the file</li>
    <li>Install its packages</li>
  </TypographyList>
</Typography>`,
  },
  {
    id: "product",
    title: "Product description",
    description: "A product name, price, and muted detail.",
    preview: (
      <Typography className="max-w-sm text-left">
        <TypographyH4>Studio plan</TypographyH4>
        <TypographyLarge>₹9,600 / month</TypographyLarge>
        <TypographyMuted>
          Billed annually. Seats can be added later.
        </TypographyMuted>
      </Typography>
    ),
    code: `<Typography>
  <TypographyH4>Studio plan</TypographyH4>
  <TypographyLarge>₹9,600 / month</TypographyLarge>
  <TypographyMuted>Billed annually. Seats can be added later.</TypographyMuted>
</Typography>`,
  },
  {
    id: "release",
    title: "Release notes",
    description: "A release heading, a paragraph, and a quote.",
    preview: (
      <Typography className="max-w-md text-left">
        <TypographyH2>v1.0.0</TypographyH2>
        <TypographyP>The catalog ships as source you can edit.</TypographyP>
        <TypographyBlockquote>
          Button remains the v0.1 primitive.
        </TypographyBlockquote>
        <TypographySmall>28 September 2026</TypographySmall>
      </Typography>
    ),
    code: `<Typography>
  <TypographyH2>v1.0.0</TypographyH2>
  <TypographyP>The catalog ships as source you can edit.</TypographyP>
  <TypographyBlockquote>Button remains the v0.1 primitive.</TypographyBlockquote>
  <TypographySmall>28 September 2026</TypographySmall>
</Typography>`,
  },
  {
    id: "message",
    title: "Message",
    description: "A message uses a name, body, and a muted time.",
    preview: (
      <Typography className="max-w-sm text-left">
        <TypographyH4>Priya Shah</TypographyH4>
        <TypographyP>The compiler patch is ready for review.</TypographyP>
        <TypographyMuted>9:41</TypographyMuted>
      </Typography>
    ),
    code: `<Typography>
  <TypographyH4>Priya Shah</TypographyH4>
  <TypographyP>The compiler patch is ready for review.</TypographyP>
  <TypographyMuted>9:41</TypographyMuted>
</Typography>`,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "A metric pairs a large value with a muted caption.",
    preview: (
      <Typography className="max-w-xs text-left">
        <TypographyH1>128</TypographyH1>
        <TypographyMuted>Signups in the last 7 days</TypographyMuted>
      </Typography>
    ),
    code: `<Typography>
  <TypographyH1>128</TypographyH1>
  <TypographyMuted>Signups in the last 7 days</TypographyMuted>
</Typography>`,
  },
  {
    id: "document",
    title: "Long-form document",
    description:
      "Headings, lead, body, ordered list, inline code, and muted metadata.",
    preview: (
      <Typography className="typeset-docs max-w-md text-left">
        <TypographyH2>Installing components</TypographyH2>
        <TypographyLead>
          Copy source into the repository, then edit it like any other file.
        </TypographyLead>
        <TypographyP>
          Run <code>vinyaas add button</code> after <code>vinyaas init</code>.
          The CLI writes the file under <code>components/ui</code>.
        </TypographyP>
        <ol className="text-body list-decimal pl-5 text-base leading-7 [&>li]:mt-2">
          <li>Initialize the project</li>
          <li>Add the components you need</li>
          <li>Commit the installed source</li>
        </ol>
        <TypographyMuted>Updated for v1.0.0</TypographyMuted>
      </Typography>
    ),
    code: `<Typography className="typeset-docs">
  <TypographyH2>Installing components</TypographyH2>
  <TypographyLead>
    Copy source into the repository, then edit it like any other file.
  </TypographyLead>
  <TypographyP>
    Run <code>vinyaas add button</code> after <code>vinyaas init</code>.
  </TypographyP>
  <ol className="list-decimal pl-5">
    <li>Initialize the project</li>
    <li>Add the components you need</li>
    <li>Commit the installed source</li>
  </ol>
  <TypographyMuted>Updated for v1.0.0</TypographyMuted>
</Typography>`,
  },
  {
    id: "customize",
    title: "Customize with CSS variables",
    description:
      "Define .typeset-docs tokens in your stylesheet, then wrap Typography in that class. Size, leading, and flow control density without changing the component API.",
    preview: (
      <div className="typeset-docs border-border bg-card w-full max-w-md rounded-md border p-4 text-left">
        <Typography>
          <TypographyH3>Docs density</TypographyH3>
          <TypographyP>
            This preview uses <code>.typeset-docs</code> tokens for body size,
            leading, and flow.
          </TypographyP>
          <TypographyMuted>
            Override the variables in your global stylesheet.
          </TypographyMuted>
        </Typography>
      </div>
    ),
    code: `/* globals.css
.typeset-docs {
  --typeset-font-body: var(--font-geist-sans);
  --typeset-font-heading: var(--font-geist-sans);
  --typeset-font-mono: var(--font-geist-mono);
  --typeset-size: 15px;
  --typeset-leading: 1.75;
  --typeset-flow: 1.25em;
}
*/

export function DocsCopy() {
  return (
    <div className="typeset-docs">
      <Typography>
        <TypographyH3>Docs density</TypographyH3>
        <TypographyP>Scoped tokens control size and rhythm.</TypographyP>
      </Typography>
    </div>
  );
}`,
  },
];

export default async function TypographyPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/typography/typography.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Typography"
      description="Semantic text styles for titles, body, and supporting copy."
      overview={
        <p>
          Typography is a set of elements. <code>Typography</code> groups them
          with a consistent gap. Headings, paragraphs, lists, and quotes keep
          their native tags so the document outline stays intact.
        </p>
      }
      install="vinyaas add typography"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/typography/typography.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>
            Each export renders the HTML element in its name. A heading stays a
            heading, a list stays a list, and a quote stays a blockquote.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Do not use a heading style on a paragraph. Use the matching
              heading component.
            </li>
            <li>
              <code>TypographyMuted</code> is quieter copy. It is not a
              replacement for text that must meet a status requirement.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <Typography className="max-w-md text-left">
        <TypographyH1>Notes</TypographyH1>
        <TypographyLead>Installed into your project as source.</TypographyLead>
        <TypographyP>
          Edit the file after the CLI copies it into your repository.
        </TypographyP>
      </Typography>
    </ComponentReference>
  );
}
