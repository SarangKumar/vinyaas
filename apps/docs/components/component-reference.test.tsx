import {
  fireEvent,
  render,
  screen,
  type RenderResult,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ReactNode } from "react";

import { DocsStoreProvider } from "@/lib/store/provider";
import { ComponentReference } from "./component-reference";

function renderDocs(node: ReactNode): RenderResult {
  return render(<DocsStoreProvider>{node}</DocsStoreProvider>);
}

describe("ComponentReference", () => {
  it("renders the shared documentation sections", () => {
    renderDocs(
      <ComponentReference
        title="Input"
        description="A text field."
        install="vinyaas add input"
        usage="<Input />"
        source="export function Input() {}"
      >
        <input aria-label="Email" />
      </ComponentReference>,
    );

    expect(screen.getByRole("heading", { name: "Input" })).toBeInTheDocument();
    expect(screen.getByText("A text field.")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Preview" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Installation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("npx vinyaas add input")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Usage" })).toBeInTheDocument();
    expect(
      [...document.querySelectorAll("code")].some((node) =>
        node.textContent?.includes("<Input />"),
      ),
    ).toBe(true);
    expect(screen.queryByRole("heading", { name: "Source" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Preview" })).toHaveAttribute(
      "id",
      "preview",
    );
    expect(
      screen.getByRole("heading", { name: "Installation" }),
    ).toHaveAttribute("id", "installation");
    expect(screen.getByRole("heading", { name: "Usage" })).toHaveAttribute(
      "id",
      "usage",
    );
    expect(screen.getByRole("tab", { name: "CLI" })).toHaveAttribute(
      "id",
      "cli",
    );
    expect(screen.getByRole("tab", { name: "Manual" })).toHaveAttribute(
      "id",
      "manual",
    );
  });

  it("shows the CLI command first and the source behind the Manual tab", () => {
    renderDocs(
      <ComponentReference
        title="Input"
        description="A text field."
        install="vinyaas add input"
        manual={<p>Place it at components/ui/input/index.tsx.</p>}
        usage="<Input />"
        source="export function Input() {}"
      >
        <input aria-label="Email" />
      </ComponentReference>,
    );

    // CLI is the default tab, so neither the notes nor the source are mounted.
    expect(screen.getByRole("tab", { name: "CLI" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.queryByText("Place it at components/ui/input/index.tsx."),
    ).toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "Manual" }));

    expect(
      screen.getByText("Place it at components/ui/input/index.tsx."),
    ).toBeInTheDocument();
    expect(
      [...document.querySelectorAll("code")].some((node) =>
        node.textContent?.includes("export function Input() {}"),
      ),
    ).toBe(true);
    expect(screen.queryByText("npx vinyaas add input")).toBeNull();
  });

  it("renders optional documentation sections with stable ids", () => {
    renderDocs(
      <ComponentReference
        title="Button"
        description="A button."
        overview={<p>Native button.</p>}
        install="vinyaas add button"
        manual={<p>Copy the file.</p>}
        usage="<Button />"
        examples={[
          {
            id: "destructive",
            title: "Destructive",
            description: "For delete.",
            preview: <button type="button">Delete</button>,
            code: `<Button variant="destructive">Delete</Button>`,
          },
        ]}
        inPractice={{
          description: "Save and cancel on a short form.",
          preview: (
            <form>
              <button type="submit">Save</button>
            </form>
          ),
          code: `<form><Button type="submit">Save</Button></form>`,
        }}
        api={[
          {
            prop: "variant",
            type: '"default" | "outline" | "destructive"',
            defaultValue: '"default"',
          },
        ]}
        accessibility={<p>Enter and Space activate it.</p>}
        source="export function Button() {}"
      >
        <button type="button">Save</button>
      </ComponentReference>,
    );

    expect(screen.getByRole("heading", { name: "Overview" })).toHaveAttribute(
      "id",
      "overview",
    );
    expect(screen.getByRole("tab", { name: "Manual" })).toHaveAttribute(
      "id",
      "manual",
    );
    expect(screen.getByRole("heading", { name: "Examples" })).toHaveAttribute(
      "id",
      "examples",
    );
    expect(
      screen.getByRole("heading", { name: "Destructive" }),
    ).toHaveAttribute("id", "destructive");
    expect(
      screen.getByRole("heading", { name: "In practice" }),
    ).toHaveAttribute("id", "in-practice");
    expect(
      screen.getByText("Save and cancel on a short form."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "API" })).toHaveAttribute(
      "id",
      "api",
    );
    expect(
      screen.getByRole("heading", { name: "Accessibility" }),
    ).toHaveAttribute("id", "accessibility");
    expect(
      screen.getByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Type" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Default" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "Description" }),
    ).toBeNull();
    expect(screen.getByText("variant")).toBeInTheDocument();
  });

  it("places In practice immediately before API", () => {
    renderDocs(
      <ComponentReference
        title="Input"
        description="A text field."
        install="vinyaas add input"
        usage="<Input />"
        examples={[
          {
            id: "basic",
            title: "Basic",
            description: "Bare field.",
            preview: <input aria-label="Name" />,
            code: `<Input aria-label="Name" />`,
          },
        ]}
        inPractice={{
          description: "Sign-in email field with actions.",
          preview: <form aria-label="Sign in" />,
          code: `<form />`,
        }}
        api={[
          {
            prop: "type",
            type: "string",
            description: "Native type.",
          },
        ]}
        accessibility={<p>Associate a label.</p>}
        source="export function Input() {}"
      >
        <input aria-label="Preview" />
      </ComponentReference>,
    );

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((node) => node.textContent);
    const examplesIndex = headings.indexOf("Examples");
    const inPracticeIndex = headings.indexOf("In practice");
    const apiIndex = headings.indexOf("API");
    const accessibilityIndex = headings.indexOf("Accessibility");
    const installationIndex = headings.indexOf("Installation");
    const usageIndex = headings.indexOf("Usage");

    expect(installationIndex).toBeGreaterThan(-1);
    expect(usageIndex).toBeGreaterThan(installationIndex);
    expect(examplesIndex).toBeGreaterThan(usageIndex);
    expect(inPracticeIndex).toBeGreaterThan(examplesIndex);
    expect(apiIndex).toBeGreaterThan(inPracticeIndex);
    expect(accessibilityIndex).toBeGreaterThan(apiIndex);
    // Source moved into the Manual tab, so it is no longer a trailing section.
    expect(headings).not.toContain("Source");
  });
});
