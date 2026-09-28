import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

import { CodeBlock } from "./code-block";

const shortCode = "vinyaas add button";
const longCode = Array.from(
  { length: 20 },
  (_, index) => `line ${index + 1}`,
).join("\n");
const pair = {
  tsx: "export function Save() { return null }",
  jsx: "export function SaveJsx() { return null }",
};

function renderWithStore(node: ReactNode) {
  return render(<DocsStoreProvider>{node}</DocsStoreProvider>);
}

describe("CodeBlock", () => {
  afterEach(() => {
    window.sessionStorage.clear();
    store.dispatch(setCodeLanguage("tsx"));
    vi.unstubAllGlobals();
  });

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
    expect(document.querySelector("[data-code-fade]")).toBeNull();
    expect(document.querySelector("[data-line-numbers]")).toBeNull();
    expect(document.querySelector("code")).toHaveClass("px-5");
    expect(document.querySelector("pre")).toHaveClass("m-0", "py-4");
    expect(
      document.querySelector("code")?.closest("[class*=bg-card]")
        ?.previousElementSibling ??
        document.querySelector("pre")?.parentElement?.previousElementSibling,
    ).toHaveClass("border-b");
    expect(
      document.querySelector("pre")?.parentElement?.previousElementSibling,
    ).toHaveClass("bg-muted/60");
    expect(
      screen.queryByRole("tablist", { name: "Component example language" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
  });

  it("collapses long source, fades the preview, and can expand it", () => {
    renderWithStore(<CodeBlock code={longCode} language="tsx" />);

    expect(screen.getByRole("tab", { name: "TSX" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "tsx",
    );
    expect(document.querySelector("[data-line-numbers]")).toHaveClass(
      "bg-muted/40",
    );
    expect(
      document.querySelector("[data-line-numbers]")?.closest("pre")
        ?.parentElement?.parentElement,
    ).toHaveClass("bg-card");
    expect(document.querySelector("[data-code-fade]")).toBeInTheDocument();
    expect(document.querySelector("pre")).toHaveClass("m-0", "max-h-72");
    expect(
      document.querySelector("[data-line-numbers]")?.parentElement,
    ).not.toHaveClass("py-3");
    expect(document.querySelector("[data-line-numbers]")).not.toHaveClass(
      "py-3",
    );
    expect(document.querySelector("code")?.textContent).toContain("line 20");
    fireEvent.click(screen.getByRole("button", { name: "View code" }));
    expect(screen.getByRole("button", { name: "Hide code" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(document.querySelector("[data-code-fade]")).toBeNull();
    expect(document.querySelector("pre")).toHaveClass("overflow-x-auto");
    fireEvent.click(screen.getByRole("button", { name: "Hide code" }));
    expect(screen.getByRole("button", { name: "View code" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.querySelector("[data-code-fade]")).toBeInTheDocument();
  });

  it("highlights TypeScript and Bash without injecting HTML", () => {
    const { unmount } = renderWithStore(
      <CodeBlock code={'const ready = "ok";'} language="tsx" />,
    );

    expect(document.querySelector(".hljs-keyword")).toHaveTextContent("const");
    expect(document.querySelector(".hljs-string")).toHaveTextContent('"ok"');
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
    expect(document.querySelector("[data-line-numbers]")).toBeNull();
  });

  it("highlights JSX tags in React demos", () => {
    renderWithStore(
      <CodeBlock
        code={`export function Save() {\n  return <Button>Save</Button>;\n}`}
        language="tsx"
      />,
    );

    expect(document.querySelector(".hljs-name")).toHaveTextContent("Button");
    expect(document.querySelector(".hljs-tag")).toBeTruthy();
  });

  it("keeps bash independent of the component language preference", () => {
    renderWithStore(
      <>
        <CodeBlock source={pair} />
        <CodeBlock code="pnpm add button" language="bash" />
      </>,
    );

    fireEvent.click(screen.getByRole("tab", { name: "JSX" }));

    const codes = [...document.querySelectorAll("code")];

    expect(codes[0]).toHaveAttribute("data-language", "jsx");
    expect(codes[1]).toHaveAttribute("data-language", "bash");
    expect(codes[1]?.textContent).toBe("pnpm add button");
    expect(
      codes[1]?.closest("div")?.querySelector("[data-line-numbers]"),
    ).toBeNull();
  });

  it("switches every source block together and copies the selected source", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    renderWithStore(
      <>
        <CodeBlock source={pair} />
        <CodeBlock
          source={{
            tsx: "export function Other() { return null }",
            jsx: "export function OtherJsx() { return null }",
          }}
        />
        <CodeBlock code={longCode} language="tsx" />
      </>,
    );

    const codes = () => [...document.querySelectorAll("code")];

    expect(screen.getAllByRole("tab", { name: "TSX" })[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(codes()[0]).toHaveTextContent("export function Save()");
    expect(codes()[1]).toHaveTextContent("export function Other()");
    expect(codes()[2]).toHaveAttribute("data-language", "tsx");

    fireEvent.click(screen.getAllByRole("tab", { name: "JSX" })[0]!);

    expect(codes()[0]).toHaveAttribute("data-language", "jsx");
    expect(codes()[0]).toHaveTextContent("SaveJsx");
    expect(codes()[1]).toHaveAttribute("data-language", "jsx");
    expect(codes()[1]).toHaveTextContent("OtherJsx");
    expect(codes()[2]).toHaveAttribute("data-language", "jsx");
    expect(window.sessionStorage.getItem("vinyaas-code-language")).toBe("jsx");
    expect(document.querySelectorAll("[data-line-numbers]").length).toBe(3);
    expect(screen.getAllByRole("tab", { name: "JSX" })).toHaveLength(3);
    for (const tab of screen.getAllByRole("tab", { name: "JSX" })) {
      expect(tab).toHaveAttribute("aria-selected", "true");
    }

    fireEvent.click(screen.getAllByRole("button", { name: "Copy code" })[0]!);
    expect(writeText).toHaveBeenCalledWith(pair.jsx);
    expect(writeText.mock.calls[0]?.[0]).not.toMatch(/^\s*1\s/m);

    fireEvent.click(screen.getAllByRole("button", { name: "Copy code" })[2]!);
    expect(writeText).toHaveBeenLastCalledWith(longCode);

    fireEvent.click(screen.getAllByRole("tab", { name: "TSX" })[1]!);
    fireEvent.click(screen.getAllByRole("button", { name: "Copy code" })[0]!);
    expect(writeText).toHaveBeenLastCalledWith(pair.tsx);
    expect(codes()[2]).toHaveAttribute("data-language", "tsx");
  });

  it("updates string CodeBlocks from dual-source selectors and back", () => {
    renderWithStore(
      <>
        <CodeBlock
          code={`import type { Props } from "./props";
export function A(props: Props) { return null }`}
          language="tsx"
        />
        <CodeBlock source={pair} />
        <CodeBlock code='{"ok":true}' language="json" />
      </>,
    );

    expect(screen.getAllByRole("tab", { name: "TSX" })).toHaveLength(2);
    expect(document.querySelectorAll("code")[0]).toHaveAttribute(
      "data-language",
      "tsx",
    );
    expect(document.querySelectorAll("code")[0]?.textContent).toContain(
      "import type",
    );
    expect(document.querySelectorAll("code")[2]).toHaveAttribute(
      "data-language",
      "json",
    );

    fireEvent.click(screen.getAllByRole("tab", { name: "JSX" })[1]!);

    expect(document.querySelectorAll("code")[0]).toHaveAttribute(
      "data-language",
      "jsx",
    );
    expect(document.querySelectorAll("code")[0]?.textContent).not.toContain(
      "import type",
    );
    expect(document.querySelectorAll("code")[1]).toHaveTextContent("SaveJsx");
    expect(document.querySelectorAll("code")[2]).toHaveAttribute(
      "data-language",
      "json",
    );

    fireEvent.click(screen.getAllByRole("tab", { name: "TSX" })[0]!);

    expect(document.querySelectorAll("code")[0]).toHaveAttribute(
      "data-language",
      "tsx",
    );
    expect(document.querySelectorAll("code")[0]?.textContent).toContain(
      "import type",
    );
    expect(document.querySelectorAll("code")[1]).toHaveTextContent("Save()");
  });
});
