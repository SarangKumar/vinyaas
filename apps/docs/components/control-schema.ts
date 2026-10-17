import type { ApiRow } from "@/components/api-table";
import type { ControlDef, ControlValues } from "@/components/component-demo";

/**
 * Per-prop tuning that a `type` string cannot express.
 *
 * Numeric bounds are the main case: `number` says nothing about a sensible
 * min/max. `color` promotes a `string` prop to a picker, supplying a hex start
 * value for defaults that are not pickable (`var(--primary)`, `color-mix(...)`).
 */
export type ControlOverride = {
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Override the default value independently of min/max. */
  default?: number | string | boolean;
  /**
   * Render a string prop as a color picker starting at this value. A CSS
   * value such as `var(--primary)` keeps the swatch on-theme; the picker
   * itself opens on a hex, so pass one when the start color matters there.
   */
  color?: string;
  /** Force a string prop into a select with these options. */
  options?: string[];
  /** Keep this prop out of the panel. */
  exclude?: boolean;
};

const HEX = /^#[0-9a-f]{3,8}$/i;
const QUOTED = /^"([\s\S]*)"$/;

/** Structural / styling props that are never useful as playground controls. */
const ALWAYS_EXCLUDED = new Set([
  "className",
  "style",
  "id",
  "role",
  "children",
  "asChild",
  "ref",
  "key",
]);

/** Props whose types are never adjustable through a form control. */
function isAdjustableType(type: string): boolean {
  return !/^(RefObject|ReactNode|ReactElement|\(|.*=>)/.test(type);
}

function unquote(value: string): string {
  return QUOTED.exec(value)?.[1] ?? value;
}

/** `"dotted" | "dashed"` -> ["dotted", "dashed"]; null when not a literal union. */
function parseLiteralUnion(type: string): string[] | null {
  const parts = type.split("|").map((part) => part.trim());
  if (parts.length < 2) return null;
  const values = parts.map((part) => QUOTED.exec(part)?.[1]);
  return values.every((value) => value !== undefined)
    ? (values as string[])
    : null;
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** `pulseLength` -> `Pulse Length` */
function labelFor(prop: string): string {
  return titleCase(prop.replace(/([a-z0-9])([A-Z])/g, "$1 $2"));
}

/**
 * Derives playground controls from a documented prop table.
 *
 * The `ApiRow[]` a docs page already renders is the single source of truth, so
 * controls and their defaults cannot drift from the documented API. Props that
 * cannot be driven by a form control (refs, render props, event handlers) are
 * skipped rather than rendered as inert inputs.
 */
export function controlsFromApi(
  rows: ApiRow[],
  overrides: Record<string, ControlOverride> = {},
): ControlDef[] {
  const controls: ControlDef[] = [];

  for (const row of rows) {
    const override = overrides[row.prop] ?? {};
    const type = row.type.trim();
    const propName = row.prop;
    if (
      override.exclude ||
      ALWAYS_EXCLUDED.has(propName) ||
      propName.startsWith("aria-") ||
      propName.startsWith("on") ||
      !isAdjustableType(type)
    )
      continue;

    const label = labelFor(row.prop);
    const raw = row.defaultValue?.trim();

    if (type === "boolean") {
      controls.push({
        key: row.prop,
        label,
        type: "toggle",
        default: raw === "true",
      });
      continue;
    }

    if (type === "number") {
      const parsed = raw === undefined ? Number.NaN : Number(unquote(raw));
      const numDefault =
        override.default !== undefined
          ? (override.default as number)
          : Number.isFinite(parsed)
            ? parsed
            : (override.min ?? 0);
      controls.push({
        key: row.prop,
        label,
        type: "range",
        default: numDefault,
        min: override.min ?? 0,
        max: override.max ?? 100,
        ...(override.step === undefined ? {} : { step: override.step }),
        ...(override.unit === undefined ? {} : { unit: override.unit }),
      });
      continue;
    }

    const union = parseLiteralUnion(type);
    if (union ?? override.options) {
      const opts = override.options ?? union!;
      controls.push({
        key: row.prop,
        label,
        type: "select",
        default:
          override.default !== undefined
            ? (override.default as string)
            : raw
              ? unquote(raw)
              : opts[0]!,
        options: opts.map((value) => ({ value, label: titleCase(value) })),
      });
      continue;
    }

    if (type === "string") {
      const fallback =
        override.default !== undefined
          ? (override.default as string)
          : raw
            ? unquote(raw)
            : "";
      if (override.color ?? HEX.test(fallback)) {
        controls.push({
          key: row.prop,
          label,
          type: "color",
          default: override.color ?? fallback,
        });
        continue;
      }
      controls.push({ key: row.prop, label, type: "text", default: fallback });
    }
  }

  return controls;
}

/** Default value for every control, used to seed and to reset the panel. */
export function defaultsFor(controls: ControlDef[]): ControlValues {
  return Object.fromEntries(controls.map((c) => [c.key, c.default]));
}

/**
 * JSX prop lines for the values that differ from their defaults, so generated
 * source stays as short as the equivalent hand-written usage. Controls hidden
 * by their `when` condition are skipped, so the snippet matches the panel.
 */
export function propsSource(
  values: ControlValues,
  controls: ControlDef[],
  indent = "  ",
): string {
  return controls
    .map((control) => {
      const value = values[control.key];
      if (value === undefined || value === control.default) return null;
      if (control.when && !control.when(values)) return null;
      if (typeof value === "boolean") {
        return value ? `${indent}${control.key}` : null;
      }
      if (typeof value === "number") {
        return `${indent}${control.key}={${value}}`;
      }
      return `${indent}${control.key}="${value}"`;
    })
    .filter((line): line is string => line !== null)
    .join("\n");
}
