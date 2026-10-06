"use client";

import {
  PlaygroundCheckIcon,
  PlaygroundChip,
  PlaygroundCopyCodeButton,
  PlaygroundOptionGroup,
  PlaygroundOptionStrip,
} from "@/components/playground";
import {
  radiusOptions,
  themePresets,
  type RadiusOptionValue,
  type ThemePresetId,
} from "@/lib/theme-playground";

export function ThemeControls({
  presetId,
  radius,
  copyValue,
  onPresetChange,
  onRadiusChange,
}: {
  presetId: ThemePresetId;
  radius: RadiusOptionValue;
  copyValue: string;
  onPresetChange: (id: ThemePresetId) => void;
  onRadiusChange: (value: RadiusOptionValue) => void;
}) {
  return (
    <PlaygroundOptionStrip
      label="Theme playground options"
      actions={<PlaygroundCopyCodeButton value={copyValue} title="Theme" />}
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
    </PlaygroundOptionStrip>
  );
}
