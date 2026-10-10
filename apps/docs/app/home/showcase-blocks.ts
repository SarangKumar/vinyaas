import type { ComponentType } from "react";

import { AlertDialogBlock } from "@/app/home/blocks/alert-dialog-block";
import { AnalyticsBlock } from "@/app/home/blocks/analytics-block";
import { CalendarBlock } from "@/app/home/blocks/calendar-block";
import { ChartBlock } from "@/app/home/blocks/chart-block";
import { ChatBlock } from "@/app/home/blocks/chat-block";
import { ComboboxBlock } from "@/app/home/blocks/combobox-block";
import { CommandSearchBlock } from "@/app/home/blocks/command-search-block";
import { CompanionBlock } from "@/app/home/blocks/companion-block";
import { ConnectDeviceBlock } from "@/app/home/blocks/connect-device-block";
import { ContributionHistoryBlock } from "@/app/home/blocks/contribution-history-block";
import { DataTableBlock } from "@/app/home/blocks/data-table-block";
import { DatePickerBlock } from "@/app/home/blocks/date-picker-block";
import { DragAndDropBlock } from "@/app/home/blocks/drag-and-drop-block";
import { EmptyStateBlock } from "@/app/home/blocks/empty-state-block";
import { FormBlock } from "@/app/home/blocks/form-block";
import { LoadingStateBlock } from "@/app/home/blocks/loading-state-block";
import { MediaControlsBlock } from "@/app/home/blocks/media-controls-block";
import { MilestoneBlock } from "@/app/home/blocks/milestone-block";
import { NotificationSettingsBlock } from "@/app/home/blocks/notification-settings-block";
import { OtpBlock } from "@/app/home/blocks/otp-block";
import { PaginationBlock } from "@/app/home/blocks/pagination-block";
import { PaymentConfirmationBlock } from "@/app/home/blocks/payment-confirmation-block";
import { PaymentMethodBlock } from "@/app/home/blocks/payment-method-block";
import { PrimitivesKitBlock } from "@/app/home/blocks/primitives-kit-block";
import { RecentDocumentsBlock } from "@/app/home/blocks/recent-documents-block";
import { ResizableBlock } from "@/app/home/blocks/resizable-block";
import { ScheduleBlock } from "@/app/home/blocks/schedule-block";
import { SelectBlock } from "@/app/home/blocks/select-block";
import { SheetBlock } from "@/app/home/blocks/sheet-block";
import { TableBlock } from "@/app/home/blocks/table-block";
import { TabsSettingsBlock } from "@/app/home/blocks/tabs-settings-block";
import { WorkspaceNavBlock } from "@/app/home/blocks/workspace-nav-block";
import { components } from "@/components/component-meta";

/**
 * Homepage showcase policy
 * ------------------------
 * Always render exactly {@link SHOWCASE_BLOCK_COUNT} masonry cards.
 *
 * When a new showcase-worthy registry component ships:
 * 1. Add a compact block that demonstrates a real interaction/composition.
 * 2. Prefer placing new-component blocks near the start of this list.
 * 3. Prefer a count divisible by 4 (and ideally 8) so 4-column desktops
 *    land even stacks. Grow when real demos exist; do not pad with junk.
 * 4. Do not remove important single-representation components just because
 *    they are older.
 * 5. Keep cards light. Avoid Sidebar, Navigation Menu, and other full app
 *    chrome shells — those belong on docs pages, not the masonry.
 *
 * Layout (homepage, shadcn-style grid of flex columns):
 * 1 · md:2 · lg:3 · min-[1400px]:4 · min-[1900px]:5
 * Cards pack via first-fit decreasing on {@link ShowcaseBlockDefinition.weight}.
 *
 * v1.3.1: 32 demos (was 25) with weights tuned to real card heights so
 * every column bottoms out evenly above the footer. Navigation Menu /
 * Sidebar stay docs-only.
 */

/** Shell / nav primitives that are too dense for homepage masonry cards. */
export const homepageExcludedNewComponents = [
  "navigation-menu",
  "sidebar",
] as const;

/** Fixed homepage showcase cardinality — product rule, not incidental. */
export const SHOWCASE_BLOCK_COUNT = 32;

export type ShowcaseBlockDefinition = {
  id: string;
  /**
   * Primary registry component slugs this block demonstrates.
   * Empty when the block is a non-registry feature (e.g. Companion preview).
   */
  components: readonly string[];
  /**
   * Relative visual height for masonry packing (1 = short, 8 = very tall).
   * Tuned against the live homepage — not CSS.
   */
  weight: number;
  Block: ComponentType;
};

