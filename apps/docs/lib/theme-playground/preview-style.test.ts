import { describe, expect, it } from "vitest";

import { createDefaultTheme, themePreviewStyle } from "./index";

describe("themePreviewStyle", () => {
  it("maps the active mode tokens onto scoped CSS variables", () => {
    const theme = createDefaultTheme();
    theme.light.primary = "oklch(0.5 0.1 30)";

    const light = themePreviewStyle(theme, "light");
    const dark = themePreviewStyle(theme, "dark");

    expect(light["--primary"]).toBe("oklch(0.5 0.1 30)");
    expect(light["--radius"]).toBe(theme.radius);
    expect(light["--font-sans"]).toBe(theme.fontSans);
    expect(light.colorScheme).toBe("light");
    expect(dark["--primary"]).toBe(theme.dark.primary);
    expect(dark.colorScheme).toBe("dark");
  });
});
