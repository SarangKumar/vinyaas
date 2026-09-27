import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { toast, Toaster } from "./toast";

describe("Toast", () => {
  afterEach(() => {
    toast.dismiss();
    vi.useRealTimers();
  });

  it("adds a toast without moving focus", () => {
    render(
      <>
        <button type="button">Page</button>
        <Toaster />
      </>,
    );

    screen.getByRole("button", { name: "Page" }).focus();
    act(() => {
      toast.add({
        title: "Saved",
        description: "The note was saved.",
        type: "success",
      });
    });

    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    expect(screen.getByText("The note was saved.")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("data-type", "success");
    expect(screen.getByRole("button", { name: "Page" })).toHaveFocus();
  });

  it("stacks toasts, runs an action, and dismisses one", () => {
    const onUndo = vi.fn();

    render(<Toaster position="top-right" />);
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

    fireEvent.click(screen.getAllByRole("button", { name: "Dismiss" })[0]!);

    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("dismisses automatically and pauses while hovered", () => {
    vi.useFakeTimers();
    render(<Toaster />);

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

    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("keeps a loading toast until it is updated", async () => {
    render(<Toaster />);

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

  it("announces an error with an alert", () => {
    render(<Toaster />);

    act(() => {
      toast.add({ title: "Could not save", type: "error" });
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Could not save");
  });
});
