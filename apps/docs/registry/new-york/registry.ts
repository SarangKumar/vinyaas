import type { RegistryItem } from "../types";

export const registry: readonly RegistryItem[] = [
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/button/index.tsx",
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
        path: "ui/input/index.tsx",
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
        path: "ui/textarea/index.tsx",
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
        path: "ui/label/index.tsx",
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
        path: "ui/checkbox/index.tsx",
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
        path: "ui/radio-group/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "avatar",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/avatar/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "progress",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/progress/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/skeleton/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/separator/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "kbd",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/kbd/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "switch",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/switch/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tabs",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/tabs/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "table",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/table/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tooltip",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/tooltip/index.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/tooltip.css",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "native-select",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/native-select/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toast",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/toast/index.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/toast/toast.css",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "badge",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/badge/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "spinner",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/spinner/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "popover",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/popover/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "card",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/card/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "alert",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/alert/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "aspect-ratio",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/aspect-ratio/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "attachment",
    type: "registry:ui",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/attachment/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "dialog",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/dialog/index.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog.css",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "accordion",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/accordion/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "breadcrumb",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/breadcrumb/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/scroll-area/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "slider",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/slider/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "hover-card",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/hover-card/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "marker",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/marker/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input-group",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/input-group/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input-otp",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/input-otp/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "file-upload",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/file-upload/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "command",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/command/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "typography",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/typography/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "dropdown-menu",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/dropdown-menu/index.tsx",
        type: "registry:ui",
      },
    ],
  },
];
