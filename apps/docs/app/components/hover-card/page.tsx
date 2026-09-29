import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/new-york/ui/hover-card";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("hover-card");

const usage = `import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function Person() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" className="underline underline-offset-4">
          Ada Lovelace
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p>Wrote the first algorithm.</p>
      </HoverCardContent>
    </HoverCard>
  );
}
`;

const profileCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function ProfileCard() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" className="underline underline-offset-4">
          Ada Lovelace
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Ada Lovelace</p>
            <p className="text-muted-foreground text-sm">Mathematician · London</p>
            <Badge variant="secondary">Available</Badge>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
`;

const externalLinkCode = `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function ExternalLinkPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" className="underline underline-offset-4">
          Vinyaas documentation ↗
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="grid gap-2">
          <Badge variant="secondary">External website</Badge>
          <p className="font-medium">docs.vinyaas.dev</p>
          <p className="text-muted-foreground text-sm">
            Install guides, API reference, and component examples for the
            Vinyaas design system.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
`;

const contributorProjectCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function ContributorActivity() {
  return (
    <p className="text-sm leading-6">
      <HoverCard>
        <HoverCardTrigger>
          <Button variant="link" className="h-auto p-0">
            Ada Lovelace
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="font-medium">Ada Lovelace</p>
              <p className="text-muted-foreground text-sm">
                Mathematician · London
              </p>
              <Badge variant="secondary">Available</Badge>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      opened a pull request in{" "}
      <HoverCard>
        <HoverCardTrigger>
          <Button variant="link" className="h-auto p-0">
            vinyaas
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">vinyaas</p>
              <Badge>Active</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              TypeScript · 128 stars
            </p>
            <p className="text-sm">Updated today</p>
          </div>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "openDelay",
    type: "number",
    defaultValue: "200",
    description: "Milliseconds before hover or focus opens the card.",
  },
  {
    prop: "closeDelay",
    type: "number",
    defaultValue: "150",
    description: "Milliseconds before the pointer leaving closes the card.",
  },
  {
    prop: "open",
    type: "boolean",
    description: "Controlled open state.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Called when the card opens or closes.",
  },
  {
    prop: "side",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"bottom"',
    description: "Preferred side for HoverCardContent.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto HoverCardContent with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "profile",
    title: "Profile",
    description:
      "Hover or focus the underlined name to read a short profile. The card stays open while the pointer is over it.",
    preview: (
      <HoverCard openDelay={0}>
        <HoverCardTrigger>
          <Button variant="link" className="underline underline-offset-4">
            Ada Lovelace
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="font-medium">Ada Lovelace</p>
              <p className="text-muted-foreground text-sm">
                Mathematician · London
              </p>
              <p>Wrote the first algorithm for the Analytical Engine.</p>
              <Badge variant="secondary">Available</Badge>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
    code: { tsx: profileCode, jsx: profileCode },
  },
  {
    id: "external-link",
    title: "External link",
    description:
      "An underlined link-style trigger previews an external site before the user leaves the page.",
    preview: (
      <HoverCard openDelay={0}>
        <HoverCardTrigger>
          <Button variant="link" className="underline underline-offset-4">
            Vinyaas documentation ↗
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="grid gap-2 text-left">
            <Badge variant="secondary" className="w-fit">
              External website
            </Badge>
            <p className="font-medium">docs.vinyaas.dev</p>
            <p className="text-muted-foreground text-sm">
              Install guides, API reference, and component examples for the
              Vinyaas design system.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
    code: { tsx: externalLinkCode, jsx: externalLinkCode },
  },
  {
    id: "message",
    title: "Message preview",
    description:
      "A message reference shows the sender, time, and a short preview.",
    preview: (
      <HoverCard openDelay={0}>
        <HoverCardTrigger>
          <Button variant="link" className="underline underline-offset-4">
            Note from Ada
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">Ada Lovelace</p>
              <Badge variant="outline">2m</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              The notes for the engine are ready to review.
            </p>
            <Badge variant="secondary">Unread</Badge>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function MessagePreview() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" className="underline underline-offset-4">
          Note from Ada
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="font-medium">Ada Lovelace</p>
        <p>The notes for the engine are ready to review.</p>
      </HoverCardContent>
    </HoverCard>
  );
}
`,
  },
  {
    id: "project",
    title: "Project preview",
    description: "A project name opens its language, stars, and status.",
    preview: (
      <HoverCard openDelay={0}>
        <HoverCardTrigger>
          <Button variant="link" className="underline underline-offset-4">
            vinyaas
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">vinyaas</p>
              <Badge>Active</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              TypeScript · 128 stars
            </p>
            <p className="text-sm">Updated today</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function ProjectPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" className="underline underline-offset-4">
          vinyaas
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="font-medium">vinyaas</p>
        <p>TypeScript · 128 stars</p>
        <Badge>Active</Badge>
      </HoverCardContent>
    </HoverCard>
  );
}
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "An activity line links a contributor and a project. Each name opens its own HoverCard with Avatar, Badge, and status.",
  preview: (
    <p className="text-sm leading-6">
      <HoverCard openDelay={0}>
        <HoverCardTrigger>
          <Button variant="link" className="h-auto p-0">
            Ada Lovelace
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="font-medium">Ada Lovelace</p>
              <p className="text-muted-foreground text-sm">
                Mathematician · London
              </p>
              <Badge variant="secondary">Available</Badge>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      opened a pull request in{" "}
      <HoverCard openDelay={0}>
        <HoverCardTrigger>
          <Button variant="link" className="h-auto p-0">
            vinyaas
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">vinyaas</p>
              <Badge>Active</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              TypeScript · 128 stars
            </p>
            <p className="text-sm">Updated today</p>
          </div>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  ),
  code: { tsx: contributorProjectCode, jsx: contributorProjectCode },
};

export default async function HoverCardPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/hover-card/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Hover Card"
      description="A preview that opens when a link or button is hovered or focused."
      overview={
        <p>
          HoverCardTrigger clones one child. Hover, or keyboard focus, opens
          HoverCardContent. Moving onto the card keeps it open. Escape closes
          it. There is no <code>asChild</code> prop.
        </p>
      }
      install="vinyaas add hover-card"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/hover-card/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <p>
          The trigger exposes <code>aria-expanded</code>,{" "}
          <code>aria-haspopup=&quot;dialog&quot;</code>, and{" "}
          <code>aria-controls</code> while the card is open. The card is a
          non-modal dialog. Escape closes it. Focus on the trigger opens it, so
          keyboard users reach the same content as pointer users.
        </p>
      }
      source={source}
    >
      <HoverCard openDelay={0}>
        <HoverCardTrigger>
          <Button variant="link" className="underline underline-offset-4">
            Ada Lovelace
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <p>Wrote the first algorithm.</p>
        </HoverCardContent>
      </HoverCard>
    </ComponentReference>
  );
}
