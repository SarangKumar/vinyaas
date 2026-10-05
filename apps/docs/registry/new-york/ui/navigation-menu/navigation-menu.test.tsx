import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../badge";
import { Button } from "../button";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from ".";

const menuDir = path.dirname(fileURLToPath(import.meta.url));

function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Badge>New</Badge>
                <Button type="button">Explore</Button>
              </CardContent>
            </Card>
            <NavigationMenuLink href="/workspace">Workspace</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="docs">
          <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/docs/start">
              Get started
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

describe("NavigationMenu", () => {
  it("renders closed and opens from the trigger", async () => {
    render(<Example />);

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: /Products/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    const region = await screen.findByRole("region");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(region).toHaveAttribute(
      "aria-labelledby",
      trigger.getAttribute("id"),
    );
    expect(region.getAttribute("id")).toBe(
      trigger.getAttribute("aria-controls"),
    );
    expect(screen.getByRole("link", { name: "Workspace" })).toHaveAttribute(
      "href",
      "/workspace",
    );
  });

  it("ships motion CSS beside the component", async () => {
    const css = await fs.readFile(
      path.join(menuDir, "navigation-menu.css"),
      "utf8",
    );
    const source = await fs.readFile(path.join(menuDir, "index.tsx"), "utf8");

    expect(source).toContain('import "./navigation-menu.css"');
    expect(css).toContain("@keyframes vinyaas-navigation-menu-in");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("closes with Escape and restores trigger expanded state", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: /Products/i });
    fireEvent.click(trigger);
    await screen.findByRole("region");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("region")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("switches content when another trigger is activated", async () => {
    render(<Example />);
    fireEvent.click(screen.getByRole("button", { name: /Products/i }));
    await screen.findByRole("link", { name: "Workspace" });

    fireEvent.click(screen.getByRole("button", { name: /Docs/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: "Workspace" }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: "Get started" }),
    ).toBeInTheDocument();
  });

  it("supports arrow key navigation across triggers", async () => {
    render(<Example />);
    const products = screen.getByRole("button", { name: /Products/i });
    const docs = screen.getByRole("button", { name: /Docs/i });
    products.focus();

    fireEvent.keyDown(screen.getByRole("list"), { key: "ArrowRight" });
    expect(document.activeElement).toBe(docs);

    fireEvent.keyDown(screen.getByRole("list"), { key: "ArrowLeft" });
    expect(document.activeElement).toBe(products);

    fireEvent.keyDown(screen.getByRole("list"), { key: "Home" });
    expect(document.activeElement).toBe(products);

    fireEvent.keyDown(screen.getByRole("list"), { key: "End" });
    expect(document.activeElement).toBe(docs);
  });

  it("opens with Enter and Space", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: /Products/i });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    await screen.findByRole("region");

    fireEvent.keyDown(trigger, { key: " " });
    await waitFor(() => {
      expect(screen.queryByRole("region")).not.toBeInTheDocument();
    });
  });

  it("moves focus into content with ArrowDown and back with ArrowUp", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: /Products/i });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    const explore = await screen.findByRole("button", { name: "Explore" });
    await waitFor(() => {
      expect(document.activeElement).toBe(explore);
    });

    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowUp" });
    expect(document.activeElement).toBe(trigger);
  });

  it("renders arbitrary composed content and keeps it interactive", async () => {
    render(<Example />);
    fireEvent.click(screen.getByRole("button", { name: /Products/i }));
    const region = await screen.findByRole("region");

    expect(within(region).getByText("Analytics")).toBeInTheDocument();
    expect(within(region).getByText("New")).toBeInTheDocument();
    expect(
      within(region).getByRole("button", { name: "Explore" }),
    ).toBeEnabled();
  });

  it("allows Tab to leave the navigation menu", async () => {
    render(
      <>
        <Example />
        <button type="button">After</button>
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Products/i }));
    await screen.findByRole("region");

    const after = screen.getByRole("button", { name: "After" });
    after.focus();
    expect(document.activeElement).toBe(after);
  });
});
