"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  type SortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";

export type DragDropOrientation = "vertical" | "horizontal";

export type DragDropItems =
  UniqueIdentifier[] | Record<string, UniqueIdentifier[]>;

type DragDropContextValue = {
  orientation: DragDropOrientation;
  activeId: UniqueIdentifier | null;
  overId: UniqueIdentifier | null;
  disabledIds: ReadonlySet<UniqueIdentifier>;
  isMulti: boolean;
  /** Single-list item ids when not using multiple containers. */
  singleItems: UniqueIdentifier[] | null;
  findContainer: (id: UniqueIdentifier) => string | undefined;
};

const DragDropContext = createContext<DragDropContextValue | null>(null);
const DragDropItemContext = createContext<{
  handleProps: HTMLAttributes<HTMLElement> & {
    ref?: (node: HTMLElement | null) => void;
  };
  registerHandle: (present: boolean) => void;
  isDragging: boolean;
  disabled: boolean;
} | null>(null);

function useDragDropContext(component: string) {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error(`${component} must be used within <DragDrop>.`);
  }
  return context;
}

function isMultiItems(
  items: DragDropItems,
): items is Record<string, UniqueIdentifier[]> {
  return !Array.isArray(items);
}

function flattenItems(items: DragDropItems): UniqueIdentifier[] {
  if (Array.isArray(items)) {
    return items;
  }
  return Object.values(items).flat();
}

