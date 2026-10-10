import { components } from "@/components/component-meta";

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
    id: "1.3.2",
    label: "v1.3.2",
    summary:
      "v1.3.2 is a fit-and-finish and performance release: auto-growing Textarea, Kbd shortcuts that read evenly, a restyled Toast, Avatar symbol badges, a working empty-column drop in Drag & Drop, a static and lighter docs site, a refreshed site theme, an llm.txt map, and command options on the CLI page.",
    sections: [
      {
        title: "Component improvements",
        items: [
          `Textarea: maxRows grows the field with its content (starting at rows) and scrolls once the limit is reached. showCount still shows a current/maxLength counter below the field.`,
          `Kbd: mixed labels such as ⌘K render as one key with every character at the same height. KbdGroup groups separate keys of one shortcut.`,
          `Command: CommandShortcut renders Kbd (command now depends on the kbd registry item), and the search field is 36px tall like Input and Button.`,
          `Input Group: the field stays 36px including its border, matching Input, Button, Select, Combobox, Toggle, and Command.`,
          `Toast: one popover surface for every state, a distinct icon per state (success, info, warning, error, loading), sonner-style type sizes, a compact primary action next to the close icon, and the icon aligned with the title line.`,
          `Avatar: text badges stay on one line (for example ADMIN), and a single icon child renders a round symbol dot such as a verified check.`,
          `Dialog: size="full" stays clear of the site header, and DialogFooter pins its actions to the bottom right of tall dialogs.`,
          `Drag & Drop: boards use pointer-first collision detection, so a column that was emptied accepts items again.`,
        ],
      },
      {
        title: "Docs & site",
        items: [
          `Every docs route is prerendered as static HTML. The theme no longer uses a cookie: before hydration the site follows the system color scheme, then applies a saved light or dark choice from localStorage.`,
          `Lighter first load: the docs drop Redux for a tiny built-in store, and sidebar links prefetch on hover or focus instead of all at once.`,
          `New site theme with a 0.5rem radius and five neutral chart colors spread from black to white.`,
          `llm.txt (also at llms.txt) lists every docs page and component for language models; it is the last Get Started link.`,
          `CLI page: each command shows package-manager tabs and its --help options.`,
          `Navigation Menu previews leave room for the open panel; Table examples show the exact code behind each preview; the Spinner customization uses a macOS-style activity indicator.`,
          `Spacing: subsections get more room above them, playground and homepage gaps are 6px tighter, the homepage showcase is trimmed on laptop screens, and sidebar links are 1px smaller.`,
          `Badge, Button, and Avatar previews sit in one row; the Typeset playground no longer reserves empty space under card titles; Score Ring is documented but not on the homepage.`,
        ],
      },
      {
        title: "Release",
        items: [`CLI, docs, and workspace manifests are versioned 1.3.2.`],
      },
    ],
  },
  {
    id: "1.3.1",
    label: "v1.3.1",
    summary:
      "v1.3.1 adds Toggle, Toggle Group, and Score Ring, polishes forms, overlays, tables, and charts, and ships vinyaas update (alias: upgrade) alongside docs quality work, system-default theming, and Nyx — a dark-type companion.",
    sections: [
      {
        title: "Components",
        items: [
          `Toggle — a two-state button with aria-pressed, default and outline variants, controlled or uncontrolled state, and Button-matched heights.`,
          `Toggle Group — single or multiple selection with joined or spaced layouts, horizontal or vertical orientation, group-level variant, size, and disabled, and arrow-key focus movement.`,
          `Score Ring — a circular score meter with xs, sm, default, and lg sizes. The ring color blends from fromColor (default red at 0) to toColor (default green at 100).`,
        ],
      },
      {
        title: "Component improvements",
        items: [
          `Input, Textarea, Input Group, and Input OTP use the same background as Select, Native Select, and outline buttons so fields blend with cards and popovers.`,
          `Textarea: showCount renders a current/maxLength counter below the field on the right, linked to the field with aria-describedby.`,
          `Button: tests now pin identical box sizes for every variant at every size, so borders and outlines never make one variant larger.`,
          `Avatar: AvatarBadge anchors a status dot (online, offline, away, busy) or a text label such as PRO to the bottom-right corner without being clipped.`,
          `Dialog: size prop on DialogContent (sm, default, lg, xl, full) for wider and taller dialogs.`,
          `Select: the arrow sits in the flow of the trigger, so custom padding classes can no longer push text under it.`,
          `Kbd: symbol keys such as ⌘, ⌥, ⇧, and arrows use a larger glyph size so every key reads at the same height.`,
          `Resizable: variant="blocks" renders panels as separate bordered blocks with a small gutter and a three-dot grip; the grip rotates for vertical groups.`,
          `Table: row borders are lighter.`,
          `Data Table: the sort control uses fixed-size icons, the table uses a fixed layout (with optional column width and actionsWidth) so sorting never resizes columns, and row actions are icon buttons.`,
          `Toast: the action button sits on the right beside the close icon, and toasts slide in from the edge they are anchored to.`,
          `Chart: horizontal bar charts documented with layout="vertical".`,
          `Docs: spacing added between the Badge and Button variant and size previews.`,
        ],
      },
      {
        title: "CLI",
        items: [
          `vinyaas update (alias: vinyaas upgrade) replaces installed components with the latest registry source after a confirmation. Pass component names to update only those, or --yes to skip the prompt.`,
          `update/upgrade only touches components recorded in .vinyaas/manifest.json and supports --dry-run.`,
        ],
      },
      {
        title: "Docs & site",
        items: [
          `Sidebar reordered for chronological onboarding (GET STARTED → SECTIONS → COMPONENTS → COMPANION) without duplicated links.`,
          `Default theme follows the device/system preference until the visitor chooses light or dark.`,
          `Installation and CLI examples install Vinyaas globally (-g / yarn global add).`,
          `Removed repeated install examples; kept high-signal init and add flows.`,
          `Dark Mode guides clarify the class strategy, system default, and Next.js suppressHydrationWarning wiring.`,
          `Companion docs expanded with Interactions, Examples, and Gallery pages plus a minimal setup path.`,
          `SEO: richer keywords, JSON-LD WebSite schema, sitemap coverage for catalogs, accessibility, and companion routes.`,
          `Font display swap and consistent hierarchical type scale across docs chrome.`,
          `Theme init and JSON-LD without dangerouslySetInnerHTML; cookie + ThemeSync for system default.`,
          `Component demos centered; Alert Dialog delete triggers use size sm with icon collapse; Sidebar examples deduped (Dashboard, Collapsed, Composition).`,
        ],
      },
      {
        title: "Companions",
        items: [
          `Nyx — dark-type shade companion with glow/blink/celebrate clips, Eclipse/Umbra instances, and follow-cursor capability.`,
          `theme_change trigger: companions can react when the docs light/dark theme toggles (Nyx glows).`,
          `Dark element type with matchups and violet type badges.`,
        ],
      },
      {
        title: "Quality",
        items: [
          `Preview/code alignment pass, spacing and control polish, and accessibility/focus consistency across docs surfaces.`,
          `Changelog, version badges, and package manifests aligned on v1.3.1.`,
        ],
      },
    ],
  },
  {
    id: "1.3.0",
    label: "v1.3.0",
    summary:
      "v1.3.0 ships dashboard and form primitives, richer Companions, registry catalogs, CLI catalog installs, and stronger accessibility and release checks.",
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
          `Roster expanded to Ember, Soul, Moss, Flint (rock), Bubble (water), Rime (ice), Jab (fighting), Volt (electric), and Drake (dragon), each with companion.json, pixel clips, and type badges.`,
          `Species cards with Spawn and Know more actions, plus Pokédex-style detail pages at /companion/[id] (Bond, unlocked moves, type chart).`,
          `Landing surfaces and interactions: perch on declared surfaces/buttons/selects/code blocks; fatal fall when dropping more than 70vh above the surface below (cry while held, then puff; XP penalty on death); max one instance per type.`,
          `Bond unlocks are steeper (higher XP ranks and longer awake-time gates). Companion Animations docs with clip and move tables; Custom Companion docs updated for the fall/puff layout.`,
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

export const latestChangelogVersionId = changelogVersions[0]?.id ?? "1.3.2";

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
