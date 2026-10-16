"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CodeBlock } from "@/components/code-block";
import { type CodeLanguage, type DemoCode } from "@/components/code-languages";
import { cn } from "@/lib/utils";

// ─── Control types ────────────────────────────────────────────────────────────

export type ControlColor = {
  key: string;
  label: string;
  type: "color";
  default: string;
};
export type ControlText = {
  key: string;
  label: string;
  type: "text";
  default: string;
  placeholder?: string;
};
export type ControlLongText = {
  key: string;
  label: string;
  type: "longtext";
  default: string;
  placeholder?: string;
};
export type ControlRange = {
  key: string;
  label: string;
  type: "range";
  default: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
};
export type ControlToggle = {
  key: string;
  label: string;
  type: "toggle";
  default: boolean;
};
export type ControlSelect = {
  key: string;
  label: string;
  type: "select";
  default: string;
  options: { value: string; label: string }[];
};

export type ControlDef =
  | ControlColor
  | ControlText
  | ControlLongText
  | ControlRange
  | ControlToggle
  | ControlSelect;

export type ControlValues = Record<string, string | number | boolean>;

// ─── Icons ────────────────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CodeTagIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg
      width="12"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="10"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function RefreshIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

// Visible vertical pill holding a 6-dot grid — the drag-to-resize handle
function GripHandle({ dragging }: { dragging: boolean }) {
  return (
    <div
      className={cn(
        "flex h-16 w-2 items-center justify-center rounded-full transition-colors",
        dragging
          ? "bg-primary"
          : "bg-muted-foreground/35 group-hover:bg-muted-foreground/70",
      )}
    >
      <div className="grid grid-cols-2 gap-0.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "size-0.5 rounded-full transition-colors",
              dragging ? "bg-primary-foreground" : "bg-background",
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Sizing ───────────────────────────────────────────────────────────────────

const MIN_PREVIEW_WIDTH = 320;
/** Container width kept free so the edge-straddling drag handle stays visible. */
const GRIP_RESERVE = 0;

// ─── Screen presets ───────────────────────────────────────────────────────────

const SCREEN_PRESETS = [
  { id: "desktop", label: "Desktop", width: 1080, Icon: MonitorIcon },
  { id: "tablet", label: "Tablet", width: 768, Icon: TabletIcon },
  { id: "mobile", label: "Mobile", width: 375, Icon: PhoneIcon },
] as const;

// ─── Control cell (one pill surface per control in the customize grid) ───────

/** Evenly spaced, low-contrast tick marks drawn behind a range track. */
const TICK_BACKGROUND =
  "repeating-linear-gradient(to right, var(--muted-foreground) 0 1px, transparent 1px 10%)";

export function ControlCell({
  control,
  value,
  onChange,
}: {
  control: ControlDef;
  value: string | number | boolean;
  onChange: (v: string | number | boolean) => void;
}) {
  // One shared surface so every control type reads as the same object.
  const surface = cn(
    "bg-muted flex items-center gap-2.5 rounded-lg px-3 transition-colors",
    control.type === "longtext" ? "min-h-10 py-2" : "h-10",
  );
  const labelClass = "text-muted-foreground shrink-0 truncate text-xs";
  const readoutClass = "text-foreground shrink-0 text-xs tabular-nums";
  const fieldClass =
    "text-foreground min-w-0 flex-1 bg-transparent text-xs focus:outline-none";

  return (
    <div className={surface}>
      <span className={labelClass} title={control.label}>
        {control.label}
      </span>

      {control.type === "range" && (
        <>
          <div className="relative flex min-w-0 flex-1 items-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 opacity-35"
              style={{ backgroundImage: TICK_BACKGROUND }}
            />
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step ?? 1}
              value={value as number}
              onChange={(e) => onChange(e.target.valueAsNumber)}
              className="accent-primary relative w-full cursor-pointer"
            />
          </div>
          <span className={readoutClass}>
            {value as number}
            {control.unit ?? ""}
          </span>
        </>
      )}

      {control.type === "color" && (
        <>
          <span className="text-foreground ml-auto font-mono text-xs">
            {value as string}
          </span>
          {/* Relative wrapper so the invisible input sits exactly over the
              swatch — the OS color picker then opens near the button. */}
          <label className="relative shrink-0 cursor-pointer">
            <span
              className="border-border block size-5 rounded-md border"
              style={{ background: value as string }}
            />
            <input
              type="color"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </>
      )}

      {control.type === "toggle" && (
        <button
          type="button"
          role="switch"
          aria-checked={value as boolean}
          onClick={() => onChange(!(value as boolean))}
          className={cn(
            "focus-visible:ring-ring ml-auto inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none",
            value ? "bg-primary" : "bg-muted-foreground/30",
          )}
        >
          <span
            className={cn(
              "bg-background size-3.5 rounded-full transition-transform",
              value ? "translate-x-4.5" : "translate-x-0.5",
            )}
          />
        </button>
      )}

      {control.type === "select" && (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={cn(fieldClass, "cursor-pointer text-right")}
        >
          {control.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {control.type === "text" && (
        <input
          type="text"
          value={value as string}
          placeholder={control.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(fieldClass, "text-right")}
        />
      )}

      {control.type === "longtext" && (
        <textarea
          value={value as string}
          placeholder={control.placeholder}
          rows={2}
          onChange={(e) => onChange(e.target.value)}
          className={cn(fieldClass, "resize-none py-0.5")}
        />
      )}
    </div>
  );
}

// ─── Main ComponentDemo ───────────────────────────────────────────────────────

type Tab = "preview" | "code";

/**
 * One preview and its source.
 *
 * Toolbar (tabs + screen-size icons + Refresh) sits above the bordered box.
 * A drag grip on the right edge resizes the preview between 320 px and the
 * container width. A size label fades out after `sizeLabelDuration` ms.
 *
 * When `controls` is provided, an interactive Customize panel is rendered
 * below the box. `preview` and `code` can be render functions that receive
 * the current control values — the code panel updates in sync.
 */
export function ComponentDemo({
  preview,
  code,
  language = "tsx",
  controls,
  sizeLabelDuration = 2000,
}: {
  preview: ReactNode | ((values: ControlValues) => ReactNode);
  code: DemoCode | ((values: ControlValues) => DemoCode);
  language?: CodeLanguage;
  controls?: ControlDef[];
  sizeLabelDuration?: number;
}) {
  const hasControls = Array.isArray(controls) && controls.length > 0;

  // ── State ───────────────────────────────────────────────────────────────────
  const defaultValues = (): ControlValues =>
    controls ? Object.fromEntries(controls.map((c) => [c.key, c.default])) : {};

  const [values, setValues] = useState<ControlValues>(defaultValues);
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [screenPreset, setScreenPreset] = useState<number>(1080);
  const [previewWidth, setPreviewWidth] = useState<number>(1080);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeLabelVisible, setSizeLabelVisible] = useState(false);
  const [sizeLabelFading, setSizeLabelFading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // The handle straddles the frame's right edge, so the frame can never use the
  // full container width or the handle's outer half would sit out of bounds.
  const maxPreviewWidth = Math.max(
    MIN_PREVIEW_WIDTH,
    containerWidth - GRIP_RESERVE,
  );

  // ── Refs ────────────────────────────────────────────────────────────────────
  const outerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeOpacityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const durationRef = useRef(sizeLabelDuration);
  useEffect(() => {
    durationRef.current = sizeLabelDuration;
  }, [sizeLabelDuration]);

  // ── Container width tracking ────────────────────────────────────────────────
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setContainerWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Size-label helpers ──────────────────────────────────────────────────────
  function showSizeLabel() {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    if (fadeOpacityTimer.current) clearTimeout(fadeOpacityTimer.current);
    setSizeLabelVisible(true);
    setSizeLabelFading(false);
  }

  function scheduleFadeOut() {
    fadeTimer.current = setTimeout(() => {
      setSizeLabelFading(true);
      fadeOpacityTimer.current = setTimeout(
        () => setSizeLabelVisible(false),
        500,
      );
    }, durationRef.current);
  }

  // ── Drag-to-resize ──────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragStartX.current = e.clientX;
      dragStartWidth.current = previewWidth;
      setIsDragging(true);
      showSizeLabel();
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      if (fadeOpacityTimer.current) clearTimeout(fadeOpacityTimer.current);
    },
    [previewWidth],
  );

  useEffect(() => {
    if (!isDragging) return;

    function onMove(e: MouseEvent) {
      const next = Math.max(
        MIN_PREVIEW_WIDTH,
        Math.min(
          maxPreviewWidth,
          dragStartWidth.current + (e.clientX - dragStartX.current),
        ),
      );
      setPreviewWidth(next);
      setScreenPreset(-1);
    }

    function onUp() {
      setIsDragging(false);
      scheduleFadeOut();
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, maxPreviewWidth]);

  // ── Preset handler ──────────────────────────────────────────────────────────
  function handlePreset(width: number) {
    setScreenPreset(width);
    setPreviewWidth(Math.min(width, maxPreviewWidth));
    showSizeLabel();
    scheduleFadeOut();
  }

  // ── Derived values ──────────────────────────────────────────────────────────
  const resolvedPreview =
    typeof preview === "function" ? preview(values) : preview;
  const resolvedCode = typeof code === "function" ? code(values) : code;
  const effectiveWidth = Math.min(previewWidth, containerWidth);

  // Unique ID for the SVG grid pattern (avoids cross-instance conflicts)
  const gridId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  // Shared button style helpers
  const tabBtn = (active: boolean) =>
    cn(
      "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors select-none",
      active
        ? "border-border bg-muted text-foreground"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50",
    );
  const iconBtn = (active: boolean) =>
    cn(
      "flex items-center justify-center rounded-md border p-1.5 transition-colors",
      active
        ? "border-border bg-muted text-foreground"
        : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50",
    );

  return (
    <div
      className="flex flex-col gap-4"
      data-companion-surface=""
      data-companion-surface-id="component-demo"
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Left – view tabs */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={tabBtn(activeTab === "preview")}
          >
            <EyeIcon />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={tabBtn(activeTab === "code")}
          >
            <CodeTagIcon />
            Code
          </button>
        </div>

        {/* Right – screen-size icons + refresh */}
        <div className="flex items-center gap-1">
          {/* Grouped screen-size buttons — shared outer border, no inner gaps */}
          <div className="border-border divide-border flex items-center divide-x overflow-hidden rounded-md border">
            {SCREEN_PRESETS.map(({ id, label, width, Icon }) => (
              <button
                key={id}
                type="button"
                title={`${label} — ${width}px`}
                onClick={() => handlePreset(width)}
                className={cn(
                  "flex items-center justify-center p-1.5 transition-colors",
                  screenPreset === width
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <Icon />
              </button>
            ))}
          </div>
          <button
            type="button"
            title="Refresh preview"
            onClick={() => setRefreshKey((k) => k + 1)}
            className={iconBtn(false)}
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      {/* ── Content: box + resize grip ── */}
      <div ref={outerRef} className="relative flex items-stretch rounded-3xl">
        {/* Clipped background layer — grid + fill, clips to rounded corners.
            Kept separate so the grip handle can overflow freely. */}
        {activeTab === "preview" && (
          <div className="bg-muted/25 pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <svg aria-hidden="true" className="h-full w-full">
              <defs>
                <pattern
                  id={`grid-${gridId}`}
                  width="48"
                  height="48"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 48 0 L 0 0 0 48"
                    fill="none"
                    stroke="var(--muted-foreground)"
                    strokeOpacity="0.18"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${gridId})`} />
            </svg>
          </div>
        )}
        {/* Frame wrapper: sized to the preview width so the handle tracks it. */}
        <div
          style={
            activeTab === "preview"
              ? {
                  width: effectiveWidth,
                  minWidth: MIN_PREVIEW_WIDTH,
                  maxWidth: "100%",
                }
              : { width: "100%" }
          }
          className="relative z-10 min-w-0"
        >
          <div className="border-border bg-background overflow-hidden rounded-3xl border">
            {/* Preview */}
            {activeTab === "preview" && (
              <div className="relative">
                <div
                  key={refreshKey}
                  className="bg-background flex min-h-125 w-full items-center justify-center overflow-x-auto overflow-y-visible px-4 py-8 text-sm sm:px-6 sm:py-10"
                >
                  <div className="flex w-full max-w-full flex-col items-center justify-center overflow-visible p-1 **:data-[demo-align=start]:w-full **:data-[demo-align=start]:items-stretch **:data-[demo-align=start]:self-stretch">
                    {resolvedPreview}
                  </div>
                </div>

                {/* Size label */}
                {sizeLabelVisible && (
                  <div
                    className={cn(
                      "border-border bg-popover text-popover-foreground pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border px-2.5 py-0.5 text-xs tabular-nums shadow-sm",
                      "transition-opacity duration-500",
                      sizeLabelFading ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {effectiveWidth}px
                  </div>
                )}
              </div>
            )}

            {/* Code */}
            {activeTab === "code" &&
              (typeof resolvedCode === "string" ? (
                <CodeBlock attached code={resolvedCode} language={language} />
              ) : (
                <CodeBlock attached source={resolvedCode} />
              ))}
          </div>

          {/* Resize grip — straddles the frame's right edge and moves with it.
              The hit area is far wider than the visible pill. */}
          {activeTab === "preview" && (
            <div
              onMouseDown={handleDragStart}
              title="Drag to resize"
              className="group absolute top-1/2 right-0 z-20 flex h-20 w-6 translate-x-1/2 -translate-y-1/2 cursor-col-resize items-center justify-center select-none"
            >
              <GripHandle dragging={isDragging} />
            </div>
          )}
        </div>
      </div>

      {/* ── Customize section (below the box, always visible when controls present) ── */}
      {hasControls && (
        <div className="mt-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-foreground text-xl font-semibold tracking-tight">
              Customize
            </h3>
            <button
              type="button"
              onClick={() => setValues(defaultValues())}
              className="border-border bg-muted text-muted-foreground hover:text-foreground focus-visible:ring-ring flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <RefreshIcon size={12} />
              Reset
            </button>
          </div>

          {/* Outer border + 6px inset ring + darker inner surface */}
          <div className="border-border bg-muted rounded-3xl border p-1.5">
            <div className="bg-background rounded-[1.125rem] p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {controls.map((control) => (
                  <ControlCell
                    key={control.key}
                    control={control}
                    value={values[control.key]!}
                    onChange={(v) =>
                      setValues((prev) => ({ ...prev, [control.key]: v }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
