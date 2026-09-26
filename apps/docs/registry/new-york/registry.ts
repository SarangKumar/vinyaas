import type { RegistryItem } from "../types";

export const registry: readonly RegistryItem[] = [
  {
    name: "utils",
    type: "registry:ui",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/button/button.tsx",
        type: "registry:ui",
      },
    ],
  },
];
