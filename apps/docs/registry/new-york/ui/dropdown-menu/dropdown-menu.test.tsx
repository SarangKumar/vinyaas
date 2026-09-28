import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function Menu({ align = "end" }: { align?: "start" | "center" | "end" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          type="button"
          aria-label="More actions"
          size="icon-sm"
          variant="ghost"
        >
          …
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("opens from the trigger and renders menu parts", async () => {
    render(<Menu />);

    const trigger = screen.getByRole("button", { name: "More actions" });

    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(trigger);

    const menu = screen.getByRole("menu");

    expect(menu).toHaveAttribute("data-align", "end");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", menu.id);
    expect(screen.getByText("Account").tagName).toBe("DIV");
    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(screen.getByText("⌘P")).toHaveClass("ml-auto");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveClass(
      "text-destructive",
    );
    expect(screen.getByRole("menuitem", { name: "Billing" })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: /Profile/ })).toHaveFocus();
    });
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "More actions" });

    fireEvent.click(trigger);
    await screen.findByRole("menu");
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("moves with the arrow keys and runs an item", async () => {
    const onDelete = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button type="button">Open</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveFocus();
    });

    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();

    fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes when the pointer goes outside the menu", async () => {
    render(<Menu />);
    fireEvent.click(screen.getByRole("button", { name: "More actions" }));
    await screen.findByRole("menu");
    fireEvent.pointerDown(document.body);

    expect(screen.queryByRole("menu")).toBeNull();
  });
});
