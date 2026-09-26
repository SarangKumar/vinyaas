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
];
