"use client";

import { useEffect, useMemo, useState } from "react";

import { applySiteTheme, resetSiteTheme } from "@/components/applied-theme";
import {
  PlaygroundBlock,
  PlaygroundContent,
  PlaygroundGrid,
  PlaygroundHeader,
  usePrintFromScroll,
  useSiteColorScheme,
} from "@/components/playground";
import {
  appliedThemeEvent,
  defaultSelection,
  generateThemeCss,
  getThemePreset,
  readAppliedTheme,
  sameAppliedTheme,
  themePreviewPortalClassName,
  themePreviewPortalCss,
  themePreviewStyle,
  themeWithRadius,
  type AppliedTheme,
  type RadiusOptionValue,
  type ThemePresetId,
} from "@/lib/theme-playground";
import { cn } from "@/lib/utils";

import { themeExamples } from "./examples";
import { ThemeControls } from "./theme-controls";

export function ThemesPlayground() {
  const [presetId, setPresetId] = useState<ThemePresetId>(
    defaultSelection.presetId,
  );
  const [radius, setRadius] = useState<RadiusOptionValue>(
    defaultSelection.radius,
  );
  const [applied, setApplied] = useState<AppliedTheme | null>(null);
  const mode = useSiteColorScheme();
  usePrintFromScroll(true);

  // Pages are static, so storage can only be read after mount. The selector
  // opens on the applied theme when there is one, so the strip always starts
  // out describing what the reader is actually looking at.
  useEffect(() => {
    const read = () => {
      const stored = readAppliedTheme();

      setApplied(stored);

      if (stored) {
        setPresetId(stored.presetId);
        setRadius(stored.radius);
      }
    };

    read();
    window.addEventListener(appliedThemeEvent, read);
    window.addEventListener("storage", read);

    return () => {
      window.removeEventListener(appliedThemeEvent, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  const selection = useMemo<AppliedTheme>(
    () => ({ presetId, radius }),
    [presetId, radius],
  );
  const isApplied = sameAppliedTheme(selection, applied);

  const theme = useMemo(
    () => themeWithRadius(getThemePreset(presetId).theme, radius),
    [presetId, radius],
  );

  const previewStyle = themePreviewStyle(theme, mode);
  const portalCss = useMemo(
    () => themePreviewPortalCss(theme, mode),
    [theme, mode],
  );
  const copyValue = useMemo(() => generateThemeCss(theme), [theme]);

  // Overlay content portals to <body>, outside the wrapper that carries the
  // preview variables, so the marker the portal rules key off has to live on
  // <body> itself. It is removed on unmount so no other page inherits it.
  useEffect(() => {
    document.body.classList.add(themePreviewPortalClassName);

    return () => {
      document.body.classList.remove(themePreviewPortalClassName);
    };
  }, []);

  return (
    <div className="from-muted/40 via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10 flex w-full min-w-0 flex-col bg-linear-to-b px-4 py-7 [--gap:var(--playground-gap)] sm:px-6 sm:py-8 md:px-8 md:[--gap:var(--playground-gap-md)] lg:px-12 xl:px-16 xl:[--gap:var(--playground-gap-xl)] 2xl:px-20">
      <PlaygroundContent>
        <PlaygroundHeader
          title="Themes"
          description="Pick a preset and radius to preview real UI, then apply it across the site."
        />
        <ThemeControls
          presetId={presetId}
          radius={radius}
          copyValue={copyValue}
          canApply={!isApplied}
          canReset={
            applied !== null || !sameAppliedTheme(selection, defaultSelection)
          }
          isApplied={isApplied}
          onPresetChange={setPresetId}
          onRadiusChange={setRadius}
          onApply={() => {
            applySiteTheme(selection);
            setApplied(selection);
          }}
          onReset={() => {
            resetSiteTheme();
            setApplied(null);
            setPresetId(defaultSelection.presetId);
            setRadius(defaultSelection.radius);
          }}
        />
        <div
          data-theme-playground
          data-theme-preset={presetId}
          data-theme-radius={radius}
          data-theme-state={isApplied ? "applied" : "preview"}
          data-mode={mode}
          className={cn(
            "bg-background text-foreground w-full min-w-0 rounded-2xl",
            mode === "dark" && "dark",
          )}
          style={previewStyle}
        >
          {/* Themes the portalled layers the wrapper above cannot reach. */}
          <style>{portalCss}</style>
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
