import {
  CONSUMER_DARK_VARIANT,
  CONSUMER_TAILWIND_IMPORT,
  consumerDarkTokens,
  consumerLightTokens,
  consumerThemeInline,
  renderConsumerCssTemplate,
} from "./tokens.ts";

interface CssBlock {
  prelude: string;
  bodyStart: number;
  bodyEnd: number;
  close: number;
  depth: number;
  start: number;
}

/**
 * Creates or updates consumer CSS for Vinyaas.
 *
 * Managed blocks always render in this order:
 * 1. `@import "tailwindcss"`
 * 2. `@custom-variant dark ...`
 * 3. `:root`
 * 4. `.dark`
 * 5. `@theme inline`
 *
 * Unrelated user CSS is preserved after those blocks.
 * Existing custom token values inside managed blocks are kept.
 */
export function ensureConsumerCss(source: string | null): {
  next: string;
  created: boolean;
  changed: boolean;
} {
  if (source === null || source.trim() === "") {
    const next = renderConsumerCssTemplate();
    return { next, created: true, changed: true };
  }

  const extracted = extractManagedCss(source);
  const light = mergeDeclarations(extracted.root, consumerLightTokens);
  const dark = mergeDeclarations(extracted.dark, consumerDarkTokens);
  const theme = mergeDeclarations(extracted.theme, consumerThemeInline);
  const managed = [
    CONSUMER_TAILWIND_IMPORT,
    "",
    CONSUMER_DARK_VARIANT,
    "",
    "/* Theme */",
    formatBlock(":root", light),
    "",
    formatBlock(".dark", dark),
    "",
    formatBlock("@theme inline", theme),
  ].join("\n");
  // create-next-app leaves a prefers-color-scheme :root override that fights
  // class-based `.dark` theming (e.g. drawer `bg-background` goes dark while
  // `bg-card` stays light). Strip that conflict; keep other user CSS.
  const remainder = stripConflictingColorSchemeRoot(extracted.remainder).trim();
  const next = `${managed}${remainder ? `\n\n${remainder}` : ""}\n`;

  return {
    next,
    created: false,
    changed: next !== (source.endsWith("\n") ? source : `${source}\n`),
  };
}

/**
 * Removes `@media (prefers-color-scheme: dark) { :root { … } }` leftovers.
 * Nested rules inside other media queries are left alone.
 */
function stripConflictingColorSchemeRoot(css: string): string {
  return css.replace(
    /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*\{\s*:root\s*\{[^}]*\}\s*\}/g,
    "",
  );
}

function mergeDeclarations(
  existing: ReadonlyMap<string, string>,
  defaults: Readonly<Record<string, string>>,
): Record<string, string> {
  const merged: Record<string, string> = {};

  for (const [name, value] of Object.entries(defaults)) {
    merged[name] = existing.get(name) ?? value;
  }

  for (const [name, value] of existing) {
    if (!(name in merged)) {
      merged[name] = value;
    }
  }

  return merged;
}

function extractManagedCss(source: string): {
  root: Map<string, string>;
  dark: Map<string, string>;
  theme: Map<string, string>;
  remainder: string;
} {
  const root = new Map<string, string>();
  const dark = new Map<string, string>();
  const theme = new Map<string, string>();
  const remove: Array<{ start: number; end: number }> = [];
  let working = source;

  // Strip managed at-rules first (they are not `{` blocks).
  working = working.replace(/@import\s+["']tailwindcss["']\s*;\s*/g, "");
  working = working.replace(/@custom-variant\s+dark\b[^;]*;\s*/g, "");
  working = working.replace(/\/\*\s*Theme\s*\*\/\s*/g, "");

  const blocks = scanBlocks(working);

  for (const block of blocks) {
    if (block.depth !== 0) {
      continue;
    }

    if (block.prelude === ":root") {
      mergeInto(
        root,
        readDeclarations(working.slice(block.bodyStart, block.bodyEnd)),
      );
      remove.push({ start: block.start, end: block.close + 1 });
      continue;
    }

    if (block.prelude === ".dark") {
      mergeInto(
        dark,
        readDeclarations(working.slice(block.bodyStart, block.bodyEnd)),
      );
      remove.push({ start: block.start, end: block.close + 1 });
      continue;
    }

    if (block.prelude === "@theme inline") {
      mergeInto(
        theme,
        readDeclarations(working.slice(block.bodyStart, block.bodyEnd)),
      );
      remove.push({ start: block.start, end: block.close + 1 });
    }
  }

  const remainder = removeRanges(working, remove)
    .replace(/^\uFEFF/, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { root, dark, theme, remainder };
}

function mergeInto(
  target: Map<string, string>,
  source: Map<string, string>,
): void {
  for (const [name, value] of source) {
    if (!target.has(name)) {
      target.set(name, value);
    }
  }
}

function removeRanges(
  source: string,
  ranges: Array<{ start: number; end: number }>,
): string {
  if (ranges.length === 0) {
    return source;
  }

  const sorted = [...ranges].sort((left, right) => right.start - left.start);
  let next = source;

  for (const range of sorted) {
    next = `${next.slice(0, range.start)}${next.slice(range.end)}`;
  }

  return next;
}

function formatBlock(
  selector: string,
  declarations: Readonly<Record<string, string>>,
): string {
  const lines = Object.entries(declarations).map(
    ([name, value]) => `  ${name}: ${value};`,
  );
  return `${selector} {\n${lines.join("\n")}\n}`;
}

function readDeclarations(body: string): Map<string, string> {
  const values = new Map<string, string>();

  for (const match of body.matchAll(/([@A-Za-z_-][\w-]*)\s*:\s*([^;]+)\s*;/g)) {
    values.set(match[1], match[2].trim());
  }

  return values;
}

function scanBlocks(css: string): CssBlock[] {
  const blocks: CssBlock[] = [];
  const stack: { prelude: string; bodyStart: number; start: number }[] = [];
  let preludeStart = 0;
  let index = 0;

  while (index < css.length) {
    if (css.startsWith("/*", index)) {
      const end = css.indexOf("*/", index + 2);
      index = end === -1 ? css.length : end + 2;
      continue;
    }

    const quote = css[index];

    if (quote === '"' || quote === "'") {
      index += 1;
      while (index < css.length && css[index] !== quote) {
        index += css[index] === "\\" ? 2 : 1;
      }
      index += 1;
      continue;
    }

    if (css[index] === ";" && stack.length === 0) {
      preludeStart = index + 1;
      index += 1;
      continue;
    }

    if (css[index] === "{") {
      stack.push({
        prelude: css.slice(preludeStart, index).replace(/\s+/g, " ").trim(),
        bodyStart: index + 1,
        start: preludeStart,
      });
      preludeStart = index + 1;
      index += 1;
      continue;
    }

    if (css[index] === "}") {
      const open = stack.pop();

      if (open) {
        blocks.push({
          prelude: open.prelude,
          bodyStart: open.bodyStart,
          bodyEnd: index,
          close: index,
          depth: stack.length,
          start: open.start,
        });
      }

      preludeStart = index + 1;
      index += 1;
      continue;
    }

    index += 1;
  }

  return blocks;
}
