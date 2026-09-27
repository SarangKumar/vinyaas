import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeLanguageSelect, rememberCodeLanguage } from "./code-language";
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
      <>
        <CodeLanguageSelect />
        <ComponentDemo
          preview={<button type="button">Save</button>}
          code={source}
        />
      </>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByText(/export function SaveButton/)).toBeInTheDocument();
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "tsx",
    );
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

  it("follows the session language when that source exists", () => {
    render(
      <>
        <CodeLanguageSelect />
        <ComponentDemo
          preview={<span>Preview</span>}
          code={{
            tsx: "export function Save() { return null }",
            jsx: "export function SaveJsx() { return null }",
          }}
        />
      </>,
    );

    expect(document.querySelector("code")).toHaveTextContent(
      "export function Save()",
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Code language" }), {
      target: { value: "jsx" },
    });
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "jsx",
    );
    expect(document.querySelector("code")).toHaveTextContent("SaveJsx");

    fireEvent.change(screen.getByRole("combobox", { name: "Code language" }), {
      target: { value: "bash" },
    });
    expect(document.querySelector("code")).toHaveAttribute(
      "data-language",
      "tsx",
    );
    rememberCodeLanguage("tsx");
  });
});
