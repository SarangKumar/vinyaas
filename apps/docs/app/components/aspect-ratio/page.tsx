import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { AspectRatio } from "@/registry/new-york/ui/aspect-ratio";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("aspect-ratio");

const usage = `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Hero() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted max-w-md overflow-hidden rounded-md">
      <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
        16:9
      </div>
    </AspectRatio>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "ratio",
    type: "number",
    description: "Width divided by height. Use 16 / 9, 1, or 9 / 16.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the aspect ratio root with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "landscape",
    title: "Landscape",
    description: "A 16:9 frame for wide media.",
    preview: (
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted max-w-md overflow-hidden rounded-md"
      >
        <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
          16:9
        </div>
      </AspectRatio>
    ),
    code: `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Landscape() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted max-w-md overflow-hidden rounded-md">
      <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
        16:9
      </div>
    </AspectRatio>
  );
}
`,
  },
  {
    id: "square",
    title: "Square",
    description: "A 1:1 frame for avatars and thumbnails.",
    preview: (
      <AspectRatio
        ratio={1}
        className="bg-muted max-w-40 overflow-hidden rounded-md"
      >
        <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
          1:1
        </div>
      </AspectRatio>
    ),
    code: `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Square() {
  return (
    <AspectRatio ratio={1} className="bg-muted max-w-40 overflow-hidden rounded-md">
      <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
        1:1
      </div>
    </AspectRatio>
  );
}
`,
  },
  {
    id: "portrait",
    title: "Portrait",
    description: "A 9:16 frame for tall media.",
    preview: (
      <AspectRatio
        ratio={9 / 16}
        className="bg-muted max-w-40 overflow-hidden rounded-md"
      >
        <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
          9:16
        </div>
      </AspectRatio>
    ),
    code: `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Portrait() {
  return (
    <AspectRatio ratio={9 / 16} className="bg-muted max-w-40 overflow-hidden rounded-md">
      <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
        9:16
      </div>
    </AspectRatio>
  );
}
`,
  },
  {
    id: "responsive",
    title: "Responsive width",
    description:
      "Cap the frame with max-width utilities. The ratio stays fixed as the viewport shrinks.",
    preview: (
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted w-full max-w-sm overflow-hidden rounded-md sm:max-w-lg"
      >
        <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
          16:9
        </div>
      </AspectRatio>
    ),
    code: `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function ResponsiveCover() {
  return (
    <AspectRatio
      ratio={16 / 9}
      className="bg-muted w-full max-w-sm overflow-hidden rounded-md sm:max-w-lg"
    >
      <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
        16:9
      </div>
    </AspectRatio>
  );
}
`,
  },
];

const inPracticeCode = `import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProductCover() {
  return (
    <Card className="w-full max-w-sm gap-0 overflow-hidden p-0 text-left">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-none">
        <img
          src="/og.png"
          alt="Vinyaas Open Graph preview"
          className="size-full object-cover"
        />
      </AspectRatio>
      <CardHeader className="gap-1 px-4 pt-5">
        <div>
          <CardTitle>Vinyaas</CardTitle>
          <CardDescription>
            Composable React components you install as source.
          </CardDescription>
        </div>
        <CardAction>
          <Badge variant="outline">v1.1.0</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4">
        <p className="text-muted-foreground text-sm">
          A production catalog for forms, overlays, charts, and product UI —
          with docs, CLI install, and theme tokens that travel with your app.
        </p>
      </CardContent>
      <CardFooter className="gap-2 px-4 pt-4 pb-5">
        <Button variant="outline" size="sm">
          Documentation
        </Button>
        <Button size="sm">Get started</Button>
      </CardFooter>
    </Card>
  );
}
`;

const inPractice: ComponentInPractice = {
  description:
    "A marketing card uses AspectRatio for a 16:9 Open Graph cover above title, description, and equally sized actions.",
  preview: (
    <Card className="w-full max-w-sm gap-0 overflow-hidden p-0 text-left">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-none">
        <img
          src="/og.png"
          alt="Vinyaas Open Graph preview"
          className="size-full object-cover"
        />
      </AspectRatio>
      <CardHeader className="gap-1 px-4 pt-5">
        <div>
          <CardTitle>Vinyaas</CardTitle>
          <CardDescription>
            Composable React components you install as source.
          </CardDescription>
        </div>
        <CardAction>
          <Badge variant="outline">v1.1.0</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4">
        <p className="text-muted-foreground text-sm">
          A production catalog for forms, overlays, charts, and product UI —
          with docs, CLI install, and theme tokens that travel with your app.
        </p>
      </CardContent>
      <CardFooter className="gap-2 px-4 pt-4 pb-5">
        <Button variant="outline" size="sm">
          Documentation
        </Button>
        <Button size="sm">Get started</Button>
      </CardFooter>
    </Card>
  ),
  code: { tsx: inPracticeCode, jsx: inPracticeCode },
};

export default async function AspectRatioPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/aspect-ratio/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Aspect Ratio"
      description="Displays content within a desired ratio."
      overview={
        <p>
          AspectRatio keeps children inside a fixed width-to-height frame. Pass{" "}
          <code>ratio</code> as a number such as <code>16 / 9</code> or{" "}
          <code>1</code>. Combine with Tailwind width utilities like{" "}
          <code>max-w-md</code> or <code>sm:max-w-lg</code>. In your app, images
          and video typically fill the frame with <code>object-cover</code>.
        </p>
      }
      install="vinyaas add aspect-ratio"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/aspect-ratio/index.tsx</code>. It imports{" "}
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
          AspectRatio is presentational. Give images meaningful alt text.
          Decorative crops can use an empty alt when the surrounding copy
          already describes the media.
        </p>
      }
      source={source}
    >
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted max-w-md overflow-hidden rounded-md"
      >
        <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
          16:9 preview
        </div>
      </AspectRatio>
    </ComponentReference>
  );
}
