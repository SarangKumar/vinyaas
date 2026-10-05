import { components, currentVersion } from "@/components/component-meta";

export type ChangelogSection = {
  title: "Added" | "Improved" | "Fixed";
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
    summary: `v${currentVersion} adds dashboard primitives, registry catalogs, CLI catalog installs, and stronger accessibility and release checks.`,
    sections: [
      {
        title: "Added",
        items: [
          `Alert Dialog — confirmation modal with alertdialog semantics, non-dismissible overlay, and Cancel/Action patterns for destructive work.`,
          `Sheet — side modal for settings, details, filters, and mobile navigation with accessible focus management.`,
          `Navigation Menu — composable site navigation with rich mega-menu panels that accept arbitrary React content.`,
          `Data Table — searchable, sortable dashboard tables with row selection, column visibility, pagination, and loading/empty states composed from existing primitives.`,
          `Pagination — composable page navigation with previous/next, page links, ellipsis, and accessible current-page semantics for tables and lists.`,
          `Resizable — horizontal and vertical panel layouts with keyboard-accessible handles, nested groups, and composite docs examples.`,
          `Sidebar — composable dashboard navigation with expanded and collapsed desktop modes, mobile Drawer composition, and accessible collapsed labels.`,
          `Drag & Drop — sortable and reorderable lists and boards via @dnd-kit, with handles, keyboard and touch support, drop indicators, and multiple containers.`,
          `Select — searchable custom dropdown with grouped options, built-in filter, keyboard listbox navigation, and form-friendly hidden input support.`,
          `Select documentation with basic, grouped, disabled, long-list, form, and dashboard examples.`,
          `Calendar — accessible month calendar for single-date selection with keyboard navigation and disabled dates.`,
          `Date Picker — button + popover + calendar composition for choosing a single date.`,
          `Combobox — searchable selection built from Popover and Command for filtering and choosing options.`,
          `Empty State — composable empty panel with icon, title, description, and actions for lists and dashboards.`,
          `Named catalogs (form, dashboard, navigation, feedback, application) published under /r/catalogs/.`,
          `CLI catalog commands: vinyaas catalog list, vinyaas catalog info, and vinyaas add --catalog.`,
          `vinyaas add --dry-run for install previews without writing files.`,
          `New-component indicator in docs navigation for the current release, plus a New Components section on the catalog page.`,
          `Red theme preset in the Themes playground (light and dark surfaces, charts, and radius).`,
          `Accessibility checklist and registry test conventions for keyboard, focus, ARIA, touch targets, and reduced motion.`,
          `pnpm verify and release scripts that require the production registry URL.`,
        ],
      },
      {
        title: "Improved",
        items: [
          `Resizable handle affordances: orientation-aware grips, cursors, and expanded hit targets.`,
          `Homepage showcase packing and spacing across progressive columns, with compact Resizable, Sidebar, and Drag & Drop examples.`,
          `Theme contrast polish across presets; Progress fill follows bg-primary.`,
          `Docs chrome: Home in navbar and sidebar, faster showcase first paint, and cleaner Sidebar demo shells.`,
          `Documentation sidebar: wider right rail, compact on-page links, helpful feedback actions, and a What's new feature card below feedback.`,
          `Site polish: lighter structural borders, navbar without a bottom divider, faded left sidebar edge, ~1px smaller docs type scale, and homepage Select showcase.`,
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
