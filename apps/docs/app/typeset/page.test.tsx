import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";

import { typesetExamples } from "./examples";
import TypesetPage, { metadata } from "./page";

function renderTypeset() {
  return render(
    <DocsStoreProvider>
      <TypesetPage />
    </DocsStoreProvider>,
  );
}

describe("Typeset playground page", () => {
  it("exports SEO metadata for the typeset playground", () => {
    expect(metadata.title).toBe("Typeset");
    expect(metadata.alternates).toMatchObject({ canonical: "/typeset" });
  });

  it("renders native selects, shuffle, copy dialog, and markdown examples", () => {
    renderTypeset();

    expect(
      screen.getByRole("heading", { level: 1, name: "Typeset" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Options" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shuffle" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
    expect(typesetExamples.length).toBeGreaterThanOrEqual(16);
    expect(document.querySelector("[data-playground-content]")).toBeTruthy();
    expect(screen.getByText("Design manifesto")).toBeInTheDocument();
    expect(screen.getByText("Contrast formula")).toBeInTheDocument();
    expect(screen.getByText("CLI cheatsheet")).toBeInTheDocument();
    expect(screen.queryByText("Article introduction")).not.toBeInTheDocument();
  });

  it("opens typeset options in a drawer on the compact toolbar", async () => {
    renderTypeset();

    fireEvent.click(screen.getByRole("button", { name: "Options" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Typeset options")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Measure")).toBeInTheDocument();
    fireEvent.change(within(dialog).getByLabelText("Measure"), {
      target: { value: "60ch" },
    });
    expect(document.querySelector("[data-typeset-playground]")).toHaveAttribute(
      "data-typeset-measure",
      "60ch",
    );
  });

  it("opens typeset CSS in a dialog and copies from the header control", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    renderTypeset();

    fireEvent.click(screen.getByRole("button", { name: "Options" }));
    const options = await screen.findByRole("dialog");
    fireEvent.change(within(options).getByLabelText("Measure"), {
      target: { value: "60ch" },
    });
    fireEvent.click(within(options).getByRole("button", { name: "Done" }));

    await waitFor(() => {
      expect(screen.queryByText("Typeset options")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));

    const dialog = await screen.findByRole("dialog", { name: "Typeset" });
    expect(
      within(dialog).getByText(
        "Copy and paste the following code into your CSS file.",
      ),
    ).toBeInTheDocument();
    expect(
      dialog.querySelector("[data-playground-code]")?.textContent,
    ).toContain("--typeset-measure: 60ch");

    fireEvent.click(within(dialog).getByRole("button", { name: "Copy code" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(writeText.mock.calls[0]?.[0]).toContain("--typeset-measure: 60ch");
  });

  it("shuffles to another curated preset", () => {
    renderTypeset();
    fireEvent.click(screen.getByRole("button", { name: "Shuffle" }));
    expect(
      document.querySelector("[data-typeset-playground]"),
    ).not.toHaveAttribute("data-typeset-measure", "70ch");
  });
});
