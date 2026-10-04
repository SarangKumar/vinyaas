import type { ComponentType } from "react";

import { AccountSettingsBlock } from "@/app/home/blocks/account-settings-block";
import { ChartBlock } from "@/app/home/blocks/chart-block";
import { ChatBlock } from "@/app/home/blocks/chat-block";
import { CommandSearchBlock } from "@/app/home/blocks/command-search-block";
import { CompanionBlock } from "@/app/home/blocks/companion-block";
import { FilterBlock } from "@/app/home/blocks/filter-block";
import { InvoiceBlock } from "@/app/home/blocks/invoice-block";
import { LoginBlock } from "@/app/home/blocks/login-block";
import { MediaControlsBlock } from "@/app/home/blocks/media-controls-block";
import { MessagesBlock } from "@/app/home/blocks/messages-block";
import { NotificationSettingsBlock } from "@/app/home/blocks/notification-settings-block";
import { PrimitivesKitBlock } from "@/app/home/blocks/primitives-kit-block";
import { ProfileBlock } from "@/app/home/blocks/profile-block";
import { ProjectBlock } from "@/app/home/blocks/project-block";
import { ResizableBlock } from "@/app/home/blocks/resizable-block";
import { SecurityBlock } from "@/app/home/blocks/security-block";
import { SignupBlock } from "@/app/home/blocks/signup-block";
import { TableBlock } from "@/app/home/blocks/table-block";
import { TabsSettingsBlock } from "@/app/home/blocks/tabs-settings-block";
import { UploadBlock } from "@/app/home/blocks/upload-block";
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
 * Layout (PlaygroundGrid mode="showcase") stays unchanged:
 * 1 · md:2 · lg:3 · min-1400:4 · min-1900:5 — Pinterest-style columns.
 *
 * v1.3.0 note: Resizable and a dense primitives kit were added; the previous
 * loose ordering was replaced by this fixed-length source of truth. Command
 * search was added for Command/Kbd coverage.
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
  { id: "upload", components: ["file-upload"], Block: UploadBlock },
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
    id: "media",
    components: ["slider", "switch", "label"],
    Block: MediaControlsBlock,
  },
  {
    id: "signup",
    components: ["button", "input", "checkbox", "label"],
    Block: SignupBlock,
  },
  {
    id: "notifications",
    components: ["switch", "button", "label"],
    Block: NotificationSettingsBlock,
  },
  {
    id: "account",
    components: ["input", "button", "switch", "checkbox", "label"],
    Block: AccountSettingsBlock,
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
