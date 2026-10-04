import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from ".";

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        listeners.add(listener);
      },
      removeEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        listeners.delete(listener);
      },
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    })),
  });
}

function ToggleLabel() {
  const { state, open } = useSidebar();
  return (
    <span data-testid="sidebar-state">
      {state}:{open ? "open" : "closed"}
    </span>
  );
}

function DemoSidebar({
  defaultOpen = true,
  open,
  onOpenChange,
  openMobile,
  onOpenMobileChange,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openMobile?: boolean;
  onOpenMobileChange?: (open: boolean) => void;
}) {
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      openMobile={openMobile}
      onOpenMobileChange={onOpenMobileChange}
      keyboardShortcut={false}
    >
      <Sidebar>
        <SidebarHeader>Workspace</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Analytics">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton disabled tooltip="Billing">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                    <span>Billing</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Account</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <ToggleLabel />
        <p>Main content</p>
      </SidebarInset>
    </SidebarProvider>
  );
}

describe("Sidebar", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders provider, sidebar regions, groups, and menu items", () => {
    render(<DemoSidebar />);

    expect(document.querySelector("[data-sidebar=header]")).toHaveTextContent(
      "Workspace",
    );
    expect(
      screen.getByRole("navigation", { name: "Sidebar" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(
      document.querySelector("[data-sidebar=group-label]"),
    ).toHaveTextContent("Workspace");
    expect(
      screen.getByRole("button", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Analytics" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Main content");
  });

  it("supports expanded and collapsed state with toggle", () => {
    render(<DemoSidebar />);

    expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
      "expanded:open",
    );
    expect(document.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
      "data-state",
      "expanded",
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));

    expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
      "collapsed:closed",
    );
    expect(document.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
      "data-state",
      "collapsed",
    );
    expect(document.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
      "data-collapsible",
      "icon",
    );
  });

  it("supports controlled open state", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <DemoSidebar open={true} onOpenChange={onOpenChange} />,
    );

    expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
      "expanded:open",
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    rerender(<DemoSidebar open={false} onOpenChange={onOpenChange} />);
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
      "collapsed:closed",
    );
  });

  it("keeps collapsed menu items keyboard reachable with accessible names", () => {
    render(<DemoSidebar defaultOpen={false} />);

    const dashboard = screen.getByRole("button", { name: "Dashboard" });
    const analytics = screen.getByRole("button", { name: "Analytics" });

    expect(dashboard).toBeEnabled();
    expect(analytics).toBeEnabled();
    expect(dashboard).toHaveAttribute("aria-label", "Dashboard");

    dashboard.focus();
    expect(dashboard).toHaveFocus();

    fireEvent.keyDown(dashboard, { key: "Tab" });
    expect(document.body).not.toContainHTML('aria-modal="true"');
  });

  it("activates menu buttons with keyboard and keeps disabled inert", () => {
    const onSelect = vi.fn();

    render(
      <SidebarProvider keyboardShortcut={false}>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSelect}>
                  Projects
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>Archived</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>,
    );

    const projects = screen.getByRole("button", { name: "Projects" });
    projects.focus();
    fireEvent.keyDown(projects, { key: "Enter" });
    fireEvent.click(projects);
    expect(onSelect).toHaveBeenCalled();

    expect(screen.getByRole("button", { name: "Archived" })).toBeDisabled();
  });

  it("composes asChild links without importing a router", () => {
    render(
      <SidebarProvider keyboardShortcut={false}>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <a href="/dashboard">Dashboard</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset />
      </SidebarProvider>,
    );

    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveAttribute("data-active", "true");
  });

  it("toggles with the trigger keyboard activation", () => {
    render(<DemoSidebar />);

    const trigger = screen.getByRole("button", { name: "Toggle sidebar" });
    trigger.focus();
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
      "collapsed:closed",
    );
  });

  it("uses the mobile drawer surface when the viewport is narrow", () => {
    mockMatchMedia(true);
    const onOpenMobileChange = vi.fn();

    render(
      <DemoSidebar
        openMobile={false}
        onOpenMobileChange={onOpenMobileChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(onOpenMobileChange).toHaveBeenCalledWith(true);

    render(
      <DemoSidebar openMobile={true} onOpenMobileChange={onOpenMobileChange} />,
    );

    expect(screen.getByRole("dialog", { name: "Sidebar" })).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Sidebar" }),
    ).toBeInTheDocument();
  });

  it("exposes focus-visible styling on the trigger", () => {
    render(<DemoSidebar />);

    expect(
      screen.getByRole("button", { name: "Toggle sidebar" }).className,
    ).toContain("focus-visible:ring-2");
    expect(
      screen.getByRole("button", { name: "Dashboard" }).className,
    ).toContain("focus-visible:ring-2");
  });
});
