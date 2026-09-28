import type { ReactElement } from "react";
import { ImageResponse } from "next/og";

import { type ComponentMeta, components } from "@/components/component-meta";

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";

/** Raster-safe approximations of the dark docs theme (OG has no CSS vars). */
export const ogTheme = {
  background: "#09090b",
  foreground: "#fafafa",
  muted: "#a1a1aa",
  subtle: "#71717a",
  border: "#27272a",
  card: "#18181b",
  primary: "#fafafa",
  primaryForeground: "#09090b",
} as const;

export const siteOgImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Vinyaas — composable React components installed as source",
} as const;

export function componentOgPath(slug: string) {
  return `/og/component/${slug}`;
}

export function findComponent(slug: string): ComponentMeta | undefined {
  return components.find((item) => item.slug === slug);
}

export function componentOgImage(component: ComponentMeta): ImageResponse {
  return new ImageResponse(componentOgElement(component), {
    ...ogSize,
  });
}

function componentOgElement(component: ComponentMeta): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: ogTheme.background,
        color: ogTheme.foreground,
        padding: "64px 72px",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: ogTheme.primary,
            }}
          />
          Vinyaas
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${ogTheme.border}`,
            background: ogTheme.card,
            borderRadius: 999,
            padding: "8px 16px",
            fontSize: 18,
            color: ogTheme.muted,
            textTransform: "capitalize",
          }}
        >
          {component.category}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 980,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: ogTheme.subtle,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Component
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          {component.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: ogTheme.muted,
            lineHeight: 1.35,
            maxWidth: 860,
          }}
        >
          {component.description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${ogTheme.border}`,
            background: ogTheme.card,
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 22,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            color: ogTheme.foreground,
          }}
        >
          vinyaas add {component.slug}
        </div>
        <div style={{ display: "flex", fontSize: 20, color: ogTheme.subtle }}>
          vinyaas.vercel.app
        </div>
      </div>
    </div>
  );
}
