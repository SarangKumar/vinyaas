"use client";

import { useState } from "react";

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  type FileUploadFile,
} from "@/registry/new-york/ui/file-upload";

const initialFiles: FileUploadFile[] = [
  {
    id: "uploading",
    file: new File(
      ["report"],
      "a-very-long-file-name-that-should-not-resize-the-upload-component.pdf",
      { type: "application/pdf" },
    ),
    progress: 40,
  },
  {
    id: "done",
    file: new File(["portrait"], "portrait.png", { type: "image/png" }),
    progress: 100,
  },
  {
    id: "failed",
    file: new File(["notes"], "notes.txt", { type: "text/plain" }),
    error: "Upload failed",
  },
  {
    id: "pending",
    file: new File(["draft"], "draft.txt", { type: "text/plain" }),
  },
];

export function FileStatusPreview() {
  const [files, setFiles] = useState(initialFiles);

  return (
    <FileUpload files={files} onFilesChange={setFiles} className="max-w-sm">
      <FileUploadDropzone>Drop files here, or browse</FileUploadDropzone>
      <FileUploadList />
    </FileUpload>
  );
}
