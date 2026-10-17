"use client";

import {
  ComponentDemo,
  type ControlDef,
  type ControlValues,
} from "@/components/component-demo";
import {
  DemoIcon,
  demoIconOptions,
  demoIconTag,
} from "@/components/demo-icons";
import { Badge, type BadgeVariant } from "@/registry/new-york/ui/badge";

const controls: ControlDef[] = [
  {
    key: "variant",
    label: "Variant",
    type: "select",
    default: "default",
    options: [
      { value: "default", label: "Default" },
      { value: "secondary", label: "Secondary" },
      { value: "destructive", label: "Destructive" },
      { value: "outline", label: "Outline" },
      { value: "ghost", label: "Ghost" },
      { value: "link", label: "Link" },
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
    when: (values) => values.icon !== "none",
  },
  { key: "text", label: "Text", type: "text", default: "Badge" },
];

function BadgePreviewInner({ values }: { values: ControlValues }) {
  const icon = values.icon === "none" ? null : (values.icon as string);
  const trailing = values.iconPosition === "trailing";

  return (
    <Badge variant={values.variant as BadgeVariant}>
      {icon && !trailing ? <DemoIcon name={icon} /> : null}
      {values.text as string}
      {icon && trailing ? <DemoIcon name={icon} /> : null}
    </Badge>
  );
}

export function BadgePreview({ values }: { values: ControlValues }) {
  return <BadgePreviewInner values={values} />;
}

function badgeCode(values: ControlValues): string {
  const icon = values.icon === "none" ? null : (values.icon as string);
  const tag = icon ? demoIconTag(icon) : null;
  const trailing = values.iconPosition === "trailing";
  const text = values.text as string;

  const props =
    values.variant === "default" ? "" : ` variant="${values.variant}"`;

  const children = [
    tag && !trailing ? `  <${tag} />` : null,
    text ? `  ${text}` : null,
    tag && trailing ? `  <${tag} />` : null,
  ].filter(Boolean);

  const imports = [
    `import { Badge } from "@/components/ui/badge";`,
    tag ? `import { ${tag} } from "@/components/icons";` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `${imports}\n\n<Badge${props}>\n${children.join("\n")}\n</Badge>`;
}

/** Keeps the controls and the snippet generator on the client. */
export function BadgeInteractiveSection() {
  return (
    <ComponentDemo
      preview={(values) => <BadgePreviewInner values={values} />}
      code={badgeCode}
      controls={controls}
    />
  );
}
