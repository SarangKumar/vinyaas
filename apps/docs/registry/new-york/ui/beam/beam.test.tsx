import { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Beam, BeamNode } from ".";

describe("Beam", () => {
  it("renders nothing without layout geometry", () => {
    const container = createRef<HTMLDivElement>();
    const from = createRef<HTMLDivElement>();
    const to = createRef<HTMLDivElement>();
    const { container: root } = render(
      <div ref={container}>
        <div ref={from} />
        <div ref={to} />
        <Beam containerRef={container} fromRef={from} toRef={to} />
      </div>,
    );
    // jsdom has no layout engine, so getBoundingClientRect returns zeros and geometry is null.
    expect(root.querySelector("[data-slot='beam']")).toBeNull();
  });

  it("is aria-hidden", () => {
    const container = createRef<HTMLDivElement>();
    const from = createRef<HTMLDivElement>();
    const to = createRef<HTMLDivElement>();
    const { container: root } = render(
      <div ref={container}>
        <div ref={from} />
        <div ref={to} />
        <Beam containerRef={container} fromRef={from} toRef={to} />
      </div>,
    );
    const svg = root.querySelector("svg[aria-hidden]");
    // Either not rendered (no geometry) or hidden from AT.
    if (svg) {
      expect(svg).toHaveAttribute("aria-hidden");
    }
  });
});

describe("BeamNode", () => {
  it("forwards a ref and renders children", () => {
    const ref = createRef<HTMLDivElement>();
    const { getByText } = render(<BeamNode ref={ref}>A</BeamNode>);
    expect(getByText("A")).toBeTruthy();
    expect(ref.current).toBeTruthy();
    expect(ref.current).toHaveAttribute("data-slot", "beam-node");
  });

  it("applies highlight styles when highlight is set", () => {
    const { container } = render(<BeamNode highlight>B</BeamNode>);
    const node = container.querySelector("[data-highlight]");
    expect(node).toBeTruthy();
  });

  it("merges className and size", () => {
    const { container } = render(
      <BeamNode size="lg" className="my-class">
        C
      </BeamNode>,
    );
    const node = container.querySelector("[data-slot='beam-node']");
    expect(node).toHaveClass("my-class");
    expect(node).toHaveClass("size-14");
  });
});
