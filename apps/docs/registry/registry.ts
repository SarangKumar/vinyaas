import type { RegistryItem } from "./types";
import { registry as newYork } from "./new-york/registry";

export const themes = {
  "new-york": newYork,
} satisfies Record<string, readonly RegistryItem[]>;
