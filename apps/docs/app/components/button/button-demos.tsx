"use client";

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
import { Button, type ButtonProps } from "@/registry/new-york/ui/button";

const ICON_SIZES = new Set(["icon", "icon-xs", "icon-sm", "icon-lg"]);

function isIconSize(values: ControlValues) {
  return ICON_SIZES.has(values.size as string);
}

/**
 * An icon size is a square with no room for words, so it always renders an
 * icon — falling back to the default one when the panel says "None".
 */
function iconFor(values: ControlValues) {
  const icon = values.icon as string;

  if (isIconSize(values)) {
    return icon === "none" ? DEFAULT_DEMO_ICON : icon;
  }

  return icon === "none" ? null : icon;
}

const controls: ControlDef[] = [
  {
    key: "variant",
    label: "Variant",
    type: "select",
    default: "default",
    options: [
      { value: "default", label: "Default" },
      { value: "outline", label: "Outline" },
      { value: "ghost", label: "Ghost" },
      { value: "destructive", label: "Destructive" },
      { value: "secondary", label: "Secondary" },
      { value: "link", label: "Link" },
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
    key: "icon",
    label: "Icon",
    type: "select",
    default: "none",
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
    // Only one child to place when the button is icon-only or has no icon.
    when: (values) => !isIconSize(values) && values.icon !== "none",
  },
  {
    key: "text",
    label: "Text",
    type: "text",
    default: "Button",
    // Icon sizes are square and show the icon alone, so the label drops out of
    // the panel instead of silently doing nothing.
    when: (values) => !isIconSize(values),
  },
  { key: "disabled", label: "Disabled", type: "toggle", default: false },
];

function ButtonPreviewInner({ values }: { values: ControlValues }) {
  const size = values.size as ButtonProps["size"];
  const icon = iconFor(values);
  const text = isIconSize(values) ? "" : (values.text as string);
  const trailing = values.iconPosition === "trailing";

  return (
    <Button
      variant={values.variant as ButtonProps["variant"]}
      size={size}
      disabled={values.disabled as boolean}
      className={icon && text ? "gap-2" : undefined}
      aria-label={text ? undefined : "Add item"}
    >
      {icon && !trailing ? <DemoIcon name={icon} /> : null}
      {text}
      {icon && trailing ? <DemoIcon name={icon} /> : null}
    </Button>
  );
}

/** Live preview rendered by the main Preview Customize panel. */
export function ButtonPreview({ values }: { values: ControlValues }) {
  return <ButtonPreviewInner values={values} />;
}

function buttonCode(values: ControlValues): string {
  const icon = iconFor(values);
  const tag = icon ? demoIconTag(icon) : null;
  const text = isIconSize(values) ? "" : (values.text as string);
  const trailing = values.iconPosition === "trailing";

  const props = [
    values.variant === "default" ? null : ` variant="${values.variant}"`,
    values.size === "default" ? null : ` size="${values.size}"`,
    icon && text ? ' className="gap-2"' : null,
    text ? null : ' aria-label="Add item"',
    values.disabled ? " disabled" : null,
  ]
    .filter(Boolean)
    .join("");

  const children = [
    tag && !trailing ? `  <${tag} />` : null,
    text ? `  ${text}` : null,
    tag && trailing ? `  <${tag} />` : null,
  ].filter(Boolean);

  const imports = [
    `import { Button } from "@/components/ui/button";`,
    tag ? `import { ${tag} } from "@/components/icons";` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `${imports}\n\n<Button${props}>\n${children.join("\n")}\n</Button>`;
}

/** Keeps the controls and the snippet generator on the client. */
export function ButtonInteractiveSection() {
  return (
    <ComponentDemo
      preview={(values) => <ButtonPreviewInner values={values} />}
      code={buttonCode}
      controls={controls}
    />
  );
}
