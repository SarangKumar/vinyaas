import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Button } from "@/registry/new-york/ui/button";
import { Label } from "@/registry/new-york/ui/label";
import { FileStatusPreview } from "./file-upload-demos";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from "@/registry/new-york/ui/file-upload";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("file-upload");

const usage = `import { FileUpload, FileUploadDropzone, FileUploadList } from "@/components/ui/file-upload";

export function ResumeUpload() {
  return (
    <FileUpload accept=".pdf,.doc,.docx" maxSize={5_000_000}>
      <FileUploadDropzone>Drop a resume, or click to browse</FileUploadDropzone>
      <FileUploadList />
    </FileUpload>
  );
}
`;

const resumeCardCode = `import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from "@/components/ui/file-upload";

export function ResumeUploadCard() {
  return (
    <form className="grid w-full max-w-md gap-4 text-left">
      <div className="grid gap-1">
        <Label>Resume</Label>
        <p className="text-muted-foreground text-sm">
          PDF or Word, up to 2 MB. Used for the open design role.
        </p>
      </div>
      <FileUpload accept=".pdf,.doc,.docx" maxSize={2_000_000}>
        <FileUploadDropzone>
          Drop a resume, or click to browse
        </FileUploadDropzone>
        <FileUploadList />
      </FileUpload>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Submit application</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "accept",
    type: "string",
    description: "Native accept filter, including extensions and MIME types.",
  },
  {
    prop: "multiple",
    type: "boolean",
    description: "Allows more than one file.",
  },
  {
    prop: "maxSize",
    type: "number",
    description:
      "Maximum size in bytes. Larger files are listed with an error.",
  },
  {
    prop: "onFilesChange",
    type: "(files) => void",
    description: "Called when files are added or removed.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "avatar",
    title: "Avatar",
    description: "A single image replaces the current portrait.",
    preview: (
      <div className="flex w-full max-w-sm items-center gap-4 text-left">
        <Avatar>
          <AvatarFallback>SK</AvatarFallback>
        </Avatar>
        <FileUpload accept="image/*" className="flex-1">
          <FileUploadDropzone>Upload a portrait</FileUploadDropzone>
          <FileUploadList />
        </FileUpload>
      </div>
    ),
    code: usage,
  },
  {
    id: "document",
    title: "Document",
    description: "Limit the picker to documents and a maximum size.",
    preview: (
      <FileUpload
        accept=".pdf,.doc,.docx"
        maxSize={5_000_000}
        className="max-w-sm"
      >
        <FileUploadDropzone>Drop a document</FileUploadDropzone>
        <FileUploadList />
      </FileUpload>
    ),
    code: usage,
  },
  {
    id: "images",
    title: "Multiple images",
    description: "multiple keeps every accepted image in the list.",
    preview: (
      <FileUpload accept="image/*" multiple className="max-w-sm">
        <FileUploadDropzone>Drop images</FileUploadDropzone>
        <FileUploadList />
      </FileUpload>
    ),
    code: usage,
  },
  {
    id: "status",
    title: "File states",
    description:
      "A long name truncates. Uploading, uploaded, failed, and pending rows share the dropzone width.",
    preview: <FileStatusPreview />,
    code: usage,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A job application asks for a resume, explains the file rules, and offers Submit and Cancel.",
  preview: (
    <form className="grid w-full max-w-md gap-4 text-left">
      <div className="grid gap-1">
        <Label>Resume</Label>
        <p className="text-muted-foreground text-sm">
          PDF or Word, up to 2 MB. Used for the open design role.
        </p>
      </div>
      <FileUpload accept=".pdf,.doc,.docx" maxSize={2_000_000}>
        <FileUploadDropzone>
          Drop a resume, or click to browse
        </FileUploadDropzone>
        <FileUploadList />
      </FileUpload>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Submit application</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  ),
  code: resumeCardCode,
};

export default async function FileUploadPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/file-upload/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="File Upload"
      description="A native file picker that also accepts a drag and drop."
      overview={
        <p>
          FileUpload keeps a hidden file input. The dropzone is a button, so
          keyboard users open the same picker. Dropping files uses the same
          validation as the picker. A selected file stays pending until{" "}
          <code>progress</code> is set. An error shows a retry and a remove
          control. The list uses the same width as the dropzone.
        </p>
      }
      install="vinyaas add file-upload"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/file-upload/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>The dropzone is a button and opens the native picker.</li>
          <li>The file input stays available to assistive technology.</li>
          <li>Errors use role=&quot;alert&quot;.</li>
          <li>Each file can be removed with a named button.</li>
        </ul>
      }
      source={source}
    >
      <FileUpload className="max-w-sm">
        <FileUploadDropzone>Drop a file, or click to browse</FileUploadDropzone>
        <FileUploadList />
      </FileUpload>
    </ComponentReference>
  );
}
