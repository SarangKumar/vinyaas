import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FuseButton } from ".";

describe("FuseButton", () => {
  it("shows children in idle state", () => {
    render(
      <FuseButton
        active={false}
        onActivate={() => {}}
        onFire={() => {}}
        onUndo={() => {}}
      >
        Delete
      </FuseButton>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Delete");
  });

  it("calls onActivate when clicked while idle", () => {
    const onActivate = vi.fn();
    render(
      <FuseButton
        active={false}
        onActivate={onActivate}
        onFire={() => {}}
        onUndo={() => {}}
      >
        Delete
      </FuseButton>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it("shows undo label with countdown when active", () => {
    render(
      <FuseButton
        active={true}
        onActivate={() => {}}
        onFire={() => {}}
        onUndo={() => {}}
        duration={5000}
        undoLabel="Undo"
      >
        Delete
      </FuseButton>,
    );
    expect(screen.getByRole("button")).toHaveTextContent(/Undo/);
    expect(screen.getByRole("button")).toHaveTextContent(/5s/);
  });

  it("calls onUndo when clicked while active", () => {
    const onUndo = vi.fn();
    render(
      <FuseButton
        active={true}
        onActivate={() => {}}
        onFire={() => {}}
        onUndo={onUndo}
      >
        Delete
      </FuseButton>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("stays enabled while active even if disabled prop is set", () => {
    render(
      <FuseButton
        active={true}
        disabled
        onActivate={() => {}}
        onFire={() => {}}
        onUndo={() => {}}
      >
        Delete
      </FuseButton>,
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("shows only the seconds countdown for icon sizes when active", () => {
    render(
      <FuseButton
        active={true}
        size="icon"
        onActivate={() => {}}
        onFire={() => {}}
        onUndo={() => {}}
        duration={3000}
        aria-label="Delete"
      >
        ×
      </FuseButton>,
    );
    const btn = screen.getByRole("button");
    // Icon mode shows just the number, not "Undo"
    expect(btn).not.toHaveTextContent(/Undo/);
    expect(btn.querySelector("span")?.textContent).toMatch(/^\d+$/);
  });

  it("merges className onto the button", () => {
    render(
      <FuseButton
        active={false}
        className="my-test-class"
        onActivate={() => {}}
        onFire={() => {}}
        onUndo={() => {}}
      >
        Send
      </FuseButton>,
    );
    expect(screen.getByRole("button")).toHaveClass("my-test-class");
  });
});
