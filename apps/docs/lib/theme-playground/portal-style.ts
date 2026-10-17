import type { ThemeConfig } from "./theme";
import { themePreviewStyle, type ThemePreviewMode } from "./preview-style";

/**
 * Marker set on `<body>` while a theme preview is on screen. The rules below
 * are scoped to it so nothing leaks onto other pages.
 */
export const themePreviewPortalClassName = "vinyaas-theme-preview";

/**
 * Overlay content (Popover, and therefore Combobox and Date Picker, plus
 * Select, Dialog, Dropdown Menu and Tooltip) portals into `document.body`, so
 * it is not a descendant of the preview wrapper and never inherits the
 * wrapper's inline CSS variables. Without these rules an opened Select or
 * Date Picker renders in the site theme while everything behind it shows the
 * previewed one — and `--popover` is only ever used by portalled layers, so
 * that token could not be previewed at all.
 *
 * Matching on the layer's own role keeps the page chrome (header, nav, the
 * controls strip) on the site theme: those are body children too, but none of
 * them carries one of these roles.
 */
const portalLayerSelectors = [
  '[role="dialog"]',
  '[role="listbox"]',
  '[role="menu"]',
  '[role="tooltip"]',
] as const;

/**
 * A stylesheet that re-declares the preview's tokens on body-level overlay
 * layers. Mode is not re-declared as a class: the playground follows the
 * site's light/dark mode, so `.dark` is already on `<html>` and `dark:`
 * utilities inside a portal resolve correctly on their own.
 */
export function themePreviewPortalCss(
  theme: ThemeConfig,
  mode: ThemePreviewMode,
): string {
  const style = themePreviewStyle(theme, mode);
  const declarations = Object.entries(style)
    .filter((entry): entry is [string, string] => entry[0].startsWith("--"))
    .map(([property, value]) => `  ${property}: ${value};`);

  declarations.push(`  color-scheme: ${mode};`);

  const selector = portalLayerSelectors
    .map((layer) => `body.${themePreviewPortalClassName} > ${layer}`)
    .join(",\n");

  return `${selector} {\n${declarations.join("\n")}\n}\n`;
}
