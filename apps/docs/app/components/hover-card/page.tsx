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

const profileCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function ProfileCard() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" className="underline underline-offset-4">
          @johndoe
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-start gap-3 text-left">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="font-medium">John Doe</p>
            <p className="text-muted-foreground text-sm">@johndoe</p>
            <p className="text-sm">
              Product designer building accessible UI for design systems.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline">Maintainer</Badge>
              <span className="text-muted-foreground text-xs">San Francisco</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
`;

const alignmentCode = `import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function Alignments() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
      <HoverCard>
        <HoverCardTrigger>
          <Button type="button" variant="outline" className="w-full">
            Top
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="top">Opens above the trigger.</HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger>
          <Button type="button" variant="outline" className="w-full">
            Bottom
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="bottom">
          Opens below the trigger.
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger>
          <Button type="button" variant="outline" className="w-full">
            Left
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="left">Opens to the left.</HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger>
          <Button type="button" variant="outline" className="w-full">
            Right
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="right">Opens to the right.</HoverCardContent>
      </HoverCard>
    </div>
  );
}
`;

const assignedCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function AssignedTo() {
  return (
    <p className="text-sm leading-6">
      Assigned to{" "}
      <HoverCard>
        <HoverCardTrigger>
          <Button
            variant="link"
            className="h-auto p-0 underline underline-offset-4"
          >
            @johndoe
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-start gap-3 text-left">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="font-medium">John Doe</p>
              <p className="text-muted-foreground text-sm">@johndoe</p>
              <p className="text-sm">
                Product designer building accessible UI for design systems.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="outline">Design lead</Badge>
                <span className="text-muted-foreground text-xs">
                  San Francisco
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </p>
  );
}
`;

const usage = profileCode;

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

function ProfileHoverPreview({
  trigger,
  badge = "Maintainer",
}: {
  trigger: string;
  badge?: string;
}) {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger>
        <Button
          variant="link"
          className="h-auto p-0 underline underline-offset-4"
        >
          {trigger}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-start gap-3 text-left">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="font-medium">John Doe</p>
            <p className="text-muted-foreground text-sm">@johndoe</p>
            <p className="text-sm">
              Product designer building accessible UI for design systems.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline">{badge}</Badge>
              <span className="text-muted-foreground text-xs">
                San Francisco
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

const examples: ComponentExample[] = [
  {
    id: "profile",
    title: "Profile",
    description:
      "Hover or focus an @username to read a short profile. The card stays open while the pointer is over it.",
    preview: <ProfileHoverPreview trigger="@johndoe" />,
    code: { tsx: profileCode, jsx: profileCode },
  },
  {
    id: "alignment",
    title: "Alignment",
    description:
      "side places the card above, below, or beside the trigger. The grid wraps on small screens so the triggers stay usable.",
    preview: (
      <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            <Button type="button" variant="outline" className="w-full">
              Top
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side="top">
            Opens above the trigger.
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            <Button type="button" variant="outline" className="w-full">
              Bottom
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side="bottom">
            Opens below the trigger.
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            <Button type="button" variant="outline" className="w-full">
              Left
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side="left">Opens to the left.</HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={0}>
          <HoverCardTrigger>
            <Button type="button" variant="outline" className="w-full">
              Right
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side="right">Opens to the right.</HoverCardContent>
        </HoverCard>
      </div>
    ),
    code: { tsx: alignmentCode, jsx: alignmentCode },
  },
];

const inPractice: ComponentInPractice = {
  description:
    "An assignment line links @johndoe. Hover or focus the mention to open a profile with Avatar, role, and bio.",
  preview: (
    <p className="text-sm leading-6">
      Assigned to <ProfileHoverPreview trigger="@johndoe" badge="Design lead" />
    </p>
  ),
  code: { tsx: assignedCode, jsx: assignedCode },
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
      <ProfileHoverPreview trigger="@johndoe" />
    </ComponentReference>
  );
}
