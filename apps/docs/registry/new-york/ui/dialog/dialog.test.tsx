import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const dialogDir = path.dirname(fileURLToPath(import.meta.url));

function Example({
  defaultOpen = false,
  open,
  onOpenChange,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <button type="button">Open dialog</button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Update your public profile.</DialogDescription>
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("stays closed until the trigger opens it", async () => {
    render(<Example />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.getAttribute("aria-labelledby")).toBe(
      screen.getByText("Edit profile").id,
    );
    expect(dialog.getAttribute("aria-describedby")).toBe(
      screen.getByText("Update your public profile.").id,
    );
    expect(dialog).toHaveClass("vinyaas-dialog-in");
    expect(document.querySelector("style")).toBeNull();
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Close" }),
      );
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("ships dialog motion CSS beside the component", async () => {
    const css = await fs.readFile(path.join(dialogDir, "dialog.css"), "utf8");
    const source = await fs.readFile(
      path.join(dialogDir, "dialog.tsx"),
      "utf8",
    );

    expect(source).toContain('import "./dialog.css"');
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("<style");
    expect(css).toContain("@keyframes vinyaas-dialog-in");
    expect(css).toContain("@keyframes vinyaas-dialog-out");
    expect(css).toContain(".vinyaas-dialog-in");
    expect(css).toContain(".vinyaas-dialog-out");
    expect(css).toContain("animation: vinyaas-dialog-in 160ms ease-out");
    expect(css).toContain(
      "animation: vinyaas-dialog-out 160ms ease-in forwards",
    );
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*\.vinyaas-dialog-in[\s\S]*animation:\s*none/,
    );
  });

  it("opens from defaultOpen and restores focus when closed", async () => {
    render(<Example defaultOpen />);

    const dialog = await screen.findByRole("dialog");
    const trigger = screen.getByRole("button", { name: "Open dialog" });

    expect(dialog).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(document.activeElement).toBe(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("supports a controlled open state, Escape, and the overlay", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);

      return <Example open={open} onOpenChange={setOpen} />;
    }

    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    await screen.findByRole("dialog");
    fireEvent.click(document.querySelector("[data-dialog-overlay]")!);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
