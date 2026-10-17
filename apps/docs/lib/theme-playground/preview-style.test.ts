import { describe, expect, it } from "vitest";

import {
  createDefaultTheme,
  siteThemeVariables,
  themePreviewStyle,
} from "./index";

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

  it("derives sidebar tokens so they follow the preview instead of globals.css", () => {
    const theme = createDefaultTheme();

    const light = themePreviewStyle(theme, "light");
    const dark = themePreviewStyle(theme, "dark");
    const site = siteThemeVariables(theme, "light");

    expect(light["--sidebar"]).toBe("var(--background)");
    expect(dark["--sidebar"]).toBe("var(--card)");
    expect(light["--sidebar-accent"]).toBe("var(--accent)");
    // Preview and site-wide apply must agree, or applying a theme would shift
    // the sidebar away from what the preview showed.
    expect(site["--sidebar"]).toBe(light["--sidebar"]);
    expect(site["--sidebar-ring"]).toBe(light["--sidebar-ring"]);
  });
});
