import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocsSearchProvider, DocsSearchField } from "./docs-search";

const push = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function Search() {
  return (
    <DocsSearchProvider>
      <DocsSearchField />
    </DocsSearchProvider>
  );
}

describe("documentation search", () => {
  it("does not list pages before a query", async () => {
    render(<Search />);

    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    expect(
      await screen.findByText("Search components, docs and pages"),
    ).toBeInTheDocument();
    expect(document.querySelector("[data-dialog-content]")).toHaveClass(
      "bg-secondary",
    );
    expect(
      document.querySelector("[role=dialog] [role=combobox]")?.parentElement
        ?.parentElement,
    ).toHaveClass("bg-secondary");
    expect(screen.queryByRole("option")).toBeNull();
  });

  it("filters to matching pages and opens the chosen one", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });

    fireEvent.change(input, { target: { value: "card" } });

    const options = screen.getAllByRole("option");

    expect(options.length).toBeGreaterThan(0);
    for (const option of options) {
      expect(option.textContent?.toLowerCase()).toContain("card");
    }

    fireEvent.click(
      screen.getByRole("option", {
        name: (name) => name.startsWith("Card"),
      }),
    );
    expect(push).toHaveBeenCalled();
  });

  it("shows an empty state when nothing matches", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });

    fireEvent.change(input, { target: { value: "zzzzzzzz" } });

    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.getByText("Try another search term.")).toBeInTheDocument();
    expect(screen.queryByRole("option")).toBeNull();
  });

  it("finds the CLI guide when searching for doctor", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });

    fireEvent.change(input, { target: { value: "doctor" } });

    expect(
      screen.getByRole("option", {
        name: (name) => name.startsWith("CLI"),
      }),
    ).toBeInTheDocument();
  });

  it("finds the CLI guide for categories and status", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });

    fireEvent.change(input, { target: { value: "categories" } });
    expect(
      screen.getByRole("option", {
        name: (name) => name.startsWith("CLI"),
      }),
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "status" } });
    expect(
      screen.getByRole("option", {
        name: (name) => name.startsWith("CLI"),
      }),
    ).toBeInTheDocument();
  });

  it("finds components.json when searching for aliases", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });

    fireEvent.change(input, { target: { value: "aliases" } });
    expect(
      screen.getByRole("option", {
        name: (name) => name.startsWith("components.json"),
      }),
    ).toBeInTheDocument();
  });

  it("opens from the keyboard shortcut and focuses the field", async () => {
    render(<Search />);

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Search documentation" }),
      ).toHaveFocus();
    });
  });
});
