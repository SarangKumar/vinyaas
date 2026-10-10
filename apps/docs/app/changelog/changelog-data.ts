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
    id: "1.4.0",
    label: "v1.4.0",
    summary:
      "v1.4.0 adds Toggle, Toggle Group, and Score Ring and the vinyaas update / upgrade command, polishes forms, overlays, tables, toasts, and charts, and makes the docs site static, lighter, and re-themed with an llm.txt map.",
    sections: [
      {
        title: "Components",
        items: [
          `Toggle — a two-state button with aria-pressed, default and outline variants, controlled or uncontrolled state, Button-matched heights, and corners that follow --radius.`,
          `Toggle Group — single or multiple selection with joined or spaced layouts, horizontal or vertical orientation, group-level variant, size, and disabled, and arrow-key focus movement.`,
          `Score Ring — a circular score meter with xs (32px), sm, default, and lg sizes. The ring color blends from fromColor (default red at 0) to toColor (default green at 100).`,
        ],
      },
      {
        title: "Component improvements",
        items: [
          `Input, Textarea, Input Group, and Input OTP share the Select / outline-button background, and Button, Input, Input Group, Select, Combobox, Toggle, and Command are all 36px tall at the default size.`,
          `Textarea: showCount renders a current/maxLength counter below the field on the right; maxRows grows the field with its content and scrolls once the limit is reached.`,
          `Button: tests pin identical box sizes for every variant at every size, so borders never make one variant larger.`,
          `Select and Combobox: the dropdown is exactly as wide as the trigger (Popover exposes --popover-trigger-width), and the Select arrow sits in the flow of the trigger so padding classes cannot push text under it.`,
          `Kbd: symbol keys such as ⌘, ⌥, ⇧, and arrows render at letter height, mixed labels such as ⌘K stay one key, and KbdGroup groups separate keys.`,
          `Command: CommandShortcut renders Kbd (command now depends on the kbd registry item).`,
          `Avatar: AvatarBadge anchors a status dot, a one-line text label such as PRO or ADMIN, or a round symbol dot to the bottom-right corner.`,
          `Dialog: size prop on DialogContent (sm, default, lg, xl, full); full stays clear of the site header, and DialogFooter pins actions to the bottom right.`,
          `Toast: one popover surface for every state with a distinct icon per state aligned to the title, sonner-style type sizes, a compact action beside the close icon, and edge-aware enter and exit animation.`,
          `Resizable: variant="blocks" renders panels as separate bordered blocks with a small gutter and a three-dot grip.`,
          `Table: lighter row borders. Data Table: fixed-size sort icons, a fixed layout (optional column width and actionsWidth) so sorting never resizes columns, and icon row actions.`,
          `Drag & Drop: boards use pointer-first collision detection, so an emptied column accepts items again.`,
          `Chart: horizontal bar charts documented with layout="vertical".`,
        ],
      },
      {
        title: "CLI",
        items: [
          `vinyaas update (alias: vinyaas upgrade) replaces installed components with the latest registry source after a confirmation. Pass component names to update only those, --yes to skip the prompt, or --dry-run to preview.`,
          `Only components recorded in .vinyaas/manifest.json are updated.`,
        ],
      },
      {
        title: "Docs & site",
        items: [
          `Every docs route is prerendered as static HTML. The theme no longer uses a cookie: before hydration the site follows the system color scheme, then applies a saved light or dark choice from localStorage.`,
          `Lighter first load: the docs drop Redux for a tiny built-in store, and sidebar and What's new links prefetch on hover or focus.`,
          `New site theme with a 0.8rem radius and five neutral chart colors spread from black to white.`,
          `llm.txt (also at llms.txt) lists every docs page and component for language models; it is the last Get Started link.`,
          `CLI page: each command shows package-manager tabs and its --help options.`,
          `Previews: rounded tops that match their frame, one-row Badge, Button, and Avatar previews, room for open Navigation Menu panels, exact Table code, and a macOS-style loader in the Spinner customization.`,
          `Layout: no logo in the navbar, more space above subsections, 6px tighter playground and homepage gaps, a homepage showcase trimmed on laptop screens, 1px smaller sidebar links, and no empty band under Typeset card titles.`,
        ],
      },
      {
        title: "Release",
        items: [
          `Minor release after the published v1.3.1: new components and a new CLI command, no breaking changes. CLI, docs, and workspace manifests are versioned 1.4.0.`,
        ],
      },
    ],
  },
  {
    id: "1.3.1",
    label: "v1.3.1",
    summary:
      "v1.3.1 is a production polish release: docs quality, system-default theming, global CLI install examples, SEO/accessibility, and Nyx — a dark-type companion.",
    sections: [
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

export const latestChangelogVersionId = changelogVersions[0]?.id ?? "1.4.0";

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
