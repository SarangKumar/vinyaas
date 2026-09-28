"use client";

import { PlayBlock } from "@/app/home/play-block";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from "@/registry/new-york/ui/file-upload/file-upload";

export function UploadBlock() {
  return (
    <PlayBlock title="Documents">
      <FileUpload accept=".pdf,.png" multiple>
        <FileUploadDropzone>Drop a PDF or PNG</FileUploadDropzone>
        <FileUploadList />
      </FileUpload>
    </PlayBlock>
  );
}
