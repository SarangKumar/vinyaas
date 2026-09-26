import { CliError } from "../cli-error.ts";
import type { CssRule, CssVariable } from "./types.ts";

interface CssBlock {
  prelude: string;
  bodyStart: number;
  bodyEnd: number;
  close: number;
  depth: number;
  parentPrelude: string | null;
}

const darkMedia = /prefers-color-scheme\s*:\s*dark/;

/**
 * Light variables are custom properties on a top-level `:root` rule.
 * Dark variables are custom properties on `:root` inside
 * `@media (prefers-color-scheme: dark)`.
 * Those scopes are the CSS representation of the registry's `light` and `dark`
 * fields. The schema names the modes and does not name a class selector.
 */
export function applyCss(
  source: string,
  variables: readonly CssVariable[],
  rules: readonly CssRule[],
): string {
  const blocks = scanBlocks(source);
  const lightBlocks = blocks.filter(
    (block) => block.depth === 0 && block.prelude === ":root",
  );
  const darkBlocks = blocks.filter(
    (block) => block.prelude === ":root" && isDarkMedia(block.parentPrelude),
  );
  const insertions = new Map<number, string[]>();
  const missingLight: CssVariable[] = [];
  const missingDark: CssVariable[] = [];
  const missingRules: CssRule[] = [];

  for (const variable of variables) {
    const existing = declarations(
      variable.scope === "light" ? lightBlocks : darkBlocks,
      source,
    );
    const current = existing.get(variable.name);

    if (current === undefined) {
      if (variable.scope === "light") {
        missingLight.push(variable);
      } else {
        missingDark.push(variable);
      }
      continue;
    }

    if (normalizeValue(current) !== normalizeValue(variable.value)) {
      throw new CliError(
        [
          "CSS variable conflict:",
          `${variable.name} already exists with a different value.`,
        ].join("\n"),
      );
    }
  }

  for (const rule of rules) {
    const matches = blocks.filter((block) => block.prelude === rule.selector);

    if (
      matches.some(
        (block) =>
          normalizeValue(source.slice(block.bodyStart, block.bodyEnd)) !==
          normalizeValue(rule.body),
      )
    ) {
      throw new CliError(
        [
          "CSS rule conflict:",
          `${rule.selector} already exists with a different value.`,
        ].join("\n"),
      );
    }

    if (matches.length > 0) {
      continue;
    }

    missingRules.push(rule);
  }

  if (lightBlocks[0] && missingLight.length > 0) {
    insertions.set(
      lightBlocks[0].close,
      missingLight.map((variable) => declarationLine(variable)),
    );
  }

  if (darkBlocks[0] && missingDark.length > 0) {
    insertions.set(
      darkBlocks[0].close,
      missingDark.map((variable) => declarationLine(variable)),
    );
  }

  let next = applyInsertions(source, insertions);

  if (!lightBlocks[0] && missingLight.length > 0) {
    next = appendBlock(next, ":root", missingLight.map(declarationLine));
  }

  if (!darkBlocks[0] && missingDark.length > 0) {
    const inner = missingDark.map(declarationLine).join("\n");
    next = appendRaw(
      next,
      `@media (prefers-color-scheme: dark) {\n  :root {\n${indent(inner, 4)}\n  }\n}`,
    );
  }

  for (const rule of missingRules) {
    next = appendRaw(next, formatRule(rule));
  }

  return next;
}

function formatRule(rule: CssRule): string {
  const body = rule.body.trim().replace(/;?\s*$/, "");
  return `${rule.selector} {\n  ${body};\n}`;
}

function declarationLine(variable: CssVariable): string {
  return `${variable.name}: ${normalizeValue(variable.value)};`;
}

function declarations(
  blocks: readonly CssBlock[],
  source: string,
): Map<string, string> {
  const values = new Map<string, string>();

  for (const block of blocks) {
    const body = source.slice(block.bodyStart, block.bodyEnd);
    for (const match of body.matchAll(
      /(--[A-Za-z_][\w-]*)\s*:\s*([^;]+)\s*;/g,
    )) {
      values.set(match[1], match[2].trim());
    }
  }

  return values;
}

function applyInsertions(
  source: string,
  insertions: Map<number, string[]>,
): string {
  const points = [...insertions.entries()].sort(
    (left, right) => right[0] - left[0],
  );
  let next = source;

  for (const [index, lines] of points) {
    const text = `\n${lines.map((line) => `  ${line}`).join("\n")}\n`;
    next = `${next.slice(0, index)}${text}${next.slice(index)}`;
  }

  return next;
}

function appendBlock(
  source: string,
  selector: string,
  lines: string[],
): string {
  return appendRaw(
    source,
    `${selector} {\n${lines.map((line) => `  ${line}`).join("\n")}\n}`,
  );
}

function appendRaw(source: string, block: string): string {
  const base =
    source.endsWith("\n") || source.length === 0 ? source : `${source}\n`;
  const separator = base.length === 0 || base.endsWith("\n\n") ? "" : "\n";

  return `${base}${separator}${block}\n`;
}

function indent(value: string, spaces: number): string {
  const prefix = " ".repeat(spaces);
  return value
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
}

function isDarkMedia(prelude: string | null): boolean {
  return prelude !== null && darkMedia.test(prelude);
}

export function normalizeValue(value: string): string {
  return value.trim().replace(/\s+/g, " ").replace(/;\s*$/, "");
}

function scanBlocks(css: string): CssBlock[] {
  const blocks: CssBlock[] = [];
  const stack: { prelude: string; bodyStart: number }[] = [];
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
        prelude: normalizeSelector(css.slice(preludeStart, index)),
        bodyStart: index + 1,
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
          parentPrelude: stack.at(-1)?.prelude ?? null,
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

function normalizeSelector(selector: string): string {
  return selector.replace(/\s+/g, " ").trim();
}