const registrySlugs = new Set(components.map((component) => component.slug));

/**
 * Ordered source of truth for homepage playground cards.
 * Rendered by {@link Playground}; length is asserted in tests.
 *
 * Weights reflect measured visual mass (primitives/command/table run tall;
 * date-picker/combobox stay compact).
 */
export const showcaseBlocks: readonly ShowcaseBlockDefinition[] = [
  { id: "chart", weight: 6, components: ["chart"], Block: ChartBlock },
  {
    id: "analytics",
    weight: 6,
    components: [
      "select",
      "badge",
      "button",
      "separator",
      "label",
      "toggle",
      "toggle-group",
      "score-ring",
    ],
    Block: AnalyticsBlock,
  },
  {
    id: "contribution",
    weight: 5,
    components: ["card", "button"],
    Block: ContributionHistoryBlock,
  },
  {
    id: "sheet",
    weight: 3,
    components: ["sheet", "button", "input", "label", "switch", "badge"],
    Block: SheetBlock,
  },
  {
    id: "alert-dialog",
    weight: 3,
    components: ["alert-dialog", "button", "badge"],
    Block: AlertDialogBlock,
  },
  {
    id: "data-table",
    weight: 6,
    components: [
      "data-table",
      "table",
      "pagination",
      "checkbox",
      "input",
      "badge",
      "dropdown-menu",
    ],
    Block: DataTableBlock,
  },
  {
    id: "documents",
    weight: 6,
    components: [
      "table",
      "input",
      "label",
      "badge",
      "button",
      "avatar",
      "dropdown-menu",
    ],
    Block: RecentDocumentsBlock,
  },
  {
    id: "calendar",
    weight: 5,
    components: ["calendar"],
    Block: CalendarBlock,
  },
  {
    id: "date-picker",
    weight: 2,
    components: ["date-picker", "label"],
    Block: DatePickerBlock,
  },
  {
    id: "activity",
    weight: 5,
    components: ["avatar", "badge", "separator"],
    Block: ScheduleBlock,
  },
  {
    id: "combobox",
    weight: 2,
    components: ["combobox", "label"],
    Block: ComboboxBlock,
  },
  {
    id: "empty-state",
    weight: 3,
    components: ["empty-state", "button"],
    Block: EmptyStateBlock,
  },
  {
    id: "loading",
    weight: 5,
    components: ["skeleton", "spinner", "marker", "button", "separator"],
    Block: LoadingStateBlock,
  },
  {
    id: "form",
    weight: 4,
    components: ["form", "input", "label", "button", "switch"],
    Block: FormBlock,
  },
  {
    id: "milestone",
    weight: 4,
    components: ["input", "label", "button"],
    Block: MilestoneBlock,
  },
  {
    id: "resizable",
    weight: 3,
    components: ["resizable"],
    Block: ResizableBlock,
  },
  {
    id: "otp",
    weight: 3,
    components: ["input-otp", "badge", "button"],
    Block: OtpBlock,
  },
  {
    id: "drag-and-drop",
    weight: 4,
    components: ["drag-and-drop"],
    Block: DragAndDropBlock,
  },
  {
    id: "select",
    weight: 3,
    components: ["select", "label", "button"],
    Block: SelectBlock,
  },
  {
    id: "media",
    weight: 5,
    components: ["slider", "switch", "label", "badge"],
    Block: MediaControlsBlock,
  },
  {
    id: "channels",
    weight: 5,
    components: ["switch", "label", "badge", "button", "separator"],
    Block: NotificationSettingsBlock,
  },
  {
    id: "pagination",
    weight: 3,
    components: ["pagination", "badge"],
    Block: PaginationBlock,
  },
  {
    id: "payment",
    weight: 4,
    components: ["badge", "button", "separator"],
    Block: PaymentConfirmationBlock,
  },
  {
    id: "payment-method",
    weight: 3,
    components: ["badge", "button", "dropdown-menu"],
    Block: PaymentMethodBlock,
  },
  {
    id: "connect-device",
    weight: 4,
    components: [],
    Block: ConnectDeviceBlock,
  },
  {
    id: "workspace-nav",
    weight: 4,
    components: [],
    Block: WorkspaceNavBlock,
  },
  {
    id: "primitives",
    weight: 8,
    components: [
      "button",
      "input",
      "checkbox",
      "radio-group",
      "switch",
      "dialog",
      "dropdown-menu",
      "label",
      "textarea",
      "badge",
    ],
    Block: PrimitivesKitBlock,
  },
  {
    id: "table",
    weight: 6,
    components: ["table", "input", "badge", "dropdown-menu", "avatar"],
    Block: TableBlock,
  },
  {
    id: "command",
    weight: 6,
    components: ["command", "kbd"],
    Block: CommandSearchBlock,
  },
  { id: "companion", weight: 4, components: [], Block: CompanionBlock },
  {
    id: "chat",
    weight: 4,
    components: ["button", "textarea", "avatar"],
    Block: ChatBlock,
  },
  {
    id: "tabs",
    weight: 5,
    components: ["tabs", "input", "button", "label"],
    Block: TabsSettingsBlock,
  },
];

