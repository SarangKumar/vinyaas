import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

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
    expect(
      document.getElementById(first.getAttribute("aria-controls")!),
    ).toHaveAttribute("hidden");

    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(
      document.getElementById(first.getAttribute("aria-controls")!),
    ).not.toHaveAttribute("hidden");

    fireEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
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
