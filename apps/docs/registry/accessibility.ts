/**
 * Accessibility contract for Vinyaas registry components (v1.3).
 *
 * This is a release-wide checklist, not a runtime framework.
 * Apply it when adding or changing installable UI under apps/docs/registry.
 */

export type AccessibilityChecklistItem = {
  id: string;
  title: string;
  requirement: string;
};

/** Concise a11y requirements every interactive component should meet. */
export const accessibilityContract: readonly AccessibilityChecklistItem[] = [
  {
    id: "keyboard",
    title: "Keyboard navigation",
    requirement:
      "All interactive behavior is reachable with a keyboard. Tab order follows visual order.",
  },
  {
    id: "focus-visible",
    title: "Focus visibility",
    requirement:
      "Focused controls show a visible focus-visible ring (or equivalent).",
  },
  {
    id: "focus-management",
    title: "Focus management",
    requirement:
      "Overlays move focus into the surface on open and restore it to the trigger on close when appropriate.",
  },
  {
    id: "escape",
    title: "Escape",
    requirement:
      "Dismissible overlays close on Escape without trapping the keyboard.",
  },
  {
    id: "activation",
    title: "Enter / Space",
    requirement:
      "Buttons and button-like controls activate with Enter and Space where native semantics require it.",
  },
  {
    id: "aria",
    title: "ARIA roles and states",
    requirement:
      "Prefer native elements. When custom widgets are required, expose correct roles, states, and properties.",
  },
  {
    id: "name",
    title: "Accessible name",
    requirement:
      "Every control has an accessible name (label, aria-label, or labelled-by).",
  },
  {
    id: "disabled",
    title: "Disabled state",
    requirement:
      "Disabled controls are not operable and communicate the disabled state to assistive technology.",
  },
  {
    id: "loading",
    title: "Loading state",
    requirement:
      "Loading UI exposes polite status text or an equivalent accessible announcement when it matters.",
  },
  {
    id: "touch",
    title: "Touch targets",
    requirement:
      "Primary interactive targets aim for comfortable hit areas (about 44×44 CSS px where practical).",
  },
  {
    id: "motion",
    title: "Reduced motion",
    requirement: "Non-essential motion respects prefers-reduced-motion.",
  },
  {
    id: "no-trap",
    title: "No keyboard trap",
    requirement:
      "Users can always move focus away from a component with standard keys.",
  },
] as const;

/** Short test convention for registry component tests. */
export const accessibilityTestConvention = [
  "Prefer Testing Library queries by role and accessible name.",
  "Cover keyboard activation for primary interactions.",
  "For overlays, assert Escape closes and focus returns when applicable.",
  "Assert disabled controls cannot be activated.",
  "Do not require axe or a dedicated a11y runner for every component.",
] as const;
