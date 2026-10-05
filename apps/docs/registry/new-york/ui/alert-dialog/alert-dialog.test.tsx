import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from ".";

const alertDialogDir = path.dirname(fileURLToPath(import.meta.url));

function Example({
  defaultOpen = false,
  open,
  onOpenChange,
  actionDisabled = false,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  actionDisabled?: boolean;
}) {
  return (
    <AlertDialog
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <AlertDialogTrigger>
        <button type="button">Delete project</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={actionDisabled}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("AlertDialog", () => {
  it("stays closed until the trigger opens it", async () => {
    render(<Example />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete project" }));

    const dialog = await screen.findByRole("alertdialog");

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.getAttribute("aria-labelledby")).toBe(
      screen.getByText("Delete project?").id,
    );
    expect(dialog.getAttribute("aria-describedby")).toBe(
      screen.getByText("This action cannot be undone.").id,
    );
    expect(dialog).toHaveClass("vinyaas-alert-dialog-in");
    expect(document.querySelector("style")).toBeNull();
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Cancel" }),
      );
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("ships alert-dialog motion CSS beside the component", async () => {
    const css = await fs.readFile(
      path.join(alertDialogDir, "alert-dialog.css"),
      "utf8",
    );
    const source = await fs.readFile(
      path.join(alertDialogDir, "index.tsx"),
      "utf8",
    );

    expect(source).toContain('import "./alert-dialog.css"');
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("<style");
    expect(css).toContain("@keyframes vinyaas-alert-dialog-in");
    expect(css).toContain("@keyframes vinyaas-alert-dialog-out");
    expect(css).toContain(".vinyaas-alert-dialog-in");
    expect(css).toContain(".vinyaas-alert-dialog-out");
    expect(css).toContain("animation: vinyaas-alert-dialog-in 160ms ease-out");
    expect(css).toContain(
      "animation: vinyaas-alert-dialog-out 160ms ease-in forwards",
    );
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*\.vinyaas-alert-dialog-in[\s\S]*animation:\s*none/,
    );
  });

  it("closes from Cancel and restores focus to the trigger", async () => {
    render(<Example defaultOpen />);

    const trigger = screen.getByRole("button", { name: "Delete project" });
    await screen.findByRole("alertdialog");

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(document.activeElement).toBe(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("closes from Action and restores focus to the trigger", async () => {
    render(<Example defaultOpen />);

    const trigger = screen.getByRole("button", { name: "Delete project" });
    await screen.findByRole("alertdialog");

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(document.activeElement).toBe(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("supports controlled open state and Escape", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);

      return <Example open={open} onOpenChange={setOpen} />;
    }

    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: "Delete project" }));
    await screen.findByRole("alertdialog");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("does not close when the overlay is clicked", async () => {
    render(<Example defaultOpen />);
    await screen.findByRole("alertdialog");

    fireEvent.click(
      document.querySelector('[data-slot="alert-dialog-overlay"]')!,
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("traps Tab focus inside the dialog", async () => {
    render(<Example defaultOpen />);
    await screen.findByRole("alertdialog");

    const cancel = screen.getByRole("button", { name: "Cancel" });
    const action = screen.getByRole("button", { name: "Delete" });

    await waitFor(() => {
      expect(document.activeElement).toBe(cancel);
    });

    fireEvent.keyDown(screen.getByRole("alertdialog"), {
      key: "Tab",
      shiftKey: true,
    });
    expect(document.activeElement).toBe(action);

    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Tab" });
    expect(document.activeElement).toBe(cancel);
  });

  it("keeps a disabled action from closing the dialog", async () => {
    render(<Example defaultOpen actionDisabled />);
    await screen.findByRole("alertdialog");

    const action = screen.getByRole("button", { name: "Delete" });
    expect(action).toBeDisabled();
    fireEvent.click(action);

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
});
