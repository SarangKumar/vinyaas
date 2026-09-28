import type { ComponentProps } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FileUpload, FileUploadDropzone, FileUploadList } from "./file-upload";

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
    expect(
      screen.getByRole("progressbar", {
        name: "Upload progress for notes.txt",
      }),
    ).toBeInTheDocument();
  });

  it("reports an oversized file and removes it", () => {
    render(<Upload maxSize={1} />);
    choose("large.txt", "text/plain", "too-big");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "larger than the limit",
    );
    fireEvent.click(screen.getByRole("button", { name: /Remove/ }));
    expect(screen.queryByText("large.txt")).toBeNull();
  });

  it("rejects a file outside accept and highlights a drag", () => {
    render(<Upload accept=".pdf" />);
    const zone = screen.getByRole("button", { name: "Browse" });

    fireEvent.dragOver(zone);
    expect(zone).toHaveAttribute("data-dragover", "true");
    choose("photo.png", "image/png");

    expect(screen.getByRole("alert")).toHaveTextContent("not an accepted");
  });

  it("disables the dropzone", () => {
    render(<Upload disabled />);

    expect(screen.getByRole("button", { name: "Browse" })).toBeDisabled();
    expect(document.querySelector("input")).toBeDisabled();
  });
});
