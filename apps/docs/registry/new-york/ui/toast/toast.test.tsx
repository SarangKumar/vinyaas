import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { toast, Toaster } from ".";

const toastDir = path.dirname(fileURLToPath(import.meta.url));

async function flushMount() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("Toast", () => {
  afterEach(() => {
    toast.dismiss();
    vi.useRealTimers();
  });

  it("adds a toast without moving focus", async () => {
    render(
      <>
        <button type="button">Page</button>
        <Toaster />
      </>,
    );
    await flushMount();

    screen.getByRole("button", { name: "Page" }).focus();
    act(() => {
      toast.add({
        title: "Saved",
        description: "The note was saved.",
        type: "success",
      });
    });

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("Saved");
    expect(screen.getByText("The note was saved.")).toBeInTheDocument();
    expect(status).toHaveAttribute("data-type", "success");
    expect(status).toHaveClass("vinyaas-toast-in");
    expect(status.closest("[data-toaster]")?.querySelector("style")).toBeNull();
    expect(document.querySelector("style")).toBeNull();
    expect(status.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Page" })).toHaveFocus();
  });

  it("ships toast motion CSS beside the component", async () => {
    const css = await fs.readFile(path.join(toastDir, "toast.css"), "utf8");
    const source = await fs.readFile(path.join(toastDir, "index.tsx"), "utf8");

    expect(source).toContain('import "./toast.css"');
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("<style");
    expect(css).toContain("@keyframes vinyaas-toast-in");
    expect(css).toContain("@keyframes vinyaas-toast-out");
    expect(css).toContain(".vinyaas-toast-in");
    expect(css).toContain(".vinyaas-toast-out");
    expect(css).toContain("animation: vinyaas-toast-in 260ms");
    expect(css).toContain("--vinyaas-toast-x");
    expect(css).toContain(
      "animation: vinyaas-toast-out 160ms ease-in forwards",
    );
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*\.vinyaas-toast-in[\s\S]*animation:\s*none/,
    );
  });

  it("stacks toasts, runs an action, and dismisses one", async () => {
    const onUndo = vi.fn();

    render(<Toaster position="top-right" />);
    await flushMount();
    act(() => {
      toast.add({ title: "Saved", type: "info" });
      toast.add({
        title: "Deleted",
        type: "warning",
        actionProps: { children: "Undo", onClick: onUndo },
      });
    });

    expect(screen.getAllByRole("status")).toHaveLength(2);
    expect(document.querySelector("[data-toaster]")).toHaveAttribute(
      "data-position",
      "top-right",
    );

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(onUndo).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Undo" })).toHaveClass(
      "h-7",
      "text-xs",
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Dismiss" })[0]!);

    await waitFor(() => {
      expect(screen.getAllByRole("status")).toHaveLength(1);
    });
  });

  it("places the action button beside the close button on the right", async () => {
    render(<Toaster />);
    await flushMount();
    act(() => {
      toast.add({
        title: "Message archived",
        description: "It moved to the archive.",
        actionProps: { children: "Undo", onClick: () => {} },
      });
    });

    const action = screen.getByRole("button", { name: "Undo" });
    const close = screen.getByRole("button", { name: "Dismiss" });
    const toastNode = screen.getByRole("status");

    expect(action.parentElement).toBe(close.parentElement);
    expect(action.nextElementSibling).toBe(close);
    expect(toastNode.lastElementChild).toBe(action.parentElement);
    expect(toastNode.contains(screen.getByText("Message archived"))).toBe(true);
    expect(close.textContent).toBe("");
  });

  it("dismisses automatically and pauses while hovered", () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      vi.advanceTimersByTime(0);
    });

    act(() => {
      toast.add({ title: "Saved", duration: 1000 });
    });

    const status = screen.getByRole("status");

    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(screen.getByText("Saved")).toBeInTheDocument();

    fireEvent.mouseEnter(status);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Saved")).toBeInTheDocument();

    fireEvent.mouseLeave(status);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Saved")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(160);
    });

    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("keeps a loading toast until it is updated", async () => {
    render(<Toaster />);
    await flushMount();

    let resolve: (value: string) => void = () => {};
    const promise = new Promise<string>((done) => {
      resolve = done;
    });

    act(() => {
      toast.promise(promise, {
        loading: { title: "Saving" },
        success: { title: "Saved" },
        error: { title: "Could not save" },
      });
    });

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveAttribute("data-type", "loading");

    await act(async () => {
      resolve("ok");
      await promise;
    });

    expect(screen.getByRole("status")).toHaveAttribute("data-type", "success");
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("announces an error with an alert", async () => {
    render(<Toaster />);
    await flushMount();

    act(() => {
      toast.add({ title: "Could not save", type: "error" });
    });

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Could not save");
    expect(alert).toHaveClass("bg-muted", "text-foreground");
    expect(alert.querySelector("svg")).toHaveClass("text-destructive");
    expect(alert).not.toHaveClass("bg-destructive");
  });
});
