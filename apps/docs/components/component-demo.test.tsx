import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { InstallCommand } from "./install-command";
import { CodeBlock } from "./code-block";
import { ComponentDemo, type ControlDef } from "./component-demo";
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
    const source = `import { Button } from "@/components/ui/button";

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

    // Preview is the default view; the source lives behind the Code tab.
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    const previewPane = document.querySelector(".bg-background.min-h-125");
    expect(previewPane).toHaveClass("text-sm", "px-4", "sm:px-6");
    expect(previewPane?.parentElement?.parentElement).toHaveClass(
      "border-border",
      "rounded-3xl",
      "border",
    );
    expect(document.querySelector("code")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Code" }));

    expect(document.querySelector("[data-code-frame]")).toHaveClass(
      "rounded-b-md",
    );
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

  it("expands long source into a fixed scroll area without a hide control", () => {
    renderDemo(
      <ComponentDemo preview={<span>Preview</span>} code={longSource} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Code" }));
    fireEvent.click(
      screen.getByRole("button", { name: "View full code example" }),
    );
    expect(screen.queryByRole("button", { name: "Hide code" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: "View full code example" }),
    ).toBeNull();
    expect(document.querySelector("pre")).toHaveClass("max-h-80");
    expect(document.querySelector("pre")).toHaveClass("overflow-auto");
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

    // Both demos default to Preview; reveal their source panels.
    for (const tab of screen.getAllByRole("button", { name: "Code" })) {
      fireEvent.click(tab);
    }

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
    fireEvent.click(screen.getByRole("button", { name: "Code" }));
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "tsx",
    );

    fireEvent.click(screen.getByRole("tab", { name: "JSX" }));
    expect(window.sessionStorage.getItem("vinyaas-code-language")).toBe("jsx");
    unmount();

    renderDemo(<ComponentDemo preview={<span>Preview</span>} code={pair} />);
    await settle();
    fireEvent.click(screen.getByRole("button", { name: "Code" }));
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "jsx",
    );
    expect(screen.getByRole("tab", { name: "JSX" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  describe("Customize panel", () => {
    const controls: ControlDef[] = [
      { key: "tint", label: "Tint", type: "color", default: "#8b5cf6" },
      { key: "title", label: "Title", type: "text", default: "Hello" },
      { key: "body", label: "Body", type: "longtext", default: "Lorem" },
      {
        key: "size",
        label: "Size",
        type: "range",
        default: 4,
        min: 0,
        max: 10,
        unit: "px",
      },
      { key: "loop", label: "Loop", type: "toggle", default: false },
      {
        key: "shape",
        label: "Shape",
        type: "select",
        default: "arc",
        options: [
          { value: "arc", label: "Arc" },
          { value: "curve", label: "Curve" },
        ],
      },
    ];

    function renderControlled() {
      return renderDemo(
        <ComponentDemo
          preview={(v) => <span>preview:{String(v.size)}</span>}
          code={(v) => `size=${v.size};loop=${v.loop};shape=${v.shape}`}
          controls={controls}
        />,
      );
    }

    it("renders every control type on the customize panel", () => {
      renderControlled();

      expect(
        screen.getByRole("heading", { name: "Customize" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();

      for (const control of controls) {
        expect(screen.getByTitle(control.label)).toBeInTheDocument();
      }

      expect(screen.getByRole("slider")).toHaveValue("4");
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "false",
      );
      expect(screen.getByRole("combobox")).toHaveValue("arc");
      expect(screen.getByDisplayValue("#8b5cf6")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Lorem")).toBeInTheDocument();
    });

    it("drives the preview and the generated source from control values", () => {
      renderControlled();

      expect(screen.getByText(/preview:4/)).toBeInTheDocument();

      fireEvent.change(screen.getByRole("slider"), { target: { value: "9" } });
      fireEvent.click(screen.getByRole("switch"));
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "curve" },
      });

      expect(screen.getByText(/preview:9/)).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Code" }));
      expect(document.querySelector("code")?.textContent).toContain(
        "size=9;loop=true;shape=curve",
      );
    });

    it("restores component defaults when Reset is pressed", () => {
      renderControlled();

      fireEvent.change(screen.getByRole("slider"), { target: { value: "9" } });
      fireEvent.click(screen.getByRole("switch"));
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "true",
      );

      fireEvent.click(screen.getByRole("button", { name: "Reset" }));

      expect(screen.getByRole("slider")).toHaveValue("4");
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "false",
      );
      expect(screen.getByRole("combobox")).toHaveValue("arc");
      expect(screen.getByText(/preview:4/)).toBeInTheDocument();
    });
  });
});
