import { registryComponentCategories } from "../categories";
import type { RegistryItem } from "../types";

const items: readonly RegistryItem[] = [
  {
    name: "button",
    type: "registry:ui",
    description: "A composable button component with variants and sizes.",
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
    description: "A text field that passes through native input attributes.",
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
    description:
      "A multiline text field that passes through native textarea attributes.",
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
    description: "A visible name for a form control.",
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
    description: "A native checkbox for selecting one or more options.",
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
    description: "A set of mutually exclusive options.",
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
    description: "An image with a fallback for a person or entity.",
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
    description: "A native progress indicator for a known amount of work.",
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
    description: "A placeholder shown while content is loading.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/skeleton/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "resizable",
    type: "registry:ui",
    description:
      "Resizable panel layouts with accessible drag handles for dashboards.",
    dependencies: ["react-resizable-panels", "clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/resizable/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "drag-and-drop",
    type: "registry:ui",
    description:
      "Sortable and reorderable drag-and-drop for lists, cards, and boards.",
    dependencies: [
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "ui/drag-and-drop/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "sidebar",
    type: "registry:ui",
    description:
      "Composable dashboard sidebar with expanded, collapsed, and mobile navigation.",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: ["drawer", "tooltip"],
    files: [
      {
        path: "ui/sidebar/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    description: "A horizontal or vertical divider between content.",
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
    description: "A compact label for a keyboard key.",
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
    description: "A switch control for binary on and off settings.",
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
    description: "A set of panels that share one visible view at a time.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
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
    description: "A semantic table for rows and columns.",
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
    description: "A short floating label shown on hover or focus.",
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
    description:
      "A styled native select with a chevron and consistent field chrome.",
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
    description:
      "A temporary notice for success, error, or informational feedback.",
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
    description: "A compact label for status or category.",
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
    description: "A compact loading indicator for inline and button contexts.",
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
    description: "A floating panel with interactive content.",
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
    description: "A bordered container for related content.",
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
    description: "A notice for a status that should be announced.",
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
    description:
      "A container that preserves a fixed width-to-height aspect ratio.",
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
    description:
      "A file or image chip with media, metadata, upload state, and actions.",
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
    description:
      "A composable dialog component for confirmations, forms, and interactive workflows.",
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
    name: "drawer",
    type: "registry:ui",
    description: "A panel that slides in from the edge of the screen.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/drawer/index.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer.css",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "chart",
    type: "registry:ui",
    description: "Themed charts for dashboards and product analytics.",
    dependencies: ["clsx", "recharts", "tailwind-merge"],
    files: [
      {
        path: "ui/chart/index.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "accordion",
    type: "registry:ui",
    description: "A stack of sections that expand and collapse.",
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
    description: "A trail of links for the current page.",
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
    description: "A native scroll container with a thin scrollbar.",
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
    description: "A native range input for a value between two bounds.",
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
    description:
      "A preview that opens when a link or button is hovered or focused.",
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
    description: "An inline status, bordered row, or labeled divider.",
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
    description: "A field with icons, text, and actions in one row.",
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
    description: "A one-time code made of grouped digit slots.",
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
    description: "A native file picker that also accepts a drag and drop.",
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
    description: "A searchable list for pages and actions.",
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
    description: "Semantic text styles for titles, body, and supporting copy.",
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
    description: "A menu of actions anchored to a trigger control.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "ui/dropdown-menu/index.tsx",
        type: "registry:ui",
      },
    ],
  },
];

export const registry: readonly RegistryItem[] = items.map((item) => {
  const category = registryComponentCategories[item.name];

  if (!category) {
    throw new Error(`Missing registry category for "${item.name}"`);
  }

  return { ...item, category };
});
