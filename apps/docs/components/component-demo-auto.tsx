"use client";

import { type ReactNode, useMemo } from "react";
import type { ApiRow } from "@/components/api-table";
import { ComponentDemo } from "@/components/component-demo";
import type { ControlValues } from "@/components/component-demo";
import {
  controlsFromApi,
  propsSource,
  type ControlOverride,
} from "@/components/control-schema";

/**
 * Wraps `ComponentDemo` for a component page's main Preview section.
 *
 * When `LivePreview` is provided, the preview updates in real time as controls
 * change. Controls and their defaults are auto-derived from the documented API
 * rows — no manual `ControlDef[]` arrays needed.
 *
 * All props are serializable so this component can be rendered from a server
 * component. `LivePreview` must come from a `"use client"` module so Next.js
 * can serialize it as a client module reference.
 */
export function ComponentDemoWithAutoControls({
  api,
  usage,
  componentTag,
  children,
  LivePreview,
  controlOverrides = {},
}: {
  api: ApiRow[];
  /** Full usage snippet shown as the default / fallback code. */
  usage: string;
  /** JSX tag name used when generating the code snippet, e.g. "Button". */
  componentTag: string;
  /** Static fallback preview when no LivePreview is given. */
  children?: ReactNode;
  /**
   * Client component that receives the current control values and renders the
   * live preview. Must be from a `"use client"` module.
   */
  LivePreview?: React.ComponentType<{ values: ControlValues }>;
  /**
   * Per-prop tuning that the `type` string alone cannot express, e.g. making a
   * CSS-variable string prop into a color picker.
   */
  controlOverrides?: Record<string, ControlOverride>;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const controls = useMemo(() => controlsFromApi(api, controlOverrides), []);

  function codeFromValues(values: ControlValues): string {
    const props = propsSource(values, controls);
    if (!props) return usage;
    const importLines = usage
      .split("\n")
      .filter((l) => l.startsWith("import "))
      .join("\n");
    const header = importLines ? `${importLines}\n\n` : "";
    return `${header}<${componentTag}\n${props}\n/>`;
  }

  if (!LivePreview || controls.length === 0) {
    // No live preview available — render statically without a Customize panel.
    return <ComponentDemo preview={children} code={usage} />;
  }

  return (
    <ComponentDemo
      preview={(values) => <LivePreview values={values} />}
      code={codeFromValues}
      controls={controls}
    />
  );
}
