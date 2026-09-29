import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from ".";

const drawerDir = path.dirname(fileURLToPath(import.meta.url));

function Example({
  defaultOpen = false,
  side = "right" as const,
}: {
  defaultOpen?: boolean;
  side?: "left" | "right" | "top" | "bottom";
}) {
  return (
    <Drawer defaultOpen={defaultOpen}>
      <DrawerTrigger>
        <button type="button">Open drawer</button>
      </DrawerTrigger>
      <DrawerContent side={side}>
        <DrawerTitle>Filters</DrawerTitle>
        <DrawerDescription>Refine the product list.</DrawerDescription>
        <DrawerClose>
          <button type="button">Close</button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("opens from the trigger and exposes dialog semantics", async () => {
    render(<Example />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open drawer" }));

    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("data-side", "right");
    expect(dialog).toHaveClass("vinyaas-drawer-in-right");
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Close" }),
      );
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("closes with Escape and restores focus to the trigger", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open drawer" });
    fireEvent.click(trigger);

    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(document.activeElement).toBe(trigger);
    });
  });

  it("supports controlled open state", async () => {
    function Controlled() {
      const [open, setOpen] = useState(true);

      return (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger>
            <button type="button">Toggle</button>
          </DrawerTrigger>
          <DrawerContent side="left">
            <DrawerTitle>Account</DrawerTitle>
            <DrawerClose>
              <button type="button">Dismiss</button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      );
    }

    render(<Controlled />);

    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "left");
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("ships drawer motion CSS beside the component", async () => {
    const css = await fs.readFile(path.join(drawerDir, "drawer.css"), "utf8");
    const source = await fs.readFile(path.join(drawerDir, "index.tsx"), "utf8");

    expect(source).toContain('import "./drawer.css"');
    expect(css).toContain("@keyframes vinyaas-drawer-in-right");
    expect(css).toContain(".vinyaas-drawer-in-left");
  });
});
