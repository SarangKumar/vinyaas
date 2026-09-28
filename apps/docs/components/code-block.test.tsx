import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeBlock } from "./code-block";

const shortCode = "vinyaas add button";
const longCode = Array.from(
  { length: 20 },
  (_, index) => `line ${index + 1}`,
).join("\n");

describe("CodeBlock", () => {
  it("shows short code without a view control", () => {
    render(<CodeBlock code={shortCode} language="bash" />);

    expect(screen.getByText(shortCode)).toBeInTheDocument();
    expect(screen.getByText("bash")).toBeInTheDocument();
    expect(document.querySelector("pre")).toHaveClass("overflow-x-auto");
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "bash",
    );
    expect(screen.queryByRole("button", { name: "View code" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
  });

  it("collapses long code and can expand and collapse it again", () => {
    render(<CodeBlock code={longCode} language="tsx" />);

    expect(screen.getByText("tsx")).toBeInTheDocument();
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "tsx",
    );
    expect(document.querySelector("code")?.textContent).toContain("line 20");
    fireEvent.click(screen.getByRole("button", { name: "View code" }));
    expect(screen.getByRole("button", { name: "Hide code" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Hide code" }));
    expect(screen.getByRole("button", { name: "View code" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.querySelector("code")?.textContent).toContain("line 20");
  });

  it("highlights TypeScript and Bash without injecting HTML", () => {
    const { unmount } = render(
      <CodeBlock code={'const ready = "ok";'} language="tsx" />,
    );

    expect(document.querySelector(".hljs-keyword")).toHaveTextContent("const");
    expect(document.querySelector("code")?.innerHTML).not.toContain(
      "dangerouslySetInnerHTML",
    );
    expect(
      document.querySelector("code")?.querySelector("span"),
    ).not.toBeNull();
    unmount();
    render(<CodeBlock code="echo hello" language="bash" />);
    expect(
      document.querySelector("code .hljs-built_in, code span"),
    ).not.toBeNull();
  });

  it("keeps bash independent of the component language preference", () => {
    render(<CodeBlock code="pnpm add button" language="bash" />);

    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "bash",
    );
    expect(document.querySelector("code")?.textContent).toBe("pnpm add button");
  });
});
