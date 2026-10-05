"use client";

import {
  PlaygroundCopyCodeButton,
  PlaygroundOptionStrip,
  playgroundDenseChromeInlineClassName,
  playgroundDenseChromeShowClassName,
} from "@/components/playground";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york/ui/drawer";
import { Label } from "@/registry/new-york/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";

import {
  bodyFonts,
  flowOptions,
  headingFonts,
  leadingOptions,
  measureOptions,
  monoFonts,
  sizeOptions,
  type TypesetConfig,
  type TypesetFlow,
  type TypesetLeading,
  type TypesetMeasure,
  type TypesetSize,
} from "./typeset-config";

function Field({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-1 sm:w-auto sm:min-w-[8.5rem]">
      <Label
        htmlFor={id}
        className="text-muted-foreground text-[0.65rem] uppercase"
      >
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TypesetFields({
  config,
  onChange,
  idPrefix = "",
}: {
  config: TypesetConfig;
  onChange: (next: TypesetConfig) => void;
  idPrefix?: string;
}) {
  return (
    <>
      <Field
        id={`${idPrefix}typeset-measure`}
        label="Measure"
        value={config.measure}
        onChange={(value) =>
          onChange({ ...config, measure: value as TypesetMeasure })
        }
        options={measureOptions.map((value) => ({ label: value, value }))}
      />
      <Field
        id={`${idPrefix}typeset-heading`}
        label="Heading"
        value={config.heading}
        onChange={(value) => onChange({ ...config, heading: value })}
        options={headingFonts.map((font) => ({
          label: font.label,
          value: font.value,
        }))}
      />
      <Field
        id={`${idPrefix}typeset-body`}
        label="Body"
        value={config.body}
        onChange={(value) => onChange({ ...config, body: value })}
        options={bodyFonts.map((font) => ({
          label: font.label,
          value: font.value,
        }))}
      />
      <Field
        id={`${idPrefix}typeset-mono`}
        label="Mono"
        value={config.mono}
        onChange={(value) => onChange({ ...config, mono: value })}
        options={monoFonts.map((font) => ({
          label: font.label,
          value: font.value,
        }))}
      />
      <Field
        id={`${idPrefix}typeset-size`}
        label="Size"
        value={config.size}
        onChange={(value) =>
          onChange({ ...config, size: value as TypesetSize })
        }
        options={sizeOptions}
      />
      <Field
        id={`${idPrefix}typeset-leading`}
        label="Leading"
        value={config.leading}
        onChange={(value) =>
          onChange({ ...config, leading: value as TypesetLeading })
        }
        options={leadingOptions}
      />
      <Field
        id={`${idPrefix}typeset-flow`}
        label="Flow"
        value={config.flow}
        onChange={(value) =>
          onChange({ ...config, flow: value as TypesetFlow })
        }
        options={flowOptions}
      />
    </>
  );
}

export function TypesetControls({
  config,
  copyValue,
  onChange,
  onShuffle,
}: {
  config: TypesetConfig;
  copyValue: string;
  onChange: (next: TypesetConfig) => void;
  onShuffle: () => void;
}) {
  return (
    <PlaygroundOptionStrip
      label="Typeset playground options"
      actions={
        <>
          <Button type="button" size="sm" variant="outline" onClick={onShuffle}>
            Shuffle
          </Button>
          <PlaygroundCopyCodeButton value={copyValue} title="Typeset" />
        </>
      }
    >
      <Drawer>
        <DrawerTrigger>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={playgroundDenseChromeShowClassName}
          >
            Options
          </Button>
        </DrawerTrigger>
        <DrawerContent
          side="bottom"
          className={cn("gap-0 p-0", playgroundDenseChromeShowClassName)}
        >
          <DrawerHeader className="border-border border-b px-5 py-4 text-left">
            <DrawerTitle>Typeset options</DrawerTitle>
            <DrawerDescription>
              Measure, fonts, size, leading, and flow for this playground.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid max-h-[min(28rem,55dvh)] gap-3 overflow-y-auto px-5 py-4">
            <TypesetFields
              config={config}
              onChange={onChange}
              idPrefix="drawer-"
            />
          </div>
          <DrawerFooter className="border-border border-t px-5 py-4">
            <DrawerClose>
              <Button type="button" className="w-full">
                Done
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <div className={playgroundDenseChromeInlineClassName}>
        <TypesetFields config={config} onChange={onChange} />
      </div>
    </PlaygroundOptionStrip>
  );
}
