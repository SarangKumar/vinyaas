import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cliCommands, InstallCommand } from "./install-command";

const commands = cliCommands("add button");

describe("InstallCommand", () => {
  afterEach(() => {
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("switches the command and copies the selected package manager", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(
      <>
        <InstallCommand commands={commands} />
        <InstallCommand commands={cliCommands("init")} />
      </>,
    );

    expect(screen.getByText("npx vinyaas add button")).toBeInTheDocument();
    for (const block of document.querySelectorAll("code")) {
      expect(block).toHaveAttribute("data-language", "bash");
    }
    expect(screen.queryByText("bash")).toBeNull();
    expect(
      screen.getAllByRole("tablist", { name: "Package manager" }),
    ).toHaveLength(2);
    expect(screen.getByText("npx vinyaas init")).toBeInTheDocument();
    expect(screen.getAllByRole("tab", { name: "npm" })[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );

    fireEvent.click(screen.getAllByRole("tab", { name: "pnpm" })[0]);

    expect(screen.getByText("pnpm dlx vinyaas add button")).toBeInTheDocument();
    expect(screen.getByText("pnpm dlx vinyaas init")).toBeInTheDocument();
    expect(screen.getAllByRole("tab", { name: "pnpm" })[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getAllByRole("tab", { name: "npm" })[0]).toHaveAttribute(
      "aria-selected",
      "false",
    );

    fireEvent.click(screen.getAllByRole("tab", { name: "yarn" })[0]);
    expect(screen.getByText("yarn dlx vinyaas add button")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("tab", { name: "bun" })[0]);
    expect(screen.getByText("bunx vinyaas add button")).toBeInTheDocument();
    for (const block of document.querySelectorAll("code")) {
      expect(block).toHaveAttribute("data-language", "bash");
    }

    fireEvent.click(screen.getAllByRole("button", { name: "Copy code" })[0]);
    expect(writeText).toHaveBeenCalledWith("bunx vinyaas add button");
    expect(window.sessionStorage.getItem("vinyaas-package-manager")).toBe(
      "bun",
    );
  });
});
