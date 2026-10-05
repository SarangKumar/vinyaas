import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
} from ".";

const sheetDir = path.dirname(fileURLToPath(import.meta.url));

function Example({
  defaultOpen = false,
  open,
  onOpenChange,
  side = "right",
  disableSave = false,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  side?: SheetSide;
  disableSave?: boolean;
}) {
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <SheetTrigger>
        <button type="button">Open sheet</button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>
            Manage the settings for this project.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>
            <button type="button" disabled={disableSave}>
              Save
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("stays closed until the trigger opens it", async () => {
    render(<Example />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));

    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("data-side", "right");
    expect(dialog.getAttribute("aria-labelledby")).toBe(
      screen.getByText("Project settings").id,
    );
    expect(dialog.getAttribute("aria-describedby")).toBe(
      screen.getByText("Manage the settings for this project.").id,
    );
    expect(dialog).toHaveClass("vinyaas-sheet-in-right");
    expect(document.querySelector("style")).toBeNull();

    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Close" }),
      );
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("ships sheet motion CSS beside the component", async () => {
    const css = await fs.readFile(path.join(sheetDir, "sheet.css"), "utf8");
    const source = await fs.readFile(path.join(sheetDir, "index.tsx"), "utf8");

    expect(source).toContain('import "./sheet.css"');
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("<style");
    expect(css).toContain("@keyframes vinyaas-sheet-in-right");
    expect(css).toContain("@keyframes vinyaas-sheet-out-left");
    expect(css).toContain(".vinyaas-sheet-in-top");
    expect(css).toContain(".vinyaas-sheet-out-bottom");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*\.vinyaas-sheet-in-right[\s\S]*animation:\s*none/,
    );
  });

  it("opens from defaultOpen and restores focus when closed", async () => {
    render(<Example defaultOpen />);

    const trigger = screen.getByRole("button", { name: "Open sheet" });
    await screen.findByRole("dialog");

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(document.activeElement).toBe(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("supports controlled open state, Escape, and the overlay", async () => {
    const changes: boolean[] = [];

    function Controlled() {
      const [open, setOpen] = useState(false);

      return (
        <Example
          open={open}
          onOpenChange={(next) => {
            changes.push(next);
            setOpen(next);
          }}
        />
      );
    }

    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");
    expect(changes).toContain(true);

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(changes).toContain(false);

    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));
    await screen.findByRole("dialog");
    fireEvent.click(document.querySelector('[data-slot="sheet-overlay"]')!);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("traps Tab and Shift+Tab inside the sheet", async () => {
    render(<Example defaultOpen />);
    await screen.findByRole("dialog");

    const close = screen.getByRole("button", { name: "Close" });
    const save = screen.getByRole("button", { name: "Save" });

    await waitFor(() => {
      expect(document.activeElement).toBe(close);
    });

    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Tab",
      shiftKey: true,
    });
    expect(document.activeElement).toBe(save);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" });
    expect(document.activeElement).toBe(close);
  });

  it("renders every supported side", async () => {
    const sides: SheetSide[] = ["left", "right", "top", "bottom"];

    for (const side of sides) {
      const { unmount } = render(<Example defaultOpen side={side} />);
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveAttribute("data-side", side);
      expect(dialog).toHaveClass(`vinyaas-sheet-in-${side}`);
      unmount();
    }
  });

  it("keeps disabled controls accessible without closing", async () => {
    render(<Example defaultOpen disableSave />);
    await screen.findByRole("dialog");

    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toBeDisabled();
    fireEvent.click(save);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
