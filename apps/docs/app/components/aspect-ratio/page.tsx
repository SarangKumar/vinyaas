import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { AspectRatio } from "@/registry/new-york/ui/aspect-ratio";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("aspect-ratio");

const usage = `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Hero() {
  return (
    <AspectRatio ratio={16 / 9}>
      <img
        src="/hero.png"
        alt="Product screenshot"
        className="rounded-md object-cover"
      />
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
    <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-md">
      <img src="/landscape.png" alt="Landscape" className="object-cover" />
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
    <AspectRatio ratio={1} className="bg-muted overflow-hidden rounded-md">
      <img src="/square.png" alt="Square crop" className="object-cover" />
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
    <AspectRatio ratio={9 / 16} className="bg-muted overflow-hidden rounded-md">
      <img src="/portrait.png" alt="Portrait" className="object-cover" />
    </AspectRatio>
  );
}
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A product card uses a 16:9 AspectRatio for the cover image above the title.",
  preview: (
    <div className="border-border bg-card w-full max-w-sm overflow-hidden rounded-md border text-left">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
          Cover image
        </div>
      </AspectRatio>
      <div className="grid gap-1 p-4">
        <p className="text-sm font-medium">Design system kit</p>
        <p className="text-muted-foreground text-sm">
          Source-installed primitives for product UI.
        </p>
      </div>
    </div>
  ),
  code: `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function ProductCover() {
  return (
    <div className="border-border bg-card overflow-hidden rounded-md border">
      <AspectRatio ratio={16 / 9}>
        <img src="/cover.png" alt="Design system kit" className="object-cover" />
      </AspectRatio>
      <div className="grid gap-1 p-4">
        <p className="text-sm font-medium">Design system kit</p>
        <p className="text-muted-foreground text-sm">
          Source-installed primitives for product UI.
        </p>
      </div>
    </div>
  );
}
`,
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
          <code>1</code>. Images should use <code>object-cover</code> to fill
          the frame.
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
