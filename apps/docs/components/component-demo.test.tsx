import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { InstallCommand } from "./install-command";
import { CodeBlock } from "./code-block";
import { ComponentDemo } from "./component-demo";
import { cliCommands } from "./package-managers";

const longSource = Array.from(
  { length: 20 },
  (_, index) => `const line${index + 1} = ${index + 1};`,
).join("\n");

const pair = {
  tsx: "export function Save() { return null }",
  jsx: "export function SaveJsx() { return null }",
};

async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("ComponentDemo", () => {
  afterEach(() => {
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
  });

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
    expect(screen.getByText("tsx")).toBeInTheDocument();
    expect(
      screen.queryByRole("tablist", { name: "Component example language" }),
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

  it("switches TSX and JSX on one demo without changing another or bash", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(
      <>
        <ComponentDemo preview={<span>Preview</span>} code={pair} />
        <ComponentDemo
          preview={<span>Other</span>}
          code={{
            tsx: "export function Other() { return null }",
            jsx: "export function OtherJsx() { return null }",
          }}
        />
        <CodeBlock language="bash" code="npx @vinyaas/cli add button" />
        <InstallCommand commands={cliCommands("add button")} />
      </>,
    );

    await settle();

    const codes = () => [...document.querySelectorAll("code")];
    const tabs = () =>
      screen.getAllByRole("tab", { name: "JSX", selected: true });

    expect(codes()[0]).toHaveAttribute("data-language", "tsx");
    expect(codes()[0]).toHaveTextContent("export function Save()");
    expect(screen.getAllByRole("tab", { name: "TSX" })[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.queryByRole("tab", { name: "bash" })).toBeNull();

    fireEvent.click(screen.getAllByRole("tab", { name: "JSX" })[0]!);

    expect(tabs()[0]).toBeInTheDocument();
    expect(codes()[0]).toHaveAttribute("data-language", "jsx");
    expect(codes()[0]).toHaveTextContent("SaveJsx");
    expect(screen.getAllByText("jsx").length).toBeGreaterThan(0);
    expect(codes()[1]).toHaveAttribute("data-language", "tsx");
    expect(codes()[1]).toHaveTextContent("export function Other()");
    expect(codes()[2]).toHaveAttribute("data-language", "bash");
    expect(codes()[2]).toHaveTextContent("npx @vinyaas/cli add button");
    expect(
      screen.getAllByText("npx @vinyaas/cli add button").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole("tab", { name: "npm" })[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );

    fireEvent.click(screen.getAllByRole("tab", { name: "pnpm" })[0]!);

    expect(
      screen.getByText("pnpm dlx @vinyaas/cli add button"),
    ).toBeInTheDocument();
    expect(codes()[0]).toHaveAttribute("data-language", "jsx");
    expect(codes()[0]).toHaveTextContent("SaveJsx");

    fireEvent.click(screen.getAllByRole("button", { name: "Copy code" })[0]!);
    expect(writeText).toHaveBeenCalledWith(
      "export function SaveJsx() { return null }",
    );

    fireEvent.click(screen.getAllByRole("tab", { name: "TSX" })[0]!);
    expect(codes()[0]).toHaveAttribute("data-language", "tsx");
    expect(screen.getAllByRole("tab", { name: "TSX" })[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(codes()[2]).toHaveAttribute("data-language", "bash");
  });

  it("starts the next demo from the stored language and ignores invalid values", async () => {
    window.sessionStorage.setItem("vinyaas-code-language", "bash");

    const { unmount } = render(
      <ComponentDemo preview={<span>Preview</span>} code={pair} />,
    );

    await settle();
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "tsx",
    );

    fireEvent.click(screen.getByRole("tab", { name: "JSX" }));
    expect(window.sessionStorage.getItem("vinyaas-code-language")).toBe("jsx");
    unmount();

    render(<ComponentDemo preview={<span>Preview</span>} code={pair} />);
    await settle();
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "jsx",
    );
    expect(screen.getByRole("tab", { name: "JSX" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
