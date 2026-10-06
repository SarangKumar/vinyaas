import { components, currentVersion } from "@/components/component-meta";

export type ChangelogSection = {
  title: string;
  items: string[];
};

export type ChangelogVersion = {
  id: string;
  label: string;
  summary: string;
  sections: ChangelogSection[];
};

const v01 = components.filter((component) => component.introducedIn === "0.1");
const v10 = components.filter(
  (component) => component.introducedIn === "1.0.0",
);
const v11 = components.filter(
  (component) => component.introducedIn === "1.1.0",
);
/**
 * Newest first. `id` values are used in `?v=` and must stay stable.
 */
export const changelogVersions: ChangelogVersion[] = [
  {
    id: "1.3.0",
    label: "v1.3.0",
    summary: `v${currentVersion} ships dashboard and form primitives, richer Companions, registry catalogs, CLI catalog installs, and stronger accessibility and release checks.`,
    sections: [
      {
        title: "Components",
        items: [
          `Alert Dialog — confirmation modal with alertdialog semantics, non-dismissible overlay, and Cancel/Action patterns for destructive work.`,
          `Sheet — side modal for settings, details, filters, and mobile navigation with accessible focus management.`,
          `Navigation Menu — composable site navigation with rich mega-menu panels that accept arbitrary React content.`,
          `Data Table — searchable, sortable dashboard tables with row selection, column visibility, pagination, and loading/empty states.`,
          `Pagination — composable page navigation with previous/next, page links, ellipsis, and accessible current-page semantics.`,
          `Resizable — horizontal and vertical panel layouts with keyboard-accessible handles, nested groups, and improved handle affordances.`,
          `Sidebar — composable dashboard navigation with expanded/collapsed desktop modes and mobile Drawer composition.`,
          `Drag & Drop — sortable and reorderable lists and boards via @dnd-kit, with handles, keyboard/touch support, and multiple containers.`,
          `Select — custom dropdown with grouped options, keyboard listbox navigation, and form-friendly hidden input support.`,
          `Calendar — accessible month calendar with keyboard navigation, disabled dates, and native month/year selects.`,
          `Date Picker — button + popover + calendar composition for choosing a single date.`,
          `Combobox — searchable selection built from Popover and Command.`,
          `Empty State — composable empty panel with icon, title, description, and actions.`,
          `Form — accessible field structure that wires labels, descriptions, and validation messages to existing controls.`,
        ],
      },
      {
        title: "Companions",
        items: [
          `Roster expanded to Ember, Soul, Moss, Flint (rock), Bubble (water), Rime (ice), Jab (fighting), and Volt (electric), each with companion.json, pixel clips, and type badges.`,
          `Species cards with Spawn and Know more actions, plus Pokédex-style detail pages at /companion/[id] (Bond, unlocked moves, type chart).`,
          `Landing surfaces and interactions: perch on declared surfaces/buttons/selects/code blocks; fatal fall when dropping more than 70vh above the surface below (puff, no respawn); max one instance per type.`,
          `Companion Animations docs with clip and move tables; Custom Companion docs updated for the fall/puff layout.`,
        ],
      },
      {
        title: "CLI & catalogs",
        items: [
          `Named catalogs (form, dashboard, navigation, feedback, application) published under /r/catalogs/.`,
          `vinyaas catalog list, vinyaas catalog info, and vinyaas add --catalog.`,
          `vinyaas add --dry-run for install previews without writing files.`,
          `pnpm verify and release scripts that require the production registry URL.`,
        ],
      },
      {
        title: "Docs & accessibility",
        items: [
          `New-component indicator in docs navigation, plus a New Components section on the catalog page.`,
          `What's new right-rail card with inline links for new components and companions.`,
          `Homepage companion badge above the tagline, plus showcase polish for Resizable, Sidebar, Drag & Drop, and Select.`,
          `Red theme preset in the Themes playground (light and dark surfaces, charts, and radius).`,
          `Accessibility checklist and registry test conventions for keyboard, focus, ARIA, touch targets, and reduced motion.`,
          `Docs chrome: Home in navbar and sidebar, lighter structural borders, compact type scale, and a clearer right rail.`,
        ],
      },
    ],
  },
  {
    id: "1.2.0",
    label: "v1.2.0",
    summary:
      "v1.2.0 focuses on installation clarity, Companions, and documentation structure.",
    sections: [
      {
        title: "Added",
        items: [
          `Framework-specific installation guides for Next.js, React + Vite, and React, with project-state onboarding.`,
          `Companions as a docs feature: Ember, Soul, and Moss with companion.json metadata, pixel assets, and a persistent host.`,
          `Companion interaction system with metadata-driven triggers and reusable actions.`,
          `Theming docs at /theming; Typeset playground at /typeset/playground.`,
          `CLI category discovery and install via --category, plus vinyaas status and local install tracking.`,
        ],
      },
      {
        title: "Improved",
        items: [
          `Flat sidebar navigation for SECTIONS, COMPONENTS, and GET STARTED.`,
          `Published CLI package metadata for npm discoverability.`,
          `Documentation polish across existing registry components.`,
        ],
      },
    ],
  },
  {
    id: "1.1.0",
    label: "v1.1.0",
    summary: `v1.1.0 continues the catalog with CLI project setup, registry discovery, and ${v11.length} new components.`,
    sections: [
      {
        title: "Added",
        items: [
          ...v11.map((component) => `${component.name}.`),
          `vinyaas list, vinyaas search, and vinyaas info with optional --json output.`,
          `Themes playground at /themes and Typeset playground for typography presets.`,
        ],
      },
      {
        title: "Improved",
        items: [
          `vinyaas init prepares Tailwind CSS v4 projects idempotently (theme tokens, aliases, components.json, lib/utils.ts).`,
          `vinyaas add resolves registry dependencies and skips already-installed components unless --force is set.`,
          `Installed components use components/ui/<name>/index.tsx with registry-driven discovery.`,
          `Consumer theme tokens stay in globals.css with Tailwind v4 @theme mappings and chart tokens.`,
        ],
      },
    ],
  },
  {
    id: "1.0.0",
    label: "v1.0.0",
    summary: `v1.0.0 is the major catalog release. It adds ${v10.length} components and expands forms, overlays, feedback, layout, navigation, and data display.`,
    sections: [
      {
        title: "Added",
        items: [
          `${v10.length} components as independently installable registry items (full catalog: ${components.length}).`,
          `Component pages with API reference, installation, usage examples, accessibility notes, and registry source.`,
          `TSX/JSX example switching, syntax highlighting, and documentation search (Cmd/Ctrl+K).`,
          `Multi-component CLI installs: npx vinyaas add button card badge.`,
        ],
      },
      {
        title: "Improved",
        items: [
          `Composable primitives with light/dark theme support and responsive examples.`,
          `Site and per-component Open Graph images, plus the homepage playground showcase.`,
        ],
      },
    ],
  },
  {
    id: "0.1",
    label: "v0.1",
    summary: `v0.1 is the foundation. It ships ${v01.length} component: ${v01.map((c) => c.name).join(", ")}.`,
    sections: [
      {
        title: "Added",
        items: [
          `pnpm workspace with a docs app and the @vinyaas/cli package.`,
          `New-york registry. vinyaas init writes components.json and lib/utils.ts; vinyaas add copies component source.`,
          `Light and dark themes stored in the browser.`,
          `Installation flow that records the package manager for the session (npm, pnpm, yarn, or bun).`,
        ],
      },
    ],
  },
];

export const latestChangelogVersionId = changelogVersions[0]?.id ?? "1.3.0";

export function resolveChangelogVersionId(
  value: string | null | undefined,
): string {
  if (value && changelogVersions.some((version) => version.id === value)) {
    return value;
  }

  return latestChangelogVersionId;
}

export function getChangelogVersion(id: string): ChangelogVersion {
  return (
    changelogVersions.find((version) => version.id === id) ??
    changelogVersions[0]!
  );
}
