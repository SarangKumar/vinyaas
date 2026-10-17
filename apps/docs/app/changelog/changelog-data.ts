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
const v15 = components.filter(
  (component) => component.introducedIn === "1.5.0",
);

/**
 * Newest first. `id` values are used in `?v=` and must stay stable.
 */
export const changelogVersions: ChangelogVersion[] = [
  {
    id: "1.5.0",
    label: "v1.5.0",
    summary: `v1.5.0 adds ${v15.length} components (Beam, Fuse Button, Multi Input, and User Cursor), raises the date picker and other popovers above dialogs, tightens table row hover so buttons inside rows stay readable, and fixes the chevron alignment in Combobox and Select.`,
    sections: [
      {
        title: "Components",
        items: [
          `Beam — an animated connector between two elements with a glowing ray or dot pulse that travels along a dotted, dashed, or solid arc or S-curve. BeamNode provides ready-made round icon endpoints.`,
          `Fuse Button — a button whose lit state is a burning-border countdown. Pressing while the fuse burns calls onUndo; burning out calls onFire. Supports rect and circle shapes and all Button sizes including icon.`,
          `Multi Input — one field that collects several values as removable chips. Entries commit on Enter, on a separator character while typing or pasting, or on blur; \`max\`, \`validate\`, and \`allowDuplicates\` control what lands in the list, and \`name\` submits one hidden input per value. Pass \`options\` to turn it into a multi-select with a filtered dropdown (arrow keys and Enter included), and \`allowCustomValues={false}\` to accept listed values only. Part of the form catalog.`,
          `User Cursor — a Figma-style collaborative cursor: an arrow pointer with a rounded pill label showing the user's name. Color-coded per user; purely presentational so it works with any multiplayer or canvas setup.`,
        ],
      },
      {
        title: "Component improvements",
        items: [
          `Data Table: \`pageSizeOptions\` renders a toggle group beside the pager so the reader picks how many rows a page holds; \`pagination\` still sets the starting size and \`pageSizeLabel\` names the group. Picking a size returns to page 1. Data Table now depends on the toggle-group registry item.`,
          `Resizable: in \`variant="blocks"\` the three-dot grip is opt-in through \`withHandle\`, matching the default variant. Blocks groups that relied on the grip appearing on its own now need \`withHandle\` on the handle.`,
          `Popover: z-index raised from 50 to 60 so date pickers and comboboxes open above dialog overlays (Dialog is z-50).`,
          `Table: row hover uses bg-accent/40 instead of bg-accent, so interactive elements (buttons, icons) inside rows keep their own hover state visible.`,
          `Combobox: the display span inside ComboboxTrigger now carries min-w-0 flex-1 so long option labels truncate correctly and the chevron always stays at the far right.`,
          `Native Select, Select, Combobox: chevron reliably appears at the right edge regardless of text length.`,
          `Calendar: the selected range band is now a tint of the selection color instead of \`accent\`. In themes where \`accent\` sits close to \`background\` the band blended into the calendar surface, so a selected range was invisible between its end points; the tint reads against the surface in every preset and still contrasts with the solid circles on the range's first and last day.`,
        ],
      },
      {
        title: "Docs & site",
        items: [
          `Component demos were rebuilt around a toolbar that sits above the frame: Preview and Code are now toggled views rather than a stacked preview-plus-source, with desktop, tablet, and mobile width presets, a refresh control, and a drag handle on the right edge that resizes the frame down to 320px while showing the current width.`,
          `Demos can now expose a Customize panel below the frame. Controls (color, text, long text, range, toggle, and select) drive the preview and the generated source at the same time, so a single interactive demo replaces several near-identical static examples. Beam is the first page to use it.`,
          `Customize panels now cover Button, Badge, Fuse Button, Calendar, Combobox, Drag & Drop, and Data Table. Button, Badge, and Fuse Button gained Text and Icon controls — the icon is placed leading or trailing, and on an icon-only size or a circle the text control drops out of the panel, since those render the icon alone. Calendar exposes mode, caption layout, month count, and grid options; Combobox its alignment, placeholders, and a disabled option; Drag & Drop its orientation and activator; Data Table its row-count choices.`,
          `Controls can be conditional: a control declares when it applies and leaves the panel, and the generated source, while it does not.`,
          `Empty State: the free-text \`Empty className\` control is no longer in the Customize panel; it stays documented in the API table.`,
          `Themes: the preset and radius selector gained Apply Theme and Reset. A selection stays a preview — the strip reads "Preview only" until it is applied, then "Applied to site" — and Apply is disabled once the selection matches what the site is wearing. Applying sets every theme token (surfaces, borders, accents, rings, charts, sidebar, and radius) on the document and keeps it through navigation and refreshes; Reset drops the override and returns the selector to its defaults. As with the saved light/dark choice, the first paint after a hard refresh shows the shipped tokens until the saved theme is re-applied.`,
          `Themes and Typeset galleries moved from CSS multi-column to a measured Pinterest-style masonry: each card is placed in the column that is currently shortest, so all columns share a top edge, cards keep their natural heights, and the ragged tails \`column-fill: balance\` used to leave are gone. Column count (1 → 2 → 3 → 4) now follows the gallery's own width rather than the viewport, and the gutter is a consistent 24–32px on both axes.`,
          `Documentation pages widened from 48rem to 52rem, giving examples, API tables, and code blocks more room without stretching body copy; demo code blocks render at 12px.`,
          `Installation is now a CLI/Manual toggle group on every component page. The CLI tab keeps the \`npx vinyaas add\` command, and the Manual tab holds the dependency and file-placement notes followed by the component source — so the source moved out of the trailing Source section and into the step that asks for it. Section order is Preview, Installation, Usage, Examples.`,
          `Homepage showcase cards now demonstrate a use case instead of the bare component: Fuse Button is a project danger zone with an undo window, Drag & Drop is a sprint backlog that reprioritises, Resizable is an inbox list beside a reading pane, and User Cursor is a design frame with presence on the element being edited.`,
          `Textarea: the \`showCount\` counter is now pinned just under the field's bottom-right corner and taken out of flow, instead of being a right-aligned block in the wrapper that could drift wide of the field. Set width through \`containerClassName\` when \`showCount\` is on, since the counter is anchored to the wrapper.`,
          `Code blocks now follow the active theme. The frame background, header, language toggle, and line-number gutter derive from \`--card\`, \`--border\`, \`--card-foreground\`, and \`--muted-foreground\` instead of fixed neutral greys, so a preset applied or previewed from /themes reaches the code frame too. Syntax hues stay tuned per light and dark mode, and the pre-hydration system-dark fallback now carries them.`,
          `Companion Animations: the clip and move tables now use the shared Table component, so they pick up the same bordered card, muted uppercase headers, and row hover as every other table on the site instead of their own bare markup.`,
          `The dot marking a new component is now the primary color in both the sidebar and the components index, where it used to be a muted foreground tint.`,
          `Themes playground: the previewed theme now reaches overlay content. Popover, Select, Dialog, Dropdown Menu and Tooltip portal into \`body\`, outside the wrapper that carries the preview variables, so an opened Select, Combobox or Date Picker rendered in the site theme while the page behind it showed the preset — and \`--popover\`, which only portalled layers read, could not be previewed at all. Sidebar tokens are also derived for the preview now, so what the preview shows matches both Apply to site and the copied CSS.`,
        ],
      },
      {
        title: "CLI",
        items: [
          `Install tracking moved from \`.vinyaas/manifest.json\` into \`components.json\` (under the \`installedComponents\` key). Vinyaas no longer creates or needs the \`.vinyaas/\` folder. The config file that \`vinyaas init\` already writes is now the single source of truth for both project config and installed-component tracking.`,
          `JSX support: when \`tsx\` is \`false\` in \`components.json\`, Vinyaas now writes component files as \`.jsx\` (and \`.js\`) instead of \`.tsx\`. Projects using Babel with \`@babel/preset-typescript\` or other transpile setups that handle JSX work as before.`,
        ],
      },
      {
        title: "Release",
        items: [
          `Minor release. No breaking changes. All packages versioned 1.5.0.`,
          `Migration: if you have a \`.vinyaas/manifest.json\` from a previous install, it is no longer read. Run \`vinyaas add --force\` on your components to re-track them in \`components.json\`, then delete \`.vinyaas/\`.`,
        ],
      },
    ],
  },
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

export const latestChangelogVersionId = changelogVersions[0]?.id ?? "1.5.0";

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
