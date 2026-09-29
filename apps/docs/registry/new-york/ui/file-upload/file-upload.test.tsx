import type { ComponentProps } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FileUpload, FileUploadDropzone, FileUploadList } from ".";

function Upload(props: Partial<ComponentProps<typeof FileUpload>>) {
  return (
    <FileUpload {...props}>
      <FileUploadDropzone>Browse</FileUploadDropzone>
      <FileUploadList />
    </FileUpload>
  );
}

function choose(name: string, type = "text/plain", contents = "hello") {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]');
  const file = new File([contents], name, { type });

  Object.defineProperty(input, "files", { value: [file], configurable: true });
  fireEvent.change(input!);
}

describe("File Upload", () => {
  it("opens a native file input and lists a chosen file", () => {
    render(<Upload />);

    const input = document.querySelector("input");

    expect(input).toHaveAttribute("type", "file");
    fireEvent.click(screen.getByRole("button", { name: "Browse" }));
    choose("notes.txt");

    expect(screen.getAllByText("notes.txt").length).toBeGreaterThan(0);
    expect(screen.queryByText("Uploading...")).toBeNull();
    expect(screen.getByRole("button", { name: "Remove file" })).toHaveAttribute(
      "title",
      "Remove file",
    );
  });

  it("reports an oversized file and removes it", () => {
    render(<Upload maxSize={1} />);
    choose("large.txt", "text/plain", "too-big");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "larger than the limit",
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove file" }));
    expect(screen.queryByText("large.txt")).toBeNull();
  });

  it("rejects a file outside accept and highlights a drag", () => {
    render(<Upload accept=".pdf" />);
    const zone = screen.getByRole("button", { name: "Browse" });

    fireEvent.dragOver(zone);
    expect(zone).toHaveAttribute("data-dragover", "true");
    expect(zone).toHaveTextContent("Drag files here");
    fireEvent.dragLeave(zone);
    expect(zone).toHaveTextContent("Browse");
    choose("photo.png", "image/png");

    expect(screen.getByRole("alert")).toHaveTextContent("not an accepted");
  });

  it("disables the dropzone", () => {
    render(<Upload disabled />);

    expect(screen.getByRole("button", { name: "Browse" })).toBeDisabled();
    expect(document.querySelector("input")).toBeDisabled();
  });

  it("keeps a long filename inside the dropzone width", () => {
    render(<Upload />);
    choose(
      "a-very-long-file-name-that-should-not-resize-the-upload-component.pdf",
    );

    const name = screen.getByText(
      "a-very-long-file-name-that-should-not-resize-the-upload-component.pdf",
    );
    const list = name.closest("ul");
    const zone = screen.getByRole("button", { name: "Browse" });

    expect(name).toHaveClass("truncate");
    expect(list).toHaveClass("w-full", "min-w-0", "max-w-full");
    expect(zone).toHaveClass("w-full", "max-w-full");
    expect(list?.parentElement).toHaveClass(
      "w-full",
      "min-w-0",
      "max-w-full",
      "overflow-hidden",
      "grid-cols-[minmax(0,1fr)]",
    );
  });

  it("shows uploading, uploaded, failed, and pending rows", () => {
    render(
      <FileUpload
        files={[
          {
            id: "uploading",
            file: new File(["a"], "report.pdf"),
            progress: 40,
          },
          {
            id: "done",
            file: new File(["b"], "portrait.png"),
            progress: 100,
          },
          {
            id: "failed",
            file: new File(["c"], "notes.txt"),
            error: "Upload failed",
          },
          { id: "pending", file: new File(["d"], "draft.txt") },
        ]}
      >
        <FileUploadDropzone>Browse</FileUploadDropzone>
        <FileUploadList />
      </FileUpload>,
    );

    expect(screen.getByText("Uploading...")).toBeInTheDocument();
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Upload failed");
    expect(screen.getByText("draft.txt")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Remove file" })).toHaveLength(
      4,
    );
    expect(
      screen.getByRole("button", { name: "Retry upload" }),
    ).toHaveAttribute("title", "Retry upload");
  });
});
