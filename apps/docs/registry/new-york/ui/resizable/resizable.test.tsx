import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from ".";

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: ResizeObserverMock,
  });

  Object.defineProperty(globalThis, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: ResizeObserverMock,
  });
});

function HorizontalLayout({ withHandle = true }: { withHandle?: boolean }) {
  return (
    <div style={{ width: 400, height: 200 }}>
      <ResizablePanelGroup orientation="horizontal" aria-label="Workspace">
        <ResizablePanel
          defaultSize="30%"
          minSize="15%"
          maxSize="60%"
          id="sidebar"
        >
          <div>Sidebar</div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize sidebar" withHandle={withHandle} />
        <ResizablePanel defaultSize="70%" id="main">
          <div>Main</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function VerticalLayout({ withHandle = false }: { withHandle?: boolean }) {
  return (
    <div style={{ width: 400, height: 300 }}>
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="25%" id="header">
          <div>Header</div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize header" withHandle={withHandle} />
        <ResizablePanel defaultSize="50%" id="content">
          <div>Content</div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize footer" />
        <ResizablePanel defaultSize="25%" id="footer">
          <div>Footer</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function gripDots(handle: HTMLElement) {
  return handle.querySelectorAll(
    '[data-slot="resizable-handle-grip-dots"] > span',
  );
}

function gripDotsEl(handle: HTMLElement) {
  return handle.querySelector(
    '[data-slot="resizable-handle-grip-dots"]',
  ) as HTMLElement | null;
}

describe("Resizable", () => {
  it("renders a horizontal group with panels and a separator handle", () => {
    render(<HorizontalLayout />);

    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();

    const handle = screen.getByRole("separator", { name: "Resize sidebar" });
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    expect(handle).toHaveAttribute("data-slot", "resizable-handle");
    expect(handle).toHaveAttribute("tabindex", "0");
  });

  it("renders a vertical multi-panel layout", () => {
    render(<VerticalLayout />);

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();

    const handles = screen.getAllByRole("separator");
    expect(handles).toHaveLength(2);
    for (const handle of handles) {
      expect(handle).toHaveAttribute("aria-orientation", "horizontal");
      expect(handle).toHaveAttribute("tabindex", "0");
    }
  });

  it("keeps resize handles keyboard focusable and labeled", () => {
    render(<HorizontalLayout />);

    const handle = screen.getByRole("separator", { name: "Resize sidebar" });
    handle.focus();
    expect(handle).toHaveFocus();
    expect(handle.className).toMatch(/focus-visible:ring/);
  });

  it("disables a handle without trapping focus", () => {
    render(
      <div style={{ width: 400, height: 200 }}>
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="50%" id="a">
            Left
          </ResizablePanel>
          <ResizableHandle aria-label="Disabled resize" disabled />
          <ResizablePanel defaultSize="50%" id="b">
            Right
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );

    const handle = screen.getByRole("separator", { name: "Disabled resize" });
    expect(handle).toHaveAttribute("aria-disabled", "true");
    expect(handle.className).toMatch(/opacity-50|pointer-events-none/);
    expect(handle.getAttribute("tabindex")).not.toBe("0");
  });

  it("accepts size constraints on panels", () => {
    const { container } = render(<HorizontalLayout />);
    const group = container.querySelector(
      '[data-slot="resizable-panel-group"]',
    );
    expect(group).toBeTruthy();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("does not create a keyboard trap around the handle", () => {
    render(
      <div>
        <button type="button">Before</button>
        <HorizontalLayout />
        <button type="button">After</button>
      </div>,
    );

    const before = screen.getByRole("button", { name: "Before" });
    const after = screen.getByRole("button", { name: "After" });
    const handle = screen.getByRole("separator", { name: "Resize sidebar" });

    before.focus();
    expect(before).toHaveFocus();
    handle.focus();
    expect(handle).toHaveFocus();
    after.focus();
    expect(after).toHaveFocus();
  });

  it("uses a padded 2×3 grip on vertical separators (horizontal resize)", () => {
    render(<HorizontalLayout withHandle />);

    const handle = screen.getByRole("separator", { name: "Resize sidebar" });
    const grip = handle.querySelector(
      '[data-slot="resizable-handle-grip"]',
    ) as HTMLElement | null;
    const dots = gripDotsEl(handle);

    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    expect(grip).toBeTruthy();
    expect(grip).toHaveAttribute("aria-hidden", "true");
    expect(grip?.className).toMatch(/bg-secondary/);
    expect(grip?.className).toMatch(/rounded-sm/);
    expect(grip?.className).toMatch(/(?:^|\s)p-1(?:\s|$)/);
    expect(grip?.className).not.toMatch(/(?:^|\s)border(?:\s|$)/);
    expect(grip?.className).toMatch(
      /group-aria-\[orientation=horizontal\]\/resizable-handle:rotate-90/,
    );
    expect(gripDots(handle)).toHaveLength(6);
    expect(dots?.className).toMatch(/grid-cols-2/);
    expect(
      handle.querySelector('[data-slot="resizable-handle-grip-dots"] > span')
        ?.className,
    ).toMatch(/bg-foreground/);
    expect(handle.className).toMatch(/cursor-col-resize/);
    expect(handle).toHaveAttribute("data-hit-area", "expanded");
  });

  it("rotates the 2×3 grip 90° on horizontal separators (vertical resize)", () => {
    render(<VerticalLayout withHandle />);

    const handle = screen.getByRole("separator", { name: "Resize header" });
    const grip = handle.querySelector(
      '[data-slot="resizable-handle-grip"]',
    ) as HTMLElement | null;
    const dots = gripDotsEl(handle);

    expect(handle).toHaveAttribute("aria-orientation", "horizontal");
    expect(handle.className).toMatch(
      /aria-\[orientation=horizontal\]:cursor-row-resize/,
    );
    expect(gripDots(handle)).toHaveLength(6);
    expect(dots?.className).toMatch(/grid-cols-2/);
    expect(grip?.className).toMatch(
      /group-aria-\[orientation=horizontal\]\/resizable-handle:rotate-90/,
    );
    expect(grip?.className).toMatch(/bg-secondary/);
    expect(grip?.className).toMatch(/(?:^|\s)p-1(?:\s|$)/);
    expect(grip?.className).not.toMatch(/(?:^|\s)border(?:\s|$)/);
  });

  it("omits the grip when withHandle is false", () => {
    render(<HorizontalLayout withHandle={false} />);

    const handle = screen.getByRole("separator", { name: "Resize sidebar" });
    expect(
      handle.querySelector('[data-slot="resizable-handle-grip"]'),
    ).toBeNull();
  });

  it("keeps library cursor management enabled for crossing handles", () => {
    const { container } = render(<HorizontalLayout />);
    const group = container.querySelector(
      '[data-slot="resizable-panel-group"]',
    );
    expect(group?.getAttribute("disablecursor")).toBeNull();
    expect(group?.outerHTML.toLowerCase()).not.toContain("disablecursor");
  });

  it("renders nested horizontal and vertical groups with oriented grips", () => {
    render(
      <div style={{ width: 384, height: 200 }}>
        <ResizablePanelGroup orientation="horizontal" className="max-w-sm">
          <ResizablePanel defaultSize="50%" id="one">
            <div>One</div>
          </ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize outer" />
          <ResizablePanel defaultSize="50%" id="nested">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="25%" id="two">
                <div>Two</div>
              </ResizablePanel>
              <ResizableHandle withHandle aria-label="Resize inner" />
              <ResizablePanel defaultSize="75%" id="three">
                <div>Three</div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );

    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.getByText("Three")).toBeInTheDocument();

    const outer = screen.getByRole("separator", { name: "Resize outer" });
    const inner = screen.getByRole("separator", { name: "Resize inner" });

    expect(outer).toHaveAttribute("aria-orientation", "vertical");
    expect(outer.className).toMatch(/cursor-col-resize/);
    expect(gripDots(outer)).toHaveLength(6);

    expect(inner).toHaveAttribute("aria-orientation", "horizontal");
    expect(inner.className).toMatch(
      /aria-\[orientation=horizontal\]:cursor-row-resize/,
    );
    expect(gripDots(inner)).toHaveLength(6);

    const groups = document.querySelectorAll(
      '[data-slot="resizable-panel-group"]',
    );
    expect(groups).toHaveLength(2);
  });

  it("renders the blocks variant as separate bordered panels with a dots gutter", () => {
    const { container } = render(
      <div style={{ width: 400, height: 200 }}>
        <ResizablePanelGroup orientation="horizontal" variant="blocks">
          <ResizablePanel defaultSize="50%" id="left">
            <div>Left</div>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize blocks" />
          <ResizablePanel defaultSize="50%" id="right">
            <div>Right</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );

    const group = container.querySelector(
      "[data-slot='resizable-panel-group']",
    );
    const handle = screen.getByRole("separator", { name: "Resize blocks" });
    const panels = container.querySelectorAll("[data-slot='resizable-panel']");

    expect(group).toHaveAttribute("data-variant", "blocks");
    expect(panels).toHaveLength(2);

    // The library applies className to the panel's inner element.
    for (const panel of panels) {
      expect(panel.firstElementChild).toHaveClass(
        "rounded-lg",
        "border",
        "overflow-hidden",
      );
    }

    expect(handle).toHaveClass("w-2", "bg-transparent");
    expect(handle.querySelectorAll("circle")).toHaveLength(3);
    expect(
      handle.querySelector("[data-slot='resizable-handle-dots']"),
    ).toBeInTheDocument();
    expect(
      handle.querySelector("[data-slot='resizable-handle-grip']"),
    ).toBeNull();
  });

  it("lets the blocks variant hide the dots with withHandle={false}", () => {
    render(
      <div style={{ width: 400, height: 200 }}>
        <ResizablePanelGroup orientation="horizontal" variant="blocks">
          <ResizablePanel defaultSize="50%" id="left">
            <div>Left</div>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize blocks" withHandle={false} />
          <ResizablePanel defaultSize="50%" id="right">
            <div>Right</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );

    expect(
      screen
        .getByRole("separator", { name: "Resize blocks" })
        .querySelector("[data-slot='resizable-handle-dots']"),
    ).toBeNull();
  });
});
