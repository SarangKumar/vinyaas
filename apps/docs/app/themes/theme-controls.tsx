"use client";

import {
  PlaygroundCheckIcon,
  PlaygroundChip,
  PlaygroundCopyCodeButton,
  PlaygroundOptionGroup,
  PlaygroundOptionStrip,
} from "@/components/playground";
import { Button } from "@/registry/new-york/ui/button";
import {
  radiusOptions,
  themePresets,
  type RadiusOptionValue,
  type ThemePresetId,
} from "@/lib/theme-playground";
import { cn } from "@/lib/utils";

function ApplyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

/**
 * Says whether the strip is showing a preview or the theme the site is
 * actually wearing, so the two are never confused.
 */
function ThemeState({ applied }: { applied: boolean }) {
  return (
    <span
      data-theme-state={applied ? "applied" : "preview"}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium",
        applied
          ? "border-border bg-muted text-foreground"
          : "border-foreground/40 bg-background text-muted-foreground border-dashed",
      )}
    >
      {applied ? <PlaygroundCheckIcon /> : null}
      {applied ? "Applied to site" : "Preview only"}
    </span>
  );
}

export function ThemeControls({
  presetId,
  radius,
  copyValue,
  canApply,
  canReset,
  isApplied,
  onPresetChange,
  onRadiusChange,
  onApply,
  onReset,
}: {
  presetId: ThemePresetId;
  radius: RadiusOptionValue;
  copyValue: string;
  /** False while the selection already matches what the site is wearing. */
  canApply: boolean;
  /** False while there is nothing applied and nothing selected to undo. */
  canReset: boolean;
  isApplied: boolean;
  onPresetChange: (id: ThemePresetId) => void;
  onRadiusChange: (value: RadiusOptionValue) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  return (
    <PlaygroundOptionStrip
      label="Theme playground options"
      actions={
        <>
          <Button
            type="button"
            size="sm"
            aria-label="Apply theme to the site"
            disabled={!canApply}
            onClick={onApply}
            className="size-11 shrink-0 px-0 sm:size-8 sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3"
          >
            <ApplyIcon className="sm:hidden" />
            <span className="hidden sm:inline">Apply Theme</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-label="Reset to the default theme"
            disabled={!canReset}
            onClick={onReset}
            className="size-11 shrink-0 px-0 sm:size-8 sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3"
          >
            <ResetIcon className="sm:hidden" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <PlaygroundCopyCodeButton value={copyValue} title="Theme" />
        </>
      }
    >
      <PlaygroundOptionGroup label="Theme">
        {themePresets.map((preset) => {
          const selected = preset.id === presetId;

          return (
            <PlaygroundChip
              key={preset.id}
              selected={selected}
              aria-label={preset.label}
              className="size-8 justify-center gap-0 px-0 lg:h-8 lg:w-auto lg:gap-1.5 lg:px-2.5"
              onClick={() => onPresetChange(preset.id)}
            >
              <span
                aria-hidden="true"
                className="relative flex size-2.5 items-center justify-center rounded-full border border-black/10 text-[oklch(0.985_0_0)]"
                style={{ background: preset.swatch }}
              >
                {selected ? <PlaygroundCheckIcon /> : null}
              </span>
              <span className="hidden lg:inline">{preset.label}</span>
            </PlaygroundChip>
          );
        })}
      </PlaygroundOptionGroup>
      <div className="bg-border hidden h-6 w-px lg:block" aria-hidden="true" />
      <PlaygroundOptionGroup label="Radius">
        {radiusOptions.map((option) => (
          <PlaygroundChip
            key={option.value}
            selected={option.value === radius}
            onClick={() => onRadiusChange(option.value)}
          >
            {option.label}
          </PlaygroundChip>
        ))}
      </PlaygroundOptionGroup>
      <div className="bg-border hidden h-6 w-px lg:block" aria-hidden="true" />
      <ThemeState applied={isApplied} />
    </PlaygroundOptionStrip>
  );
}
