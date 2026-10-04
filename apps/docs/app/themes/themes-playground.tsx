"use client";

import { useMemo, useState } from "react";

import {
  PlaygroundBlock,
  PlaygroundContent,
  PlaygroundGrid,
  PlaygroundHeader,
  usePrintFromScroll,
  useSiteColorScheme,
} from "@/components/playground";
import {
  generateThemeCss,
  getThemePreset,
  themePreviewStyle,
  themeWithRadius,
  type RadiusOptionValue,
  type ThemePresetId,
} from "@/lib/theme-playground";
import { cn } from "@/lib/utils";

import { themeExamples } from "./examples";
import { ThemeControls } from "./theme-controls";

export function ThemesPlayground() {
  const [presetId, setPresetId] = useState<ThemePresetId>("default");
  const [radius, setRadius] = useState<RadiusOptionValue>("0.5rem");
  const mode = useSiteColorScheme();
  usePrintFromScroll(true);

  const theme = useMemo(
    () => themeWithRadius(getThemePreset(presetId).theme, radius),
    [presetId, radius],
  );

  const previewStyle = themePreviewStyle(theme, mode);
  const copyValue = useMemo(() => generateThemeCss(theme), [theme]);

  return (
    <div className="from-muted/40 via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10 flex w-full min-w-0 flex-col bg-linear-to-b px-4 py-7 [--gap:var(--playground-gap)] sm:px-6 sm:py-8 md:px-8 md:[--gap:var(--playground-gap-md)] lg:px-12 xl:px-16 xl:[--gap:var(--playground-gap-xl)] 2xl:px-20">
      <PlaygroundContent>
        <PlaygroundHeader
          title="Themes"
          description="Pick a preset and radius, then preview real UI. Changes stay on this page."
        />
        <ThemeControls
          presetId={presetId}
          radius={radius}
          copyValue={copyValue}
          onPresetChange={setPresetId}
          onRadiusChange={setRadius}
        />
        <div
          data-theme-playground
          data-theme-preset={presetId}
          data-theme-radius={radius}
          data-mode={mode}
          className={cn(
            "bg-background text-foreground w-full min-w-0 rounded-2xl",
            mode === "dark" && "dark",
          )}
          style={previewStyle}
        >
          <PlaygroundGrid>
            {themeExamples.map((example) => (
              <PlaygroundBlock
                key={example.id}
                title={example.title}
                description={example.description}
              >
                {example.preview}
              </PlaygroundBlock>
            ))}
          </PlaygroundGrid>
        </div>
      </PlaygroundContent>
    </div>
  );
}
