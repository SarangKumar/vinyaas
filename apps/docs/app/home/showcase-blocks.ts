import type { ComponentType } from "react";

import { ChartBlock } from "@/app/home/blocks/chart-block";
import { ChatBlock } from "@/app/home/blocks/chat-block";
import { CommandSearchBlock } from "@/app/home/blocks/command-search-block";
import { CompanionBlock } from "@/app/home/blocks/companion-block";
import { FilterBlock } from "@/app/home/blocks/filter-block";
import { InvoiceBlock } from "@/app/home/blocks/invoice-block";
import { LoginBlock } from "@/app/home/blocks/login-block";
import { SelectBlock } from "@/app/home/blocks/select-block";
import { MessagesBlock } from "@/app/home/blocks/messages-block";
import { NotificationSettingsBlock } from "@/app/home/blocks/notification-settings-block";
import { PaginationBlock } from "@/app/home/blocks/pagination-block";
import { PrimitivesKitBlock } from "@/app/home/blocks/primitives-kit-block";
import { ProfileBlock } from "@/app/home/blocks/profile-block";
import { ProjectBlock } from "@/app/home/blocks/project-block";
import { DragAndDropBlock } from "@/app/home/blocks/drag-and-drop-block";
import { ResizableBlock } from "@/app/home/blocks/resizable-block";
import { SecurityBlock } from "@/app/home/blocks/security-block";
import { SidebarBlock } from "@/app/home/blocks/sidebar-block";
import { TableBlock } from "@/app/home/blocks/table-block";
import { TabsSettingsBlock } from "@/app/home/blocks/tabs-settings-block";
import { components } from "@/components/component-meta";

/**
 * Homepage showcase policy
 * ------------------------
 * Always render exactly {@link SHOWCASE_BLOCK_COUNT} masonry cards.
 *
 * When a new showcase-worthy registry component ships:
 * 1. Add a compact block that demonstrates a real interaction/composition.
 * 2. Prefer placing new-component blocks near the start of this list.
 * 3. If the list is already full, replace a lower-value entry (duplicate
 *    coverage, overly generic, or low teaching value) — never grow past 20.
 * 4. Do not remove important single-representation components just because
 *    they are older.
 *
 * Layout (homepage, shadcn-style grid of flex columns):
 * 1 · md:2 · lg:3 · min-[1400px]:4 · min-[1900px]:5
 * Cards round-robin into exactly that many stacks so mixed heights pack
 * like Pinterest without a spare column wrapping underneath.
 *
 * v1.3.0 note: Pagination replaced Account so the list stays at 20.
 */

/** Fixed homepage showcase cardinality — product rule, not incidental. */
export const SHOWCASE_BLOCK_COUNT = 20;

export type ShowcaseBlockDefinition = {
  id: string;
  /**
   * Primary registry component slugs this block demonstrates.
   * Empty when the block is a non-registry feature (e.g. Companion preview).
   */
  components: readonly string[];
  Block: ComponentType;
};

const registrySlugs = new Set(components.map((component) => component.slug));

/**
 * Ordered source of truth for homepage playground cards.
 * Rendered by {@link Playground}; length is asserted in tests.
 */
export const showcaseBlocks: readonly ShowcaseBlockDefinition[] = [
  { id: "chart", components: ["chart"], Block: ChartBlock },
  { id: "resizable", components: ["resizable"], Block: ResizableBlock },
  { id: "sidebar", components: ["sidebar"], Block: SidebarBlock },
  {
    id: "drag-and-drop",
    components: ["drag-and-drop"],
    Block: DragAndDropBlock,
  },
  {
    id: "select",
    components: ["select"],
    Block: SelectBlock,
  },
  {
    id: "pagination",
    components: ["pagination"],
    Block: PaginationBlock,
  },
  {
    id: "primitives",
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
    id: "login",
    components: ["button", "input", "checkbox", "label"],
    Block: LoginBlock,
  },
  { id: "companion", components: [], Block: CompanionBlock },
  {
    id: "command",
    components: ["command", "kbd", "badge"],
    Block: CommandSearchBlock,
  },
  {
    id: "chat",
    components: ["button", "textarea", "avatar"],
    Block: ChatBlock,
  },
  {
    id: "table",
    components: ["table", "input", "badge", "dropdown-menu", "avatar"],
    Block: TableBlock,
  },
  {
    id: "tabs",
    components: ["tabs", "input", "button", "label"],
    Block: TabsSettingsBlock,
  },
  {
    id: "filter",
    components: ["drawer", "button", "badge"],
    Block: FilterBlock,
  },
  {
    id: "security",
    components: ["switch", "checkbox", "button"],
    Block: SecurityBlock,
  },
  {
    id: "messages",
    components: ["button", "input", "badge", "avatar"],
    Block: MessagesBlock,
  },
  {
    id: "profile",
    components: ["card", "badge", "button", "avatar", "dropdown-menu"],
    Block: ProfileBlock,
  },
  {
    id: "invoice",
    components: ["card", "badge", "button", "separator"],
    Block: InvoiceBlock,
  },
  {
    id: "project",
    components: ["card", "badge", "button", "progress", "dropdown-menu"],
    Block: ProjectBlock,
  },
  {
    id: "notifications",
    components: ["switch", "button", "label"],
    Block: NotificationSettingsBlock,
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

/** Round-robin cards into a fixed number of masonry columns. */
export function distributeShowcaseBlocks(
  blocks: readonly ShowcaseBlockDefinition[],
  columnCount: number,
): ShowcaseBlockDefinition[][] {
  const count = Math.max(1, columnCount);
  const columns: ShowcaseBlockDefinition[][] = Array.from(
    { length: count },
    () => [],
  );

  blocks.forEach((block, index) => {
    columns[index % count]?.push(block);
  });

  return columns;
}
