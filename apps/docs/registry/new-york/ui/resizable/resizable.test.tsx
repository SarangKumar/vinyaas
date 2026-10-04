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

function HorizontalLayout() {
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
        <ResizableHandle aria-label="Resize sidebar" withHandle />
        <ResizablePanel defaultSize="70%" id="main">
          <div>Main</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function VerticalLayout() {
  return (
    <div style={{ width: 400, height: 300 }}>
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="25%" id="header">
          <div>Header</div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize header" />
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

  it("applies orientation-specific sizing and cursor classes on handles", () => {
    render(<HorizontalLayout />);

    const verticalBar = screen.getByRole("separator", {
      name: "Resize sidebar",
    });
    expect(verticalBar).toHaveAttribute("aria-orientation", "vertical");
    expect(verticalBar).toHaveAttribute("data-hit-area", "expanded");
    expect(verticalBar.className).toMatch(/\bw-px\b/);
    expect(verticalBar.className).toMatch(/cursor-col-resize/);
    expect(verticalBar.className).toMatch(/after:w-3/);
    expect(verticalBar.className).not.toMatch(/\bh-full\b/);
    expect(verticalBar.className).toMatch(/items-center/);
    expect(verticalBar.className).toMatch(/justify-center/);
    expect(
      verticalBar.querySelector('[data-slot="resizable-handle-grip"]'),
    ).toBeTruthy();
  });

  it("flips handle classes for vertical panel groups", () => {
    render(<VerticalLayout />);

    const horizontalBar = screen.getByRole("separator", {
      name: "Resize header",
    });
    expect(horizontalBar).toHaveAttribute("aria-orientation", "horizontal");
    expect(horizontalBar).toHaveAttribute("data-hit-area", "expanded");
    expect(horizontalBar.className).toMatch(
      /aria-\[orientation=horizontal\]:h-px/,
    );
    expect(horizontalBar.className).toMatch(
      /aria-\[orientation=horizontal\]:w-full/,
    );
    expect(horizontalBar.className).toMatch(
      /aria-\[orientation=horizontal\]:cursor-row-resize/,
    );
    expect(horizontalBar.className).toMatch(
      /aria-\[orientation=horizontal\]:after:h-3/,
    );
  });

  it("keeps library cursor management enabled for crossing handles", () => {
    const { container } = render(<HorizontalLayout />);
    const group = container.querySelector(
      '[data-slot="resizable-panel-group"]',
    );
    // Intersection / 2D cursors come from react-resizable-panels when
    // disableCursor is not set. We only provide orientation fallbacks.
    expect(group?.getAttribute("disablecursor")).toBeNull();
    expect(group?.outerHTML.toLowerCase()).not.toContain("disablecursor");
  });

  it("renders nested horizontal and vertical groups with oriented handles", () => {
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
    expect(outer.className).toMatch(/\bw-px\b/);
    expect(outer.className).toMatch(/cursor-col-resize/);
    expect(
      outer.querySelector('[data-slot="resizable-handle-grip"]'),
    ).toBeTruthy();

    expect(inner).toHaveAttribute("aria-orientation", "horizontal");
    expect(inner.className).toMatch(/aria-\[orientation=horizontal\]:w-full/);
    expect(inner.className).toMatch(
      /aria-\[orientation=horizontal\]:cursor-row-resize/,
    );
    expect(
      inner.querySelector('[data-slot="resizable-handle-grip"]'),
    ).toBeTruthy();

    const groups = document.querySelectorAll(
      '[data-slot="resizable-panel-group"]',
    );
    expect(groups).toHaveLength(2);
    expect(groups[1]?.className).toMatch(
      /aria-\[orientation=vertical\]:flex-col/,
    );
  });
});
