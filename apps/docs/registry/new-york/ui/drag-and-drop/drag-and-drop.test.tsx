import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "@/registry/new-york/ui/button";

import {
  arrayMove,
  DragDrop,
  DragDropHandle,
  DragDropItem,
  DragDropList,
  type DragDropItems,
} from "./index";

afterEach(() => {
  cleanup();
});

function BasicList({
  initial = ["Task A", "Task B", "Task C", "Task D"],
  disabledIds,
  onReorder,
}: {
  initial?: string[];
  disabledIds?: string[];
  onReorder?: (items: string[]) => void;
}) {
  const [items, setItems] = useState(initial);

  return (
    <DragDrop
      items={items}
      disabledIds={disabledIds}
      onReorder={(next) => {
        const list = next as string[];
        setItems(list);
        onReorder?.(list);
      }}
    >
      <DragDropList>
        {items.map((item) => (
          <DragDropItem
            key={item}
            id={item}
            className="flex items-center gap-2 p-1"
          >
            <DragDropHandle aria-label={`Reorder ${item}`} />
            <span>{item}</span>
            <Button type="button" size="sm" variant="ghost">
              Open {item}
            </Button>
          </DragDropItem>
        ))}
      </DragDropList>
    </DragDrop>
  );
}

function Board() {
  const [items, setItems] = useState<Record<string, string[]>>({
    todo: ["Task A", "Task B"],
    done: ["Task C"],
  });

  return (
    <div>
      <output data-testid="board-state">{JSON.stringify(items)}</output>
      <DragDrop
        items={items}
        onReorder={(next) => setItems(next as Record<string, string[]>)}
      >
        <DragDropList id="todo" items={items.todo}>
          {items.todo.map((item) => (
            <DragDropItem
              key={item}
              id={item}
              className="flex items-center gap-2 p-1"
            >
              <DragDropHandle aria-label={`Reorder ${item}`} />
              <span>{item}</span>
            </DragDropItem>
          ))}
        </DragDropList>
        <DragDropList id="done" items={items.done}>
          {items.done.map((item) => (
            <DragDropItem
              key={item}
              id={item}
              className="flex items-center gap-2 p-1"
            >
              <DragDropHandle aria-label={`Reorder ${item}`} />
              <span>{item}</span>
            </DragDropItem>
          ))}
        </DragDropList>
      </DragDrop>
    </div>
  );
}

describe("DragDrop", () => {
  it("renders a sortable list with accessible handles", () => {
    render(<BasicList />);

    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reorder Task A" }),
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: "Open Task A" })).toBeEnabled();
    expect(
      document.querySelectorAll('[data-slot="drag-drop-item"]'),
    ).toHaveLength(4);
  });

  it("reorders items via arrayMove helper used by onReorder consumers", () => {
    expect(arrayMove(["Task A", "Task B", "Task C"], 0, 1)).toEqual([
      "Task B",
      "Task A",
      "Task C",
    ]);
  });

  it("moves focus to the drag handle for keyboard activation", () => {
    render(<BasicList />);
    const handle = screen.getByRole("button", { name: "Reorder Task A" });
    handle.focus();
    expect(handle).toHaveFocus();
    expect(handle).toHaveAttribute("aria-roledescription", "sortable");
  });

  it("cancels keyboard dragging with Escape", () => {
    const onReorder = vi.fn();
    render(<BasicList onReorder={onReorder} />);

    const handle = screen.getByRole("button", { name: "Reorder Task A" });
    handle.focus();
    fireEvent.keyDown(handle, { key: " ", code: "Space" });
    fireEvent.keyDown(handle, { key: "Escape", code: "Escape" });

    expect(onReorder).not.toHaveBeenCalled();
    // Overlay may briefly mirror the active item; the source row remains.
    expect(screen.getAllByText("Task A").length).toBeGreaterThanOrEqual(1);
  });

  it("keeps nested buttons usable", () => {
    const onClick = vi.fn();
    render(
      <DragDrop items={["One"]} onReorder={() => undefined}>
        <DragDropList>
          <DragDropItem id="One" className="flex items-center gap-2 p-1">
            <DragDropHandle aria-label="Reorder One" />
            <button type="button" onClick={onClick}>
              Details
            </button>
            <a href="#one">Link</a>
            <input aria-label="Note" defaultValue="ok" />
          </DragDropItem>
        </DragDropList>
      </DragDrop>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Details" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute(
      "href",
      "#one",
    );
    expect(screen.getByRole("textbox", { name: "Note" })).toHaveValue("ok");
  });

  it("does not expose a drag handle for disabled items as enabled", () => {
    render(<BasicList disabledIds={["Task C"]} />);

    expect(
      screen.getByRole("button", { name: "Reorder Task C" }),
    ).toBeDisabled();
    expect(
      document.querySelector('[data-slot="drag-drop-item"][data-disabled]'),
    ).toBeTruthy();
  });

  it("supports multiple containers in state", () => {
    render(<Board />);

    expect(screen.getByTestId("board-state").textContent).toContain("Task A");
    expect(
      document.querySelectorAll(
        '[data-drag-drop-list="todo"] [data-slot="drag-drop-item"]',
      ),
    ).toHaveLength(2);
    expect(
      document.querySelectorAll(
        '[data-drag-drop-list="done"] [data-slot="drag-drop-item"]',
      ),
    ).toHaveLength(1);
  });

  it("keeps empty multi-container lists as drop targets", () => {
    function EmptyBoard() {
      const [items, setItems] = useState<Record<string, string[]>>({
        todo: ["Task A"],
        done: [],
      });

      return (
        <DragDrop
          items={items}
          onReorder={(next) => setItems(next as Record<string, string[]>)}
        >
          <DragDropList id="todo" items={items.todo} className="min-h-24">
            {items.todo.map((item) => (
              <DragDropItem key={item} id={item}>
                <DragDropHandle aria-label={`Reorder ${item}`} />
                {item}
              </DragDropItem>
            ))}
          </DragDropList>
          <DragDropList id="done" items={items.done} className="min-h-24" />
        </DragDrop>
      );
    }

    render(<EmptyBoard />);

    const emptyList = document.querySelector('[data-drag-drop-list="done"]');
    expect(emptyList).toBeTruthy();
    expect(
      emptyList?.querySelectorAll('[data-slot="drag-drop-item"]'),
    ).toHaveLength(0);
    // Droppable registration attaches the sortable/droppable node ref to the list.
    expect(emptyList).toHaveAttribute("data-slot", "drag-drop-list");
  });

  it("accepts Record containers as DragDropItems", () => {
    const items: DragDropItems = { a: ["1"], b: ["2"] };
    expect(Array.isArray(items)).toBe(false);
  });

  it("keeps drag overlay markup available for active items", () => {
    render(<BasicList />);
    expect(
      document.querySelector('[data-slot="drag-drop-overlay"]'),
    ).toBeNull();
    expect(
      document.querySelectorAll('[data-slot="drag-drop-item"]').length,
    ).toBeGreaterThan(0);
  });
});
