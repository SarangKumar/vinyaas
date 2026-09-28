"use client";

import React, {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export type FileUploadFile = {
  id: string;
  file: File;
  error?: string;
  progress?: number;
};

type FileUploadContextValue = {
  files: readonly FileUploadFile[];
  disabled: boolean;
  dragOver: boolean;
  inputId: string;
  open: () => void;
  remove: (id: string) => void;
  retry: (id: string) => void;
  add: (list: FileList | readonly File[]) => void;
  setDragOver: (dragOver: boolean) => void;
};

const FileUploadContext = createContext<FileUploadContextValue | null>(null);

function useFileUpload() {
  const context = useContext(FileUploadContext);

  if (!context) {
    throw new Error("File upload parts must render inside FileUpload.");
  }

  return context;
}

function matchesAccept(file: File, accept: string) {
  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);

  if (rules.length === 0) {
    return true;
  }

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return rules.some((rule) => {
    if (rule.startsWith(".")) {
      return name.endsWith(rule);
    }

    if (rule.endsWith("/*")) {
      return type.startsWith(rule.slice(0, -1));
    }

    return type === rule;
  });
}

export type FileUploadProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  files?: readonly FileUploadFile[];
  onFilesChange?: (files: FileUploadFile[]) => void;
};

export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  files: filesProp,
  onFilesChange,
  className,
  children,
  ...props
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [uncontrolled, setUncontrolled] = useState<FileUploadFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const files = filesProp ?? uncontrolled;
  const sequence = useRef(0);

  function commit(next: FileUploadFile[]) {
    if (filesProp === undefined) {
      setUncontrolled(next);
    }

    onFilesChange?.(next);
  }

  function add(list: FileList | readonly File[]) {
    if (disabled) {
      return;
    }

    const incoming = [...list];
    const next = multiple ? [...files] : [];

    for (const file of incoming) {
      sequence.current += 1;
      let error: string | undefined;

      if (maxSize !== undefined && file.size > maxSize) {
        error = `Upload failed. ${file.name} is larger than the limit.`;
      } else if (accept && !matchesAccept(file, accept)) {
        error = `Upload failed. ${file.name} is not an accepted file type.`;
      }

      next.push({
        id: `${file.name}-${sequence.current}`,
        file,
        error,
      });

      if (!multiple) {
        break;
      }
    }

    commit(next);
  }

  function retry(id: string) {
    const item = files.find((entry) => entry.id === id);

    if (!item || disabled) {
      return;
    }

    let error: string | undefined;

    if (maxSize !== undefined && item.file.size > maxSize) {
      error = `Upload failed. ${item.file.name} is larger than the limit.`;
    } else if (accept && !matchesAccept(item.file, accept)) {
      error = `Upload failed. ${item.file.name} is not an accepted file type.`;
    }

    commit(
      files.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              error,
              progress: error ? undefined : 0,
            }
          : entry,
      ),
    );
  }

  return (
    <FileUploadContext.Provider
      value={{
        files,
        disabled,
        dragOver,
        inputId,
        open: () => inputRef.current?.click(),
        remove: (id) => commit(files.filter((item) => item.id !== id)),
        retry,
        add,
        setDragOver,
      }}
    >
      <div
        className={cn(
          "grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-3 overflow-hidden",
          className,
        )}
        {...props}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            if (event.currentTarget.files) {
              add(event.currentTarget.files);
            }

            event.currentTarget.value = "";
          }}
        />
        {children}
      </div>
    </FileUploadContext.Provider>
  );
}

export type FileUploadDropzoneProps = React.ComponentProps<"button">;

export function FileUploadDropzone({
  className,
  children,
  ...props
}: FileUploadDropzoneProps) {
  const upload = useFileUpload();

  return (
    <button
      type="button"
      disabled={upload.disabled}
      data-dragover={upload.dragOver ? "true" : undefined}
      className={cn(
        "border-input bg-muted text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background flex min-h-28 w-full max-w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed px-4 py-6 text-center text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        upload.dragOver && "border-foreground bg-accent text-foreground",
        className,
      )}
      onClick={upload.open}
      onDragOver={(event) => {
        event.preventDefault();
        upload.setDragOver(true);
      }}
      onDragLeave={() => upload.setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        upload.setDragOver(false);
        upload.add(event.dataTransfer.files);
      }}
      {...props}
    >
      {upload.dragOver ? "Drag files here" : children}
    </button>
  );
}

export function FileUploadList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const upload = useFileUpload();

  if (upload.files.length === 0) {
    return null;
  }

  return (
    <ul
      className={cn(
        "grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-2",
        className,
      )}
      {...props}
    >
      {upload.files.map((item) => {
        const status = fileStatus(item);

        return (
          <li
            key={item.id}
            className="border-border flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border px-3 py-2 text-sm"
          >
            <FileStatusIcon status={status} />
            <div className="grid min-w-0 flex-1 gap-0.5">
              <span className="truncate">{item.file.name}</span>
              {status === "uploading" ? (
                <span className="text-muted-foreground text-xs">
                  Uploading...
                </span>
              ) : null}
              {status === "uploaded" ? (
                <span className="text-muted-foreground text-xs">Uploaded</span>
              ) : null}
              {status === "error" ? (
                <span className="text-destructive text-xs" role="alert">
                  {item.error}
                </span>
              ) : null}
            </div>
            {status === "error" ? (
              <button
                type="button"
                aria-label="Retry upload"
                title="Retry upload"
                className="text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1"
                onClick={() => upload.retry(item.id)}
              >
                <RetryIcon />
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Remove file"
              title="Remove file"
              className="text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1"
              onClick={() => upload.remove(item.id)}
            >
              <CloseIcon />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function fileStatus(item: FileUploadFile) {
  if (item.error) {
    return "error" as const;
  }

  if (item.progress === undefined) {
    return "pending" as const;
  }

  if (item.progress >= 100) {
    return "uploaded" as const;
  }

  return "uploading" as const;
}

function FileStatusIcon({
  status,
}: {
  status: "error" | "uploading" | "uploaded" | "pending";
}) {
  if (status === "uploading") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
      </svg>
    );
  }

  if (status === "uploaded") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 12 5 5L20 7" />
      </svg>
    );
  }

  if (status === "error") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="text-destructive size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="text-muted-foreground size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-2.6-6.3" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}
