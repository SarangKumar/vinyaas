import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vinyaas — composable components installed as source";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Approximate OKLCH theme tokens for the OG rasterizer (no CSS vars). */
const theme = {
  background: "#1c1917",
  foreground: "#fafafa",
  primary: "#e4e4e7",
  muted: "#a1a1aa",
  subtle: "#71717a",
} as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: theme.background,
        color: theme.foreground,
        padding: "72px",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: theme.primary,
          }}
        />
        Vinyaas
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Build product UI from source components
        </div>
        <div
          style={{
            fontSize: 28,
            color: theme.muted,
            maxWidth: 760,
            lineHeight: 1.4,
          }}
        >
          A composable React design system for forms, payments, directories, and
          application screens.
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 22, color: theme.subtle }}>
        v1.0.0 · Install with the CLI
      </div>
    </div>,
    size,
  );
}
