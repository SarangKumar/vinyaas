import type { RegistryItem } from "../types";

export const registry: readonly RegistryItem[] = [
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/button/button.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/input/input.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "textarea",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/textarea/textarea.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "label",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/label/label.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "checkbox",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/checkbox/checkbox.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "radio-group",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/radio-group/radio-group.tsx",
        type: "registry:ui",
      },
    ],
  },
];
