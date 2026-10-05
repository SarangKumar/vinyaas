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
      "bg-popover",
    );
    const input = document.querySelector("[role=dialog] [role=combobox]");
    expect(input?.parentElement).toHaveClass(
      "border",
      "border-border/80",
      "bg-muted/40",
    );
    expect(input?.parentElement?.parentElement).toHaveClass("p-px");
    expect(document.querySelector("[data-slot=command-footer]")).toBeTruthy();
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

  it("finds companion docs when searching for Ember", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });

    fireEvent.change(input, { target: { value: "ember" } });
    expect(
      screen.getByRole("option", {
        name: (name) => name.startsWith("Companions"),
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

  it("ranks title matches above description-only matches for select", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });

    fireEvent.change(input, { target: { value: "select" } });

    const options = screen.getAllByRole("option");
    const titles = options.map(
      (option) =>
        option.textContent?.split("A ")[0]?.trim() ??
        option.querySelector("span.truncate")?.textContent ??
        option.textContent,
    );

    const selectIndex = options.findIndex((option) =>
      /^Select/.test(option.textContent ?? ""),
    );
    const nativeIndex = options.findIndex((option) =>
      /Native Select/.test(option.textContent ?? ""),
    );

    expect(selectIndex).toBeGreaterThanOrEqual(0);
    expect(nativeIndex).toBeGreaterThanOrEqual(0);
    expect(selectIndex).toBeLessThan(nativeIndex);

    for (let index = 0; index < options.length; index += 1) {
      if (index > nativeIndex) {
        expect(options[index]?.textContent).not.toMatch(/^Select\b/);
        expect(options[index]?.textContent).not.toMatch(/Native Select/);
      }
    }

    expect(titles.length).toBeGreaterThan(1);
  });

  it("is case-insensitive and shows empty results", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });

    fireEvent.change(input, { target: { value: "BUTTON" } });
    expect(
      screen.getByRole("option", {
        name: (name) => name.startsWith("Button"),
      }),
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "zzzzzzzz" } });
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });
});

describe("documentation search ranking helpers", () => {
  it("scores exact, prefix, substring, and description matches", async () => {
    const { searchRank, rankSearchPages } = await import("./docs-search");

    expect(
      searchRank({ title: "Select", description: "A picker" }, "select"),
    ).toBe(0);
    expect(
      searchRank(
        { title: "Native Select", description: "Native picker" },
        "select",
      ),
    ).toBe(2);
    expect(
      searchRank(
        { title: "Native Select", description: "Native picker" },
        "native",
      ),
    ).toBe(1);
    expect(
      searchRank(
        { title: "Input", description: "Use with select fields" },
        "select",
      ),
    ).toBe(3);

    const ranked = rankSearchPages(
      [
        {
          title: "Input",
          href: "/components/input",
          description: "Use with select fields",
          group: "Components",
        },
        {
          title: "Select",
          href: "/components/select",
          description: "Custom select",
          group: "Components",
        },
        {
          title: "Native Select",
          href: "/components/native-select",
          description: "Native select",
          group: "Components",
        },
      ],
      "select",
    );

    expect(ranked.map((page) => page.title)).toEqual([
      "Select",
      "Native Select",
      "Input",
    ]);
  });
});
