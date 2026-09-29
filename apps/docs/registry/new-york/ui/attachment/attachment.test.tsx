import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from ".";

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" />
    </svg>
  );
}

describe("Attachment", () => {
  it("renders media, title, description, and an action", () => {
    render(
      <Attachment>
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove sales-dashboard.pdf">
            Remove
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>,
    );

    expect(screen.getByText("sales-dashboard.pdf")).toHaveAttribute(
      "data-slot",
      "attachment-title",
    );
    expect(screen.getByText("PDF · 2.4 MB")).toHaveAttribute(
      "data-slot",
      "attachment-description",
    );
    expect(
      screen.getByRole("button", { name: "Remove sales-dashboard.pdf" }),
    ).toBeInTheDocument();
  });

  it("marks uploading and error states on the root", () => {
    const { rerender } = render(
      <Attachment state="uploading" aria-label="Upload">
        <AttachmentTitle>report.pdf</AttachmentTitle>
      </Attachment>,
    );

    expect(screen.getByLabelText("Upload")).toHaveAttribute(
      "data-state",
      "uploading",
    );

    rerender(
      <Attachment state="error" aria-label="Upload">
        <AttachmentTitle>report.pdf</AttachmentTitle>
        <AttachmentDescription>Upload failed. Try again.</AttachmentDescription>
      </Attachment>,
    );

    expect(screen.getByLabelText("Upload")).toHaveAttribute(
      "data-state",
      "error",
    );
    expect(screen.getByText("Upload failed. Try again.")).toBeInTheDocument();
  });

  it("fires the trigger without blocking actions", () => {
    const onTrigger = vi.fn();
    const onRemove = vi.fn();

    render(
      <Attachment>
        <AttachmentContent>
          <AttachmentTitle>notes.pdf</AttachmentTitle>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove notes.pdf" onClick={onRemove}>
            Remove
          </AttachmentAction>
        </AttachmentActions>
        <AttachmentTrigger aria-label="Open notes.pdf" onClick={onTrigger} />
      </Attachment>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open notes.pdf" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove notes.pdf" }));

    expect(onTrigger).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("lays out a group of attachments", () => {
    const { container } = render(
      <AttachmentGroup>
        <Attachment>
          <AttachmentTitle>one.pdf</AttachmentTitle>
        </Attachment>
        <Attachment>
          <AttachmentTitle>two.pdf</AttachmentTitle>
        </Attachment>
      </AttachmentGroup>,
    );

    expect(
      container.querySelector('[data-slot="attachment-group"]'),
    ).toHaveClass("overflow-x-auto");
    expect(screen.getByText("one.pdf")).toBeInTheDocument();
    expect(screen.getByText("two.pdf")).toBeInTheDocument();
  });
});
