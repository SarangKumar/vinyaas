import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from ".";

function BasicTabs(
  props: {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
  } = {},
) {
  return (
    <Tabs defaultValue="account" {...props}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account panel</TabsContent>
      <TabsContent value="password">Password panel</TabsContent>
      <TabsContent value="billing">Billing panel</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the default panel and switches on trigger click", () => {
    render(<BasicTabs />);

    const account = screen.getByRole("tab", { name: "Account" });
    const password = screen.getByRole("tab", { name: "Password" });

    expect(account).toHaveAttribute("aria-selected", "true");
    expect(password).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account panel");
    expect(screen.queryByText("Password panel")).toBeNull();

    fireEvent.click(password);

    expect(account).toHaveAttribute("aria-selected", "false");
    expect(password).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Password panel");
  });

  it("wires aria relationships and keeps inactive tabs out of the tab order", () => {
    render(<BasicTabs />);

    const account = screen.getByRole("tab", { name: "Account" });
    const password = screen.getByRole("tab", { name: "Password" });
    const panel = screen.getByRole("tabpanel");

    expect(account).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", account.id);
    expect(account).toHaveAttribute("tabIndex", "0");
    expect(password).toHaveAttribute("tabIndex", "-1");
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("skips disabled triggers and does not activate them", () => {
    render(<BasicTabs />);

    const billing = screen.getByRole("tab", { name: "Billing" });

    expect(billing).toBeDisabled();
    fireEvent.click(billing);
    expect(billing).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account panel");
  });

  it("moves focus with arrow keys without changing the selection", () => {
    render(<BasicTabs />);

    const account = screen.getByRole("tab", { name: "Account" });
    const password = screen.getByRole("tab", { name: "Password" });
    const list = screen.getByRole("tablist");

    account.focus();
    fireEvent.keyDown(list, { key: "ArrowRight" });

    expect(document.activeElement).toBe(password);
    expect(account).toHaveAttribute("aria-selected", "true");
    expect(password).toHaveAttribute("aria-selected", "false");

    fireEvent.keyDown(list, { key: "End" });
    expect(document.activeElement).toBe(password);

    fireEvent.keyDown(list, { key: "Home" });
    expect(document.activeElement).toBe(account);
  });

  it("supports controlled values and className customization", () => {
    function Controlled() {
      const [value, setValue] = useState("password");

      return (
        <Tabs value={value} onValueChange={setValue} className="gap-4">
          <TabsList className="bg-background">
            <TabsTrigger value="account" className="px-4">
              Account
            </TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="pt-2">
            Account panel
          </TabsContent>
          <TabsContent value="password">Password panel</TabsContent>
        </Tabs>
      );
    }

    const { container } = render(<Controlled />);

    expect(screen.getByRole("tab", { name: "Password" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Password panel");
    expect(container.firstChild).toHaveClass("gap-4");
    expect(screen.getByRole("tablist")).toHaveClass("bg-background");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveClass("px-4");

    fireEvent.click(screen.getByRole("tab", { name: "Account" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account panel");
  });

  it("uses vertical orientation semantics and layout tokens", () => {
    render(<BasicTabs orientation="vertical" />);

    const list = screen.getByRole("tablist");
    const root = list.parentElement;

    expect(list).toHaveAttribute("aria-orientation", "vertical");
    expect(list).toHaveClass("flex-col");
    expect(root).toHaveAttribute("data-orientation", "vertical");
    expect(root).toHaveClass("flex-row");
    expect(list).toHaveClass("bg-muted");
  });

  it("supports the line list variant", () => {
    const { container } = render(
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const list = screen.getByRole("tablist");
    const overview = screen.getByRole("tab", { name: "Overview" });

    expect(list).toHaveAttribute("data-variant", "line");
    expect(list).toHaveClass("bg-transparent");
    expect(list).not.toHaveClass("bg-muted");
    expect(overview).toHaveAttribute("data-state", "active");
    expect(
      container.querySelector('[data-orientation="horizontal"]'),
    ).toHaveClass("group/tabs");
  });
});
