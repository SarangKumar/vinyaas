import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from ".";

function Items({ disabled = false }: { disabled?: boolean }) {
  return (
    <>
      <AccordionItem value="one">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First panel</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two" disabled={disabled}>
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second panel</AccordionContent>
      </AccordionItem>
    </>
  );
}

describe("Accordion", () => {
  it("opens one item at a time and can collapse it", () => {
    render(
      <Accordion>
        <Items />
      </Accordion>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });

    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(first).toHaveAttribute("aria-controls", expect.any(String));
    expect(first).toHaveClass("hover:underline", "underline-offset-4");
    expect(
      document.getElementById(first.getAttribute("aria-controls")!),
    ).toHaveAttribute("aria-hidden", "true");
    expect(
      document.getElementById(first.getAttribute("aria-controls")!),
    ).toHaveAttribute("data-state", "closed");

    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(
      document.getElementById(first.getAttribute("aria-controls")!),
    ).toHaveAttribute("aria-hidden", "false");
    expect(
      document.getElementById(first.getAttribute("aria-controls")!),
    ).toHaveAttribute("data-state", "open");

    fireEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });

  it("shows a chevron and stacks items with shared horizontal borders", () => {
    render(
      <Accordion>
        <Items />
      </Accordion>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const icon = first.querySelector("svg");
    const root = first.closest("[data-type]");
    const item = first.parentElement;

    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(first).toHaveAttribute("data-state", "closed");
    expect(root).toHaveClass("border-y", "divide-y");
    expect(root).not.toHaveClass("gap-2");
    expect(item).not.toHaveClass("border", "rounded-md");

    fireEvent.click(first);
    expect(first).toHaveAttribute("data-state", "open");
  });

  it("animates panel height with accordion-down and accordion-up keyframes", () => {
    const css = readFileSync(path.join(__dirname, "accordion.css"), "utf8");

    expect(css).toContain("@keyframes vinyaas-accordion-down");
    expect(css).toContain("@keyframes vinyaas-accordion-up");
    expect(css).toContain("height: var(--vinyaas-accordion-content-height)");
    expect(css).toContain("animation: vinyaas-accordion-down");
    expect(css).toContain("animation: vinyaas-accordion-up");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*\.vinyaas-accordion-down[\s\S]*animation:\s*none/,
    );

    render(
      <Accordion>
        <Items />
      </Accordion>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const panel = document.getElementById(first.getAttribute("aria-controls")!);

    expect(panel).toHaveClass("vinyaas-accordion-panel", "overflow-hidden");
    expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(panel).toHaveAttribute("data-state", "closed");
    expect(panel).not.toHaveClass(
      "vinyaas-accordion-down",
      "vinyaas-accordion-up",
    );
    expect(
      panel?.style.getPropertyValue("--vinyaas-accordion-content-height"),
    ).toMatch(/px$/);

    fireEvent.click(first);

    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(panel).toHaveAttribute("data-state", "open");
    expect(panel).toHaveClass("vinyaas-accordion-down");
    expect(panel).not.toHaveClass("vinyaas-accordion-up");

    fireEvent.click(first);

    expect(panel).toHaveAttribute("data-state", "closed");
    expect(panel).toHaveClass("vinyaas-accordion-up");
    expect(panel).not.toHaveClass("vinyaas-accordion-down");
  });

  it("keeps several items open when type is multiple", () => {
    render(
      <Accordion type="multiple">
        <Items />
      </Accordion>,
    );

    fireEvent.click(screen.getByRole("button", { name: "First" }));
    fireEvent.click(screen.getByRole("button", { name: "Second" }));

    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("opens the default value and reports controlled changes", () => {
    function Controlled() {
      const [value, setValue] = useState("one");

      return (
        <Accordion
          value={value}
          onValueChange={(next) => setValue(next ?? "one")}
        >
          <Items />
        </Accordion>
      );
    }

    render(
      <>
        <Accordion type="multiple" defaultValue={["two"]}>
          <Items />
        </Accordion>
        <Controlled />
      </>,
    );

    const defaults = screen.getAllByRole("button", { name: "Second" });

    expect(defaults[0]).toHaveAttribute("aria-expanded", "true");

    const controlledFirst = screen.getAllByRole("button", { name: "First" })[1];

    expect(controlledFirst).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getAllByRole("button", { name: "Second" })[1]!);
    expect(controlledFirst).toHaveAttribute("aria-expanded", "false");
  });

  it("does not open a disabled item and moves focus with the keyboard", () => {
    render(
      <Accordion collapsible={false} defaultValue="one">
        <Items disabled />
      </Accordion>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });

    expect(second).toBeDisabled();
    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");

    first.focus();
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first.parentElement!.parentElement!, { key: "End" });
    expect(document.activeElement).toBe(first);
  });
});
