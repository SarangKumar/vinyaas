import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Tooltip } from "./tooltip";

const tooltipDir = path.dirname(fileURLToPath(import.meta.url));

describe("Tooltip", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows on focus, links the tooltip, and does not move focus", () => {
    render(
      <Tooltip content="Saved locally">
        <button type="button">Hint</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Hint" });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => {
      trigger.focus();
    });

    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).toHaveTextContent("Saved locally");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    expect(trigger).toHaveFocus();
    expect(tooltip).not.toHaveAttribute("tabindex");
  });

  it("waits for the hover delay, then hides on Escape", () => {
    vi.useFakeTimers();

    render(
      <Tooltip content="Saved locally" delayDuration={400} side="right">
        <button type="button">Hint</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Hint" });

    fireEvent.mouseEnter(trigger.parentElement!);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).toHaveAttribute("data-side", "right");
    expect(tooltip.querySelector("[data-tooltip-arrow]")).toHaveClass(
      "border-r-foreground",
      "pointer-events-none",
    );

    fireEvent.keyDown(trigger, { key: "Escape" });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("merges a class name onto the tooltip", () => {
    render(
      <Tooltip content="Saved locally" className="max-w-sm" delayDuration={0}>
        <button type="button">Hint</button>
      </Tooltip>,
    );

    act(() => {
      screen.getByRole("button", { name: "Hint" }).focus();
    });

    expect(screen.getByRole("tooltip")).toHaveClass("text-sm", "max-w-sm");
    expect(screen.getByRole("tooltip")).toHaveClass("vinyaas-tooltip-in");
    expect(document.querySelector("style")).toBeNull();
  });

  it("ships directional tooltip motion CSS beside the component", async () => {
    const css = await fs.readFile(path.join(tooltipDir, "tooltip.css"), "utf8");
    const source = await fs.readFile(
      path.join(tooltipDir, "tooltip.tsx"),
      "utf8",
    );

    expect(source).toContain('import "./tooltip.css"');
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("<style");
    expect(css).toContain("@keyframes vinyaas-tooltip-in");
    expect(css).toContain("@keyframes vinyaas-tooltip-in-bottom");
    expect(css).toContain("@keyframes vinyaas-tooltip-in-left");
    expect(css).toContain("@keyframes vinyaas-tooltip-in-right");
    expect(css).toContain(".vinyaas-tooltip-in");
    expect(css).toContain('.vinyaas-tooltip-in[data-side="bottom"]');
    expect(css).toContain('.vinyaas-tooltip-in[data-side="left"]');
    expect(css).toContain('.vinyaas-tooltip-in[data-side="right"]');
    expect(css).toContain("transform-origin: center bottom");
    expect(css).toContain("transform-origin: center top");
    expect(css).toContain("transform-origin: right center");
    expect(css).toContain("transform-origin: left center");
    expect(css).toContain(
      "animation: vinyaas-tooltip-in 160ms cubic-bezier(0.22, 1.25, 0.36, 1)",
    );
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*\.vinyaas-tooltip-in[\s\S]*animation:\s*none/,
    );
  });
});