if (showcaseBlocks.length !== SHOWCASE_BLOCK_COUNT) {
  throw new Error(
    `Homepage showcase must contain exactly ${SHOWCASE_BLOCK_COUNT} blocks (found ${showcaseBlocks.length}).`,
  );
}

/** Unique showcase ids — used by tests and future tooling. */
export function showcaseBlockIds() {
  return showcaseBlocks.map((block) => block.id);
}

/** Registry slugs referenced by showcase blocks (non-empty components only). */
export function showcaseComponentSlugs() {
  return [
    ...new Set(
      showcaseBlocks.flatMap((block) => block.components).filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

/** True when every non-empty slug maps to a known registry component. */
export function showcaseComponentsAreValid() {
  return showcaseBlocks.every((block) =>
    block.components.every((slug) => registrySlugs.has(slug)),
  );
}

/**
 * Filter showcase cards by id/title/component slug.
 * Empty/whitespace filter returns the full list (no-filter = show everything).
 * Non-empty filter with no matches returns [] for empty-state UI.
 */
export function filterShowcaseBlocks(
  blocks: readonly ShowcaseBlockDefinition[],
  filter?: string | null,
): ShowcaseBlockDefinition[] {
  const needle = filter?.trim().toLowerCase() ?? "";

  if (!needle) {
    return [...blocks];
  }

  return blocks.filter((block) => {
    if (block.id.toLowerCase().includes(needle)) {
      return true;
    }

    return block.components.some((slug) => slug.toLowerCase().includes(needle));
  });
}

/**
 * Pack cards into balanced masonry columns.
 *
 * Uses first-fit decreasing on {@link ShowcaseBlockDefinition.weight}, then
 * restores each column to source order so reading order stays stable while
 * column bottoms stay within roughly one tall card of each other.
 */
export function distributeShowcaseBlocks(
  blocks: readonly ShowcaseBlockDefinition[],
  columnCount: number,
): ShowcaseBlockDefinition[][] {
  const count = Math.max(1, columnCount);
  const columns: ShowcaseBlockDefinition[][] = Array.from(
    { length: count },
    () => [],
  );
  const heights = Array.from({ length: count }, () => 0);
  const indexed = blocks.map((block, index) => ({ block, index }));

  indexed.sort((left, right) => {
    const weightDelta =
      Math.max(1, right.block.weight) - Math.max(1, left.block.weight);

    if (weightDelta !== 0) {
      return weightDelta;
    }

    return left.index - right.index;
  });

  for (const entry of indexed) {
    let target = 0;

    for (let index = 1; index < count; index += 1) {
      const candidateHeight = heights[index] ?? 0;
      const currentHeight = heights[target] ?? 0;
      const candidateCount = columns[index]?.length ?? 0;
      const currentCount = columns[target]?.length ?? 0;

      if (
        candidateHeight < currentHeight ||
        (candidateHeight === currentHeight && candidateCount < currentCount) ||
        (candidateHeight === currentHeight && candidateCount === currentCount)
      ) {
        target = index;
      }
    }

    columns[target]?.push(entry.block);
    heights[target] = (heights[target] ?? 0) + Math.max(1, entry.block.weight);
  }

  const order = new Map(blocks.map((block, index) => [block, index]));

  for (const column of columns) {
    column.sort(
      (left, right) => (order.get(left) ?? 0) - (order.get(right) ?? 0),
    );
  }

  return columns;
}

/** Sum of weights in each column — used by tests to assert balance. */
export function showcaseColumnWeights(
  columns: readonly (readonly ShowcaseBlockDefinition[])[],
): number[] {
  return columns.map((column) =>
    column.reduce((sum, block) => sum + Math.max(1, block.weight), 0),
  );
}
