import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CodeBlock } from "./code-block";
import { ComponentDemo } from "./component-demo";

const longSource = Array.from(
  { length: 20 },
  (_, index) => `const line${index + 1} = ${index + 1};`,
).join("\n");

describe("ComponentDemo", () => {
  it("renders the preview, the complete source, and copy", () => {
    const source = `import { Button } from "@/components/ui/button/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
`;

    render(
      <ComponentDemo
        preview={<button type="button">Save</button>}
        code={source}
      />,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByText(/export function SaveButton/)).toBeInTheDocument();
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "tsx",
    );
    expect(
      screen.queryByRole("group", { name: "Component example language" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "View code" })).toBeNull();
  });

  it("collapses long source and can show it again", () => {
    render(<ComponentDemo preview={<span>Preview</span>} code={longSource} />);

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
  });

  it("switches TSX and JSX inside the demo and copies the visible source", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(
      <>
        <ComponentDemo
          preview={<span>Preview</span>}
          code={{
            tsx: "export function Save() { return null }",
            jsx: "export function SaveJsx() { return null }",
          }}
        />
        <ComponentDemo
          preview={<span>Other</span>}
          code={{
            tsx: "export function Other() { return null }",
            jsx: "export function OtherJsx() { return null }",
          }}
        />
        <CodeBlock language="bash" code="npx @vinyaas/cli add button" />
      </>,
    );

    const codes = () => [...document.querySelectorAll("code")];

    expect(codes()[0]).toHaveAttribute("data-language", "tsx");
    expect(codes()[0]).toHaveTextContent("export function Save()");
    expect(codes()[2]).toHaveAttribute("data-language", "bash");
    expect(codes()[2]).toHaveTextContent("npx @vinyaas/cli add button");

    const groups = screen.getAllByRole("group", {
      name: "Component example language",
    });

    fireEvent.click(screen.getAllByRole("button", { name: "JSX" })[0]!);
    expect(groups[0]?.querySelector("[aria-pressed='true']")).toHaveTextContent(
      "JSX",
    );
    expect(codes()[0]).toHaveAttribute("data-language", "jsx");
    expect(codes()[0]).toHaveTextContent("SaveJsx");
    expect(codes()[1]).toHaveTextContent("export function Other()");
    expect(codes()[2]).toHaveAttribute("data-language", "bash");
    expect(codes()[2]).toHaveTextContent("npx @vinyaas/cli add button");

    fireEvent.click(screen.getAllByRole("button", { name: "Copy code" })[0]!);
    expect(writeText).toHaveBeenCalledWith(
      "export function SaveJsx() { return null }",
    );

    fireEvent.click(screen.getAllByRole("button", { name: "TSX" })[0]!);
    expect(codes()[0]).toHaveAttribute("data-language", "tsx");
    expect(codes()[2]).toHaveTextContent("npx @vinyaas/cli add button");
  });
});
