import {
  componentHref,
  components,
  isNewComponent,
  type ComponentMeta,
} from "@/components/component-meta";

export const githubUrl = "https://github.com/SarangKumar/vinyaas";

/** Future component and block showcase. Intentionally empty for now. */
export const homePath = "/";

/** Canonical introduction. It is not an alias of the homepage. */
export const introductionPath = "/introduction";

export const componentsPath = "/components";

export const componentsJsonPath = "/components-json";

export const installationPath = "/installation";

export const cliPath = "/cli";

/** Named registry catalogs for discovery and bulk install. */
export const catalogsPath = "/catalogs";

/** Accessibility contract for registry components. */
export const accessibilityPath = "/accessibility";

/** Companion feature area (separate from registry UI components). */
export const companionPath = "/companion";

export const companionInstallationPath = "/companion/installation";

/** Docs page for companion.json configuration. */
export const companionJsonPath = "/companion/configuration";

export const companionCustomPath = "/companion/custom";

export const companionAnimationsPath = "/companion/animations";

export const companionInteractionsPath = "/companion/interactions";

export const companionExamplesPath = "/companion/examples";

export const companionGalleryPath = "/companion/gallery";

/** Theme system documentation (tokens, CSS variables, customization). */
export const themingPath = "/theming";

/** Visual theme playground / showcase. */
export const themesPath = "/themes";

/** Typeset documentation (content rhythm and Markdown presentation). */
export const typesetPath = "/typeset";

/** Typeset playground / showcase. */
export const typesetPlaygroundPath = "/typeset/playground";

export const packageImportPath = "/package-import";

export const darkModePath = "/dark-mode";

export const changelogPath = "/changelog";

/** Plain-text docs map for LLMs (llms.txt convention). */
export const llmsTxtPath = "/llm.txt";

export type DocsNavItem = {
  title: string;
  href: string;
  description?: string;
  /** Subtle status mark (beta feature, or newly released component). */
  indicator?: "beta" | "new";
  /** Nested links. Prefer flat items — avoid third-level nesting. */
  children?: DocsNavItem[];
};

export type DocsNavGroup = {
  title: string;
  /** Section label above child links. */
  label?: boolean;
  /** Small status tag shown next to the section label, e.g. "Beta". */
  badge?: string;
  /** Dense name grid when the container is wide enough. */
  layout?: "names";
  items: DocsNavItem[];
};

function componentNavItem(component: ComponentMeta): DocsNavItem {
  return {
    title: component.name,
    href: componentHref(component.slug),
    ...(isNewComponent(component) ? { indicator: "new" as const } : {}),
  };
}

/**
 * Sidebar order is chronological / onboarding-first:
 * GET STARTED → SECTIONS → COMPONENTS → COMPANION.
 * Routes appear once (no duplicated Installation / CLI / Theming links).
 */
export const docsNav: DocsNavGroup[] = [
  {
    title: "GET STARTED",
    label: true,
    items: [
      { title: "Installation", href: installationPath },
      { title: "components.json", href: componentsJsonPath },
      { title: "Dark Mode", href: darkModePath },
      { title: "Theming", href: themingPath },
      { title: "Typeset", href: typesetPath },
      { title: "Package Import", href: packageImportPath },
      { title: "CLI", href: cliPath },
      { title: "llm.txt", href: llmsTxtPath },
    ],
  },
  {
    title: "SECTIONS",
    label: true,
    items: [
      { title: "Home", href: homePath },
      { title: "Introduction", href: introductionPath },
      { title: "Components", href: componentsPath },
      { title: "Catalogs", href: catalogsPath },
      { title: "Accessibility", href: accessibilityPath },
      { title: "Changelog", href: changelogPath },
    ],
  },
  {
    title: "COMPONENTS",
    label: true,
    layout: "names",
    items: [...components]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(componentNavItem),
  },
  {
    title: "COMPANION",
    label: true,
    badge: "Beta",
    items: [
      { title: "Introduction", href: companionPath },
      { title: "Installation", href: companionInstallationPath },
      { title: "companion.json", href: companionJsonPath },
      { title: "Animations", href: companionAnimationsPath },
      { title: "Interactions", href: companionInteractionsPath },
      { title: "Custom Companion", href: companionCustomPath },
      { title: "Examples", href: companionExamplesPath },
      { title: "Gallery", href: companionGalleryPath },
    ],
  },
];