function findContainerId(
  items: Record<string, UniqueIdentifier[]>,
  id: UniqueIdentifier,
): string | undefined {
  if (id in items) {
    return String(id);
  }
  return Object.keys(items).find((key) => items[key]?.includes(id));
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

const defaultAnnouncements = {
  onDragStart({ active }: { active: { id: UniqueIdentifier } }) {
    return `Picked up item ${String(active.id)}.`;
  },
  onDragOver({
    active,
    over,
  }: {
    active: { id: UniqueIdentifier };
    over: { id: UniqueIdentifier } | null;
  }) {
    if (!over) {
      return `Item ${String(active.id)} is no longer over a droppable area.`;
    }
    return `Item ${String(active.id)} was moved over ${String(over.id)}.`;
  },
  onDragEnd({
    active,
    over,
  }: {
    active: { id: UniqueIdentifier };
    over: { id: UniqueIdentifier } | null;
  }) {
    if (!over) {
      return `Item ${String(active.id)} was dropped.`;
    }
    return `Item ${String(active.id)} was dropped over ${String(over.id)}.`;
  },
  onDragCancel({ active }: { active: { id: UniqueIdentifier } }) {
    return `Dragging was cancelled. Item ${String(active.id)} was dropped.`;
  },
};

export type DragDropProps = {
  items: DragDropItems;
  onReorder: (items: DragDropItems) => void;
  orientation?: DragDropOrientation;
  /** Item ids that cannot be dragged. */
  disabledIds?: readonly UniqueIdentifier[];
  children: ReactNode;
  className?: string;
};

/**
 * Sortable / reorderable drag-and-drop root.
 * Not a file-upload drop zone — use File Upload for that.
 *
 * Backed by `@dnd-kit` for pointer, touch, and keyboard sensors.
 */
export function DragDrop({
  items,
  onReorder,
  orientation = "vertical",
  disabledIds = [],
  children,
  className,
}: DragDropProps) {
  const multi = isMultiItems(items);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const disabledSet = useMemo(() => new Set(disabledIds), [disabledIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const contextValue = useMemo<DragDropContextValue>(
    () => ({
      orientation,
      activeId,
      overId,
      disabledIds: disabledSet,
      isMulti: multi,
      singleItems: multi ? null : (items as UniqueIdentifier[]),
      findContainer: (id: UniqueIdentifier) => {
        if (!multi) {
          return "default";
        }
        return findContainerId(items as Record<string, UniqueIdentifier[]>, id);
      },
    }),
    [orientation, activeId, overId, disabledSet, multi, items],
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (disabledSet.has(event.active.id)) {
      return;
    }
    setActiveId(event.active.id);
    setOverId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    setOverId(over?.id ?? null);

    if (!multi || !over || active.id === over.id) {
      return;
    }

    const activeContainer = findContainerId(items, active.id);
    const overContainer =
      findContainerId(items, over.id) ??
      (over.id in items ? String(over.id) : undefined);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    const activeItems = items[activeContainer] ?? [];
    const overItems = items[overContainer] ?? [];
    const activeIndex = activeItems.indexOf(active.id);
    const overIndex = overItems.indexOf(over.id);
    const nextIndex = overIndex >= 0 ? overIndex : overItems.length;

    if (activeIndex < 0) {
      return;
    }

    const next: Record<string, UniqueIdentifier[]> = {
      ...items,
      [activeContainer]: activeItems.filter((id) => id !== active.id),
      [overContainer]: [
        ...overItems.slice(0, nextIndex),
        active.id,
        ...overItems.slice(nextIndex),
      ],
    };
    onReorder(next);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) {
      return;
    }

    if (!multi) {
      const list = items as UniqueIdentifier[];
      const oldIndex = list.indexOf(active.id);
      const newIndex = list.indexOf(over.id);
      if (oldIndex < 0 || newIndex < 0) {
        return;
      }
      onReorder(arrayMove(list, oldIndex, newIndex));
      return;
    }

    const activeContainer = findContainerId(items, active.id);
    const overContainer =
      findContainerId(items, over.id) ??
      (over.id in items ? String(over.id) : undefined);

    if (!activeContainer || !overContainer) {
      return;
    }

    if (activeContainer === overContainer) {
      const list = items[activeContainer] ?? [];
      const oldIndex = list.indexOf(active.id);
      const newIndex = list.indexOf(over.id);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        return;
      }
      onReorder({
        ...items,
        [activeContainer]: arrayMove(list, oldIndex, newIndex),
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  return (
    <DragDropContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={multi ? closestCorners : closestCenter}
        accessibility={{ announcements: defaultAnnouncements }}
        onDragStart={handleDragStart}
        onDragOver={multi ? handleDragOver : undefined}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          data-slot="drag-drop"
          data-orientation={orientation}
          className={cn("relative w-full min-w-0", className)}
        >
          {children}
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            <div
              data-slot="drag-drop-overlay"
              className="border-border bg-card text-card-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-md"
            >
              <DragDropHandleIcon />
              <span>Moving item</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </DragDropContext.Provider>
  );
}

export type DragDropListProps = {
  /** Required when using multiple containers. */
  id?: string;
  items?: UniqueIdentifier[];
  children: ReactNode;
  className?: string;
  strategy?: SortingStrategy;
};

/**
 * Sortable list / column. Pass `id` + the container's item ids for boards.
 */
export function DragDropList({
  id = "default",
  items,
  children,
  className,
  strategy,
}: DragDropListProps) {
  const { orientation, isMulti, singleItems } =
    useDragDropContext("DragDropList");
  const sortingStrategy =
    strategy ??
    (orientation === "horizontal"
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy);

  const listItems = items ?? singleItems ?? [];

  if (isMulti && !items) {
    throw new Error(
      "DragDropList requires an `items` prop when DragDrop uses multiple containers.",
    );
  }

  return (
    <SortableContext id={id} items={listItems} strategy={sortingStrategy}>
      <div
        data-slot="drag-drop-list"
        data-drag-drop-list={id}
        className={cn(
          "flex min-w-0",
          orientation === "horizontal" ? "flex-row gap-2" : "flex-col gap-2",
          className,
        )}
      >
        {children}
      </div>
    </SortableContext>
  );
}

export type DragDropItemProps = {
  id: UniqueIdentifier;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Sortable item. Use DragDropHandle so nested buttons/links stay interactive.
 */
export function DragDropItem({
  id,
  disabled = false,
  children,
  className,
  style,
}: DragDropItemProps) {
  const { orientation, overId, activeId, disabledIds } =
    useDragDropContext("DragDropItem");
  const isDisabled = disabled || disabledIds.has(id);

  const [hasHandle, setHasHandle] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: isDisabled,
  });

  const showIndicator = overId === id && activeId !== null && activeId !== id;

  const itemStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...style,
  };

  const handleProps = {
    ref: setActivatorNodeRef,
    ...listeners,
    ...attributes,
  };

  return (
    <DragDropItemContext.Provider
      value={{
        handleProps,
        registerHandle: setHasHandle,
        isDragging,
        disabled: isDisabled,
      }}
    >
      <div
        ref={setNodeRef}
        data-slot="drag-drop-item"
        data-dragging={isDragging ? "" : undefined}
        data-disabled={isDisabled ? "" : undefined}
        data-drop-target={showIndicator ? "" : undefined}
        style={itemStyle}
        className={cn(
          "border-border bg-card text-card-foreground relative rounded-md border",
          "transition-[opacity,box-shadow,background-color] duration-150 ease-linear",
          "motion-reduce:transition-none",
          !isDisabled && "hover:bg-accent/40",
          isDragging && "z-10 opacity-40 shadow-sm",
          isDisabled && "opacity-60",
          !hasHandle && !isDisabled && "touch-none",
          className,
        )}
        {...(!hasHandle && !isDisabled ? { ...listeners, ...attributes } : {})}
      >
        {showIndicator ? <DragDropIndicator orientation={orientation} /> : null}
        {children}
      </div>
    </DragDropItemContext.Provider>
  );
}

export type DragDropHandleProps = HTMLAttributes<HTMLButtonElement>;

/**
 * Drag activator. Prefer this over making the whole item draggable when the
 * item contains buttons, links, or inputs.
 */
export function DragDropHandle({
  className,
  children,
  "aria-label": ariaLabel = "Reorder",
  ...props
}: DragDropHandleProps) {
  const item = useContext(DragDropItemContext);
  if (!item) {
    throw new Error("DragDropHandle must be used within DragDropItem.");
  }

  const { handleProps, registerHandle, disabled } = item;
  const { ref, ...rest } = handleProps;

  React.useEffect(() => {
    registerHandle(true);
    return () => registerHandle(false);
  }, [registerHandle]);

  return (
    <button
      type="button"
      data-slot="drag-drop-handle"
      ref={ref as React.Ref<HTMLButtonElement>}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "text-muted-foreground hover:text-foreground inline-flex size-9 shrink-0 cursor-grab items-center justify-center rounded-md",
        "touch-none select-none active:cursor-grabbing",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...rest}
      {...props}
    >
      {children ?? <DragDropHandleIcon />}
    </button>
  );
}

function DragDropHandleIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <circle cx="5" cy="3.5" r="1.25" />
      <circle cx="11" cy="3.5" r="1.25" />
      <circle cx="5" cy="8" r="1.25" />
      <circle cx="11" cy="8" r="1.25" />
      <circle cx="5" cy="12.5" r="1.25" />
      <circle cx="11" cy="12.5" r="1.25" />
    </svg>
  );
}

export type DragDropIndicatorProps = {
  orientation?: DragDropOrientation;
  className?: string;
};

/** Insertion line shown at the active drop target. */
export function DragDropIndicator({
  orientation = "vertical",
  className,
}: DragDropIndicatorProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="drag-drop-indicator"
      className={cn(
        "bg-primary pointer-events-none absolute z-20 rounded-full",
        orientation === "vertical"
          ? "inset-x-2 -top-1 h-0.5"
          : "inset-y-2 -left-1 w-0.5",
        className,
      )}
    />
  );
}

/** Re-export helpers for advanced consumers. */
export { arrayMove, flattenItems };
export type { UniqueIdentifier };
