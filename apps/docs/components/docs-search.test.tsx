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
  it("lists all pages before a query", async () => {
    render(<Search />);

    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    expect(
      await screen.findByRole("option", { name: /Introduction/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Button/ })).toBeInTheDocument();
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
    expect(screen.getAllByRole("option").length).toBeGreaterThan(10);
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

  it("groups Pages and Components and links component results", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    expect(
      await screen.findByRole("group", { name: "Pages" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Components" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: (name) => name.startsWith("Home") }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: (name) => name.startsWith("Components"),
      }),
    ).toBeInTheDocument();

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });
    fireEvent.change(input, { target: { value: "resizable" } });

    expect(
      screen.getByRole("group", { name: "Components" }),
    ).toBeInTheDocument();
    const resizable = screen.getByRole("option", {
      name: (name) => name.startsWith("Resizable"),
    });
    expect(resizable).toBeInTheDocument();
    fireEvent.click(resizable);
    expect(push).toHaveBeenCalledWith("/components/resizable");
  });

  it("keeps pages and components together for overlapping queries", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });
    fireEvent.change(input, { target: { value: "command" } });

    expect(
      screen.getByRole("group", { name: "Components" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: (name) => name.startsWith("Command"),
      }),
    ).toBeInTheDocument();
  });

  it("moves selection with arrows and opens with Enter", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });
    fireEvent.change(input, { target: { value: "button" } });

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(push).toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    render(<Search />);
    fireEvent.click(
      screen.getByRole("button", { name: "Search documentation" }),
    );

    const input = await screen.findByRole("combobox", {
      name: "Search documentation",
    });
    expect(input).toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("combobox", { name: "Search documentation" }),
      ).toBeNull();
    });
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

  it("indexes each component once from metadata with correct links", async () => {
    const { docsSearchPages } = await import("./docs-search");
    const { components, componentHref } = await import("./component-meta");

    const componentResults = docsSearchPages.filter(
      (page) => page.group === "Components",
    );
    const pageResults = docsSearchPages.filter(
      (page) => page.group === "Pages",
    );

    expect(pageResults.length).toBeGreaterThan(0);
    expect(componentResults).toHaveLength(components.length);

    const hrefs = componentResults.map((page) => page.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);

    for (const component of components) {
      const match = componentResults.find(
        (page) => page.href === componentHref(component.slug),
      );
      expect(match?.title).toBe(component.name);
      expect(match?.description).toBe(component.description);
    }

    for (const name of [
      "Command",
      "Drag & Drop",
      "Resizable",
      "Sidebar",
      "Select",
      "Native Select",
      "Table",
    ]) {
      expect(componentResults.some((page) => page.title === name)).toBe(true);
    }
  });
});
