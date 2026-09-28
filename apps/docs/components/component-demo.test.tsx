import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { InstallCommand } from "./install-command";
import { CodeBlock } from "./code-block";
import { ComponentDemo } from "./component-demo";
import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";
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
    store.dispatch(setCodeLanguage("tsx"));
    vi.unstubAllGlobals();
  });

  function renderDemo(node: ReactNode) {
    return render(<DocsStoreProvider>{node}</DocsStoreProvider>);
  }

  it("renders the preview, the complete source, and copy", () => {
    const source = `import { Button } from "@/components/ui/button/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
`;

    renderDemo(
      <ComponentDemo
        preview={<button type="button">Save</button>}
        code={source}
      />,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(document.querySelector("code")?.textContent).toContain(
      "export function SaveButton",
    );
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "tsx",
    );
    expect(screen.getByRole("tab", { name: "TSX" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("tablist", { name: "Component example language" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "View code" })).toBeNull();
  });

  it("collapses long source and can show it again", () => {
    renderDemo(
      <ComponentDemo preview={<span>Preview</span>} code={longSource} />,
    );

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

  it("switches TSX and JSX across demos and standalone blocks together", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    const stringSource = `import type { Name } from "./name";

export function Alone(props: Name) {
  return null;
}
`;

    renderDemo(
      <>
        <ComponentDemo preview={<span>Preview</span>} code={pair} />
        <ComponentDemo
          preview={<span>Other</span>}
          code={{
            tsx: "export function Other() { return null }",
            jsx: "export function OtherJsx() { return null }",
          }}
        />
        <CodeBlock code={stringSource} language="tsx" />
        <CodeBlock language="bash" code="npx vinyaas add button" />
        <InstallCommand commands={cliCommands("add button")} />
      </>,
    );

    await settle();

    const codes = () => [...document.querySelectorAll("code")];

    expect(codes()[0]).toHaveAttribute("data-language", "tsx");
    expect(codes()[0]).toHaveTextContent("export function Save()");
    expect(screen.getAllByRole("tab", { name: "TSX" })[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.queryByRole("tab", { name: "bash" })).toBeNull();
    expect(codes()[2]?.textContent).toContain("import type");

    fireEvent.click(screen.getAllByRole("tab", { name: "JSX" })[2]!);

    expect(codes()[0]).toHaveAttribute("data-language", "jsx");
    expect(codes()[0]).toHaveTextContent("SaveJsx");
    expect(codes()[1]).toHaveAttribute("data-language", "jsx");
    expect(codes()[1]).toHaveTextContent("export function OtherJsx()");
    expect(codes()[2]).toHaveAttribute("data-language", "jsx");
    expect(codes()[2]?.textContent).not.toContain("import type");
    expect(codes()[3]).toHaveAttribute("data-language", "bash");
    expect(codes()[3]).toHaveTextContent("npx vinyaas add button");
    expect(
      screen.getAllByText("npx vinyaas add button").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole("tab", { name: "npm" })[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
    for (const tab of screen.getAllByRole("tab", { name: "JSX" })) {
      expect(tab).toHaveAttribute("aria-selected", "true");
    }

    fireEvent.click(screen.getAllByRole("tab", { name: "pnpm" })[0]!);

    expect(screen.getByText("pnpm dlx vinyaas add button")).toBeInTheDocument();
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
    expect(codes()[2]).toHaveAttribute("data-language", "tsx");
    expect(codes()[2]?.textContent).toContain("import type");
    expect(codes()[3]).toHaveAttribute("data-language", "bash");
  });

  it("starts the next demo from the stored language and ignores invalid values", async () => {
    window.sessionStorage.setItem("vinyaas-code-language", "bash");

    const { unmount } = renderDemo(
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

    renderDemo(<ComponentDemo preview={<span>Preview</span>} code={pair} />);
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
