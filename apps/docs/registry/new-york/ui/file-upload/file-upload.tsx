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
        error = `${file.name} is larger than the limit.`;
      } else if (accept && !matchesAccept(file, accept)) {
        error = `${file.name} is not an accepted file type.`;
      }

      next.push({
        id: `${file.name}-${sequence.current}`,
        file,
        error,
        progress: error ? undefined : 0,
      });

      if (!multiple) {
        break;
      }
    }

    commit(next);
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
        add,
        setDragOver,
      }}
    >
      <div className={cn("grid gap-3", className)} {...props}>
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
  ...props
}: FileUploadDropzoneProps) {
  const upload = useFileUpload();

  return (
    <button
      type="button"
      disabled={upload.disabled}
      data-dragover={upload.dragOver ? "true" : undefined}
      className={cn(
        "border-input bg-muted text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed px-4 py-6 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
    />
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
    <ul className={cn("grid gap-2", className)} {...props}>
      {upload.files.map((item) => (
        <li
          key={item.id}
          className="border-border flex items-center gap-3 rounded-md border px-3 py-2 text-sm"
        >
          <div className="grid min-w-0 flex-1 gap-1">
            <span className="truncate">{item.file.name}</span>
            {item.error ? (
              <span className="text-destructive text-xs" role="alert">
                {item.error}
              </span>
            ) : null}
            {item.progress !== undefined && !item.error ? (
              <progress
                value={item.progress}
                max={100}
                aria-label={`Upload progress for ${item.file.name}`}
                className="h-1 w-full"
              />
            ) : null}
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-md px-1"
            onClick={() => upload.remove(item.id)}
          >
            Remove
            <span className="sr-only"> {item.file.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
