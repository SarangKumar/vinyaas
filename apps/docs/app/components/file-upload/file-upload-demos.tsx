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
    id: "doc",
    file: new File(
      ["report"],
      "a-very-long-file-name-that-should-not-resize-the-upload-component.pdf",
      { type: "application/pdf" },
    ),
    progress: 40,
  },
  {
    id: "image",
    file: new File(["portrait"], "portrait.png", { type: "image/png" }),
    progress: 100,
  },
  {
    id: "audio",
    file: new File(["clip"], "standup-notes.mp3", { type: "audio/mpeg" }),
  },
  {
    id: "video",
    file: new File(["reel"], "product-walkthrough.mp4", { type: "video/mp4" }),
    progress: 100,
  },
  {
    id: "failed",
    file: new File(["bundle"], "package.zip", {
      type: "application/zip",
    }),
    error: "Upload failed",
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
