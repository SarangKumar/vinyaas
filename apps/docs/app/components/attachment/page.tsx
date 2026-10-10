import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/registry/new-york/ui/attachment";
import { Spinner } from "@/registry/new-york/ui/spinner";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("attachment");

function FileCodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

const images = [
  {
    name: "dashboard.svg",
    meta: "SVG · 2.1 KB",
    src: "/attachments/dashboard.svg",
    alt: "Dashboard preview",
  },
  {
    name: "profile.svg",
    meta: "SVG · 1.8 KB",
    src: "/attachments/profile.svg",
    alt: "Profile preview",
  },
  {
    name: "settings.svg",
    meta: "SVG · 1.9 KB",
    src: "/attachments/settings.svg",
    alt: "Settings preview",
  },
] as const;

const usage = `import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

function FileCodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function FileAttachment() {
  return (
    <Attachment className="w-full max-w-sm">
      <AttachmentMedia>
        <FileCodeIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
        <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove message-renderer.tsx">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}
`;

const composerCode = `import { Spinner } from "@/components/ui/spinner";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

function FileCodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

const images = [
  {
    name: "dashboard.svg",
    meta: "SVG · 2.1 KB",
    src: "/attachments/dashboard.svg",
    alt: "Dashboard preview",
  },
  {
    name: "profile.svg",
    meta: "SVG · 1.8 KB",
    src: "/attachments/profile.svg",
    alt: "Profile preview",
  },
  {
    name: "settings.svg",
    meta: "SVG · 1.9 KB",
    src: "/attachments/settings.svg",
    alt: "Settings preview",
  },
];

export function AttachmentComposer() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <AttachmentGroup>
        {images.map((image) => (
          <Attachment key={image.name} orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={image.src} alt={image.alt} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{image.name}</AttachmentTitle>
              <AttachmentDescription>{image.meta}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner label="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment className="w-full">
        <AttachmentMedia>
          <FileCodeIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove message-renderer.tsx">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}
`;

function AttachmentComposer() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <AttachmentGroup>
        {images.map((image) => (
          <Attachment key={image.name} orientation="vertical">
            <AttachmentMedia variant="image">
              {/* eslint-disable-next-line @next/next/no-img-element -- framework-agnostic demo: consumers copy a native img */}
              <img src={image.src} alt={image.alt} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{image.name}</AttachmentTitle>
              <AttachmentDescription>{image.meta}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner label="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment className="w-full">
        <AttachmentMedia>
          <FileCodeIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove message-renderer.tsx">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}

const api: ApiRow[] = [
  {
    prop: "state",
    type: '"idle" | "uploading" | "processing" | "error" | "done"',
    defaultValue: '"done"',
    description: "Drives border treatment and title pulse while uploading.",
  },
  {
    prop: "size",
    type: '"default" | "sm" | "xs"',
    defaultValue: '"default"',
    description: "Overall density for media and padding.",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Lay media beside or above the content.",
  },
  {
    prop: "variant",
    type: '"icon" | "image"',
    defaultValue: '"icon"',
    description: "On AttachmentMedia, choose an icon slot or an image preview.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto any Attachment part with cn.",
  },
];

const imagesExampleCode = `import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

const images = [
  {
    name: "dashboard.svg",
    meta: "SVG · 2.1 KB",
    src: "/attachments/dashboard.svg",
    alt: "Dashboard preview",
  },
  {
    name: "profile.svg",
    meta: "SVG · 1.8 KB",
    src: "/attachments/profile.svg",
    alt: "Profile preview",
  },
  {
    name: "settings.svg",
    meta: "SVG · 1.9 KB",
    src: "/attachments/settings.svg",
    alt: "Settings preview",
  },
];

export function ImageAttachments() {
  return (
    <AttachmentGroup className="w-full max-w-sm">
      {images.map((image) => (
        <Attachment key={image.name} orientation="vertical">
          <AttachmentMedia variant="image">
            <img src={image.src} alt={image.alt} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{image.name}</AttachmentTitle>
            <AttachmentDescription>{image.meta}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </AttachmentGroup>
  );
}
`;

const examples: ComponentExample[] = [
  {
    id: "images",
    title: "Images",
    description:
      "Vertical attachments in a group show image previews with truncated names.",
    preview: (
      <AttachmentGroup className="w-full max-w-sm">
        {images.map((image) => (
          <Attachment key={image.name} orientation="vertical">
            <AttachmentMedia variant="image">
              {/* eslint-disable-next-line @next/next/no-img-element -- framework-agnostic demo: consumers copy a native img */}
              <img src={image.src} alt={image.alt} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{image.name}</AttachmentTitle>
              <AttachmentDescription>{image.meta}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
    ),
    code: imagesExampleCode,
  },
  {
    id: "uploading",
    title: "Uploading",
    description:
      "An uploading row uses Spinner in the media slot and a cancel action.",
    preview: (
      <Attachment state="uploading" className="w-full max-w-sm">
        <AttachmentMedia>
          <Spinner label="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    ),
    code: `import { Spinner } from "@/components/ui/spinner";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function UploadingAttachment() {
  return (
    <Attachment state="uploading" className="w-full max-w-sm">
      <AttachmentMedia>
        <Spinner label="" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
        <AttachmentDescription>Uploading · 64%</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Cancel upload">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}
`,
  },
  {
    id: "error",
    title: "Error",
    description:
      "Failed uploads keep the reason in the description, not color alone.",
    preview: (
      <Attachment state="error" className="w-full max-w-sm">
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
          <AttachmentDescription>
            Upload failed. Try again.
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove quarterly-report.pdf">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    ),
    code: `import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function FailedAttachment() {
  return (
    <Attachment state="error" className="w-full max-w-sm">
      <AttachmentMedia>
        <FileIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
        <AttachmentDescription>Upload failed. Try again.</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove quarterly-report.pdf">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}
`,
  },
  {
    id: "file",
    title: "File",
    description: "A horizontal file chip with an icon and remove action.",
    preview: (
      <Attachment className="w-full max-w-sm">
        <AttachmentMedia>
          <FileCodeIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove message-renderer.tsx">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    ),
    code: usage,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A chat composer stacks image previews, an uploading file, and a finished attachment.",
  preview: <AttachmentComposer />,
  code: { tsx: composerCode, jsx: composerCode },
};

export default async function AttachmentPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/attachment/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Attachment"
      description="A file or image chip with media, metadata, upload state, and actions."
      overview={
        <p>
          Attachment shows a file or image with optional actions and upload
          state. Use AttachmentMedia for an icon or image, AttachmentContent for
          the name and metadata, and AttachmentActions for remove or cancel.
          Long names truncate; keep remove and cancel controls named.
        </p>
      }
      install="vinyaas add attachment"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/attachment/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code> and Button from{" "}
          <code>../button</code>. Install <code>button</code> first, plus{" "}
          <code>clsx</code>, <code>tailwind-merge</code>, and{" "}
          <code>class-variance-authority</code>. Uploading demos also use{" "}
          <code>spinner</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            Icon-only AttachmentAction needs an aria-label that names the file
            or action.
          </li>
          <li>
            AttachmentTrigger needs an aria-label for what activating it does.
          </li>
          <li>
            Keep failure reasons in AttachmentDescription so error is not color
            alone.
          </li>
        </ul>
      }
      source={source}
    >
      <Attachment className="w-full max-w-sm">
        <AttachmentMedia>
          <FileCodeIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove message-renderer.tsx">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </ComponentReference>
  );
}
