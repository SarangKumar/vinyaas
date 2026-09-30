import type { CSSProperties } from "react";

export type TypesetMeasure = "60ch" | "70ch" | "80ch";
export type TypesetSize = "sm" | "md" | "lg";
export type TypesetLeading = "tight" | "normal" | "relaxed";
export type TypesetFlow = "compact" | "normal" | "loose";

export type TypesetConfig = {
  measure: TypesetMeasure;
  heading: string;
  body: string;
  mono: string;
  size: TypesetSize;
  leading: TypesetLeading;
  flow: TypesetFlow;
};

export const measureOptions: TypesetMeasure[] = ["60ch", "70ch", "80ch"];

export const headingFonts = [
  {
    label: "System",
    value: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    label: "Georgia",
    value: "Georgia, ui-serif, Times New Roman, serif",
  },
  {
    label: "Verdana",
    value: "Verdana, Geneva, sans-serif",
  },
  {
    label: "Palatino",
    value: "Palatino Linotype, Palatino, Book Antiqua, serif",
  },
] as const;

export const bodyFonts = [
  {
    label: "System",
    value: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    label: "Georgia",
    value: "Georgia, ui-serif, Times New Roman, serif",
  },
  {
    label: "Verdana",
    value: "Verdana, Geneva, sans-serif",
  },
  {
    label: "Trebuchet",
    value: "Trebuchet MS, Lucida Grande, sans-serif",
  },
] as const;

export const monoFonts = [
  {
    label: "System",
    value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  {
    label: "Courier",
    value: "Courier New, Courier, monospace",
  },
  {
    label: "Menlo",
    value: "Menlo, Monaco, Consolas, monospace",
  },
] as const;

export const sizeOptions: Array<{ label: string; value: TypesetSize }> = [
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
];

export const leadingOptions: Array<{ label: string; value: TypesetLeading }> = [
  { label: "Tight", value: "tight" },
  { label: "Normal", value: "normal" },
  { label: "Relaxed", value: "relaxed" },
];

export const flowOptions: Array<{ label: string; value: TypesetFlow }> = [
  { label: "Compact", value: "compact" },
  { label: "Normal", value: "normal" },
  { label: "Loose", value: "loose" },
];

export const defaultTypesetConfig: TypesetConfig = {
  measure: "70ch",
  heading: headingFonts[0].value,
  body: bodyFonts[0].value,
  mono: monoFonts[0].value,
  size: "md",
  leading: "normal",
  flow: "normal",
};

/** Curated combinations for Shuffle — never random ugly mixes. */
export const typesetPresets: TypesetConfig[] = [
  defaultTypesetConfig,
  {
    measure: "60ch",
    heading: headingFonts[1].value,
    body: bodyFonts[1].value,
    mono: monoFonts[1].value,
    size: "md",
    leading: "relaxed",
    flow: "loose",
  },
  {
    measure: "80ch",
    heading: headingFonts[2].value,
    body: bodyFonts[3].value,
    mono: monoFonts[2].value,
    size: "lg",
    leading: "normal",
    flow: "normal",
  },
  {
    measure: "70ch",
    heading: headingFonts[3].value,
    body: bodyFonts[0].value,
    mono: monoFonts[0].value,
    size: "sm",
    leading: "tight",
    flow: "compact",
  },
  {
    measure: "60ch",
    heading: headingFonts[0].value,
    body: bodyFonts[2].value,
    mono: monoFonts[2].value,
    size: "md",
    leading: "relaxed",
    flow: "normal",
  },
];

const sizeScale: Record<
  TypesetSize,
  { base: string; h1: string; h2: string; h3: string }
> = {
  sm: { base: "0.9375rem", h1: "1.75rem", h2: "1.35rem", h3: "1.125rem" },
  md: { base: "1rem", h1: "2.25rem", h2: "1.5rem", h3: "1.25rem" },
  lg: { base: "1.125rem", h1: "2.75rem", h2: "1.75rem", h3: "1.35rem" },
};

const leadingScale: Record<TypesetLeading, string> = {
  tight: "1.35",
  normal: "1.6",
  relaxed: "1.8",
};

const flowScale: Record<TypesetFlow, string> = {
  compact: "0.85rem",
  normal: "1.25rem",
  loose: "1.75rem",
};

export function typesetPreviewStyle(config: TypesetConfig): CSSProperties {
  const sizes = sizeScale[config.size];

  return {
    ["--typeset-measure" as string]: config.measure,
    ["--typeset-heading" as string]: config.heading,
    ["--typeset-body" as string]: config.body,
    ["--typeset-mono" as string]: config.mono,
    ["--typeset-size" as string]: sizes.base,
    ["--typeset-h1" as string]: sizes.h1,
    ["--typeset-h2" as string]: sizes.h2,
    ["--typeset-h3" as string]: sizes.h3,
    ["--typeset-leading" as string]: leadingScale[config.leading],
    ["--typeset-flow" as string]: flowScale[config.flow],
    fontFamily: "var(--typeset-body)",
    fontSize: "var(--typeset-size)",
    lineHeight: "var(--typeset-leading)",
  };
}

export function nextTypesetPreset(current: TypesetConfig): TypesetConfig {
  const index = typesetPresets.findIndex(
    (preset) =>
      preset.measure === current.measure &&
      preset.heading === current.heading &&
      preset.body === current.body &&
      preset.mono === current.mono &&
      preset.size === current.size &&
      preset.leading === current.leading &&
      preset.flow === current.flow,
  );

  const nextIndex = index >= 0 ? (index + 1) % typesetPresets.length : 1;
  return { ...typesetPresets[nextIndex]! };
}

/** Copyable CSS for the active typeset playground configuration. */
export function generateTypesetCss(config: TypesetConfig): string {
  const sizes = sizeScale[config.size];

  return `:root {
  --typeset-measure: ${config.measure};
  --typeset-heading: ${config.heading};
  --typeset-body: ${config.body};
  --typeset-mono: ${config.mono};
  --typeset-size: ${sizes.base};
  --typeset-h1: ${sizes.h1};
  --typeset-h2: ${sizes.h2};
  --typeset-h3: ${sizes.h3};
  --typeset-leading: ${leadingScale[config.leading]};
  --typeset-flow: ${flowScale[config.flow]};
}

.typeset {
  max-width: var(--typeset-measure);
  font-family: var(--typeset-body);
  font-size: var(--typeset-size);
  line-height: var(--typeset-leading);
}

.typeset :where(h1, h2, h3) {
  font-family: var(--typeset-heading);
}

.typeset :where(h1) { font-size: var(--typeset-h1); }
.typeset :where(h2) { font-size: var(--typeset-h2); }
.typeset :where(h3) { font-size: var(--typeset-h3); }

.typeset :where(p, ul, ol, blockquote, pre, table) {
  margin-block: var(--typeset-flow);
}

.typeset :where(code, kbd, samp) {
  font-family: var(--typeset-mono);
}
`;
}
