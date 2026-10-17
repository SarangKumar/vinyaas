"use client";

import { useState } from "react";

import {
  ComponentDemo,
  type ControlDef,
  type ControlValues,
} from "@/components/component-demo";
import {
  DEFAULT_DEMO_ICON,
  DemoIcon,
  demoIconOptions,
  demoIconTag,
} from "@/components/demo-icons";
import type { ButtonProps } from "@/registry/new-york/ui/button";
import {
  FuseButton,
  type FuseButtonProps,
} from "@/registry/new-york/ui/fuse-button";

const ICON_SIZES = new Set(["icon", "icon-xs", "icon-sm", "icon-lg"]);

/** Icon sizes are square, and a circle has no room for a word either. */
function isIconOnly(values: ControlValues) {
  return ICON_SIZES.has(values.size as string) || values.shape === "circle";
}

function iconFor(values: ControlValues) {
  const icon = values.icon as string;

  if (isIconOnly(values)) {
    return icon === "none" ? DEFAULT_DEMO_ICON : icon;
  }

  return icon === "none" ? null : icon;
}

const controls: ControlDef[] = [
  {
    key: "variant",
    label: "Variant",
    type: "select",
    default: "destructive",
    options: [
      { value: "destructive", label: "Destructive" },
      { value: "default", label: "Default" },
      { value: "outline", label: "Outline" },
      { value: "secondary", label: "Secondary" },
      { value: "ghost", label: "Ghost" },
    ],
  },
  {
    key: "size",
    label: "Size",
    type: "select",
    default: "default",
    options: [
      { value: "default", label: "Default" },
      { value: "xs", label: "Xs" },
      { value: "sm", label: "Sm" },
      { value: "lg", label: "Lg" },
      { value: "icon", label: "Icon" },
      { value: "icon-xs", label: "Icon Xs" },
      { value: "icon-sm", label: "Icon Sm" },
      { value: "icon-lg", label: "Icon Lg" },
    ],
  },
  {
    key: "shape",
    label: "Shape",
    type: "select",
    default: "rect",
    options: [
      { value: "rect", label: "Rect" },
      { value: "circle", label: "Circle" },
    ],
  },
  {
    key: "icon",
    label: "Icon",
    type: "select",
    default: "trash",
    options: demoIconOptions,
  },
  {
    key: "iconPosition",
    label: "Icon Position",
    type: "select",
    default: "leading",
    options: [
      { value: "leading", label: "Leading" },
      { value: "trailing", label: "Trailing" },
    ],
    when: (values) => !isIconOnly(values) && values.icon !== "none",
  },
  {
    key: "text",
    label: "Text",
    type: "text",
    default: "Delete",
    // The idle label has nowhere to go once the button is icon-only, so the
    // control leaves the panel rather than silently doing nothing.
    when: (values) => !isIconOnly(values),
  },
  {
    // Kept for icon-only sizes too: there it becomes the accessible name
    // while the fuse burns.
    key: "undoLabel",
    label: "Undo Label",
    type: "text",
    default: "Undo",
  },
  {
    key: "duration",
    label: "Duration",
    type: "range",
    default: 5000,
    min: 1000,
    max: 10000,
    step: 500,
    unit: "ms",
  },
];

function FuseButtonPreviewInner({ values }: { values: ControlValues }) {
  const [active, setActive] = useState(false);
  const iconOnly = isIconOnly(values);
  const icon = iconFor(values);
  const text = iconOnly ? "" : (values.text as string);
  const trailing = values.iconPosition === "trailing";

  return (
    <FuseButton
      shape={values.shape as FuseButtonProps["shape"]}
      variant={values.variant as FuseButtonProps["variant"]}
      size={values.size as ButtonProps["size"]}
      duration={values.duration as number}
      undoLabel={values.undoLabel as string}
      active={active}
      onActivate={() => setActive(true)}
      onFire={() => setActive(false)}
      onUndo={() => setActive(false)}
      className={icon && text ? "gap-2" : undefined}
      aria-label={text ? undefined : "Delete"}
    >
      {icon && !trailing ? <DemoIcon name={icon} /> : null}
      {text}
      {icon && trailing ? <DemoIcon name={icon} /> : null}
    </FuseButton>
  );
}

export function FuseButtonPreview({ values }: { values: ControlValues }) {
  return <FuseButtonPreviewInner values={values} />;
}

function fuseButtonCode(values: ControlValues): string {
  const iconOnly = isIconOnly(values);
  const icon = iconFor(values);
  const tag = icon ? demoIconTag(icon) : null;
  const text = iconOnly ? "" : (values.text as string);
  const trailing = values.iconPosition === "trailing";

  const props = [
    `  variant="${values.variant}"`,
    values.size === "default" ? null : `  size="${values.size}"`,
    values.shape === "rect" ? null : `  shape="${values.shape}"`,
    values.duration === 5000 ? null : `  duration={${values.duration}}`,
    values.undoLabel === "Undo" ? null : `  undoLabel="${values.undoLabel}"`,
    `  active={active}`,
    `  onActivate={() => setActive(true)}`,
    `  onFire={() => setActive(false)}`,
    `  onUndo={() => setActive(false)}`,
    icon && text ? `  className="gap-2"` : null,
    text ? null : `  aria-label="Delete"`,
  ].filter(Boolean);

  const children = [
    tag && !trailing ? `      <${tag} />` : null,
    text ? `      ${text}` : null,
    tag && trailing ? `      <${tag} />` : null,
  ].filter(Boolean);

  const iconImport = tag
    ? `import { ${tag} } from "@/components/icons";\n`
    : "";

  return `"use client";
import { useState } from "react";
import { FuseButton } from "@/components/ui/fuse-button";
${iconImport}
export function Demo() {
  const [active, setActive] = useState(false);

  return (
    <FuseButton
${props.map((line) => `  ${line}`).join("\n")}
    >
${children.join("\n")}
    </FuseButton>
  );
}`;
}

/** Keeps the controls and the snippet generator on the client. */
export function FuseButtonInteractiveSection() {
  return (
    <ComponentDemo
      preview={(values) => <FuseButtonPreviewInner values={values} />}
      code={fuseButtonCode}
      controls={controls}
    />
  );
}
