"use client";

import { useId, type SVGProps } from "react";

type VinyaasMarkProps = SVGProps<SVGSVGElement> & {
  /** Show soft periwinkle glow behind the diamond. */
  glow?: boolean;
  title?: string;
};

/**
 * Vinyaas brand mark — stacked chevrons forming a hollow diamond.
 * Matches the brand sheet geometry (not the wordmark).
 */
export function VinyaasMark({
  glow = true,
  title = "Vinyaas",
  className,
  ...props
}: VinyaasMarkProps) {
  const uid = useId().replace(/:/g, "");
  const glowId = `${uid}-glow`;
  const metalId = `${uid}-metal`;
  const metalSoftId = `${uid}-metal-soft`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <title>{title}</title>
      <defs>
        {glow ? (
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A7B3FF" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#A7B3FF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#A7B3FF" stopOpacity="0" />
          </radialGradient>
        ) : null}
        <linearGradient
          id={metalId}
          x1="16"
          y1="8"
          x2="48"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#B8BEC8" />
        </linearGradient>
        <linearGradient
          id={metalSoftId}
          x1="16"
          y1="56"
          x2="48"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F3F4F6" />
          <stop offset="55%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#9CA3AF" />
        </linearGradient>
      </defs>
      {glow ? <circle cx="32" cy="32" r="28" fill={`url(#${glowId})`} /> : null}
      <path
        d="M14 30.5 L32 12.5 L50 30.5"
        stroke={`url(#${metalId})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 33.5 L32 51.5 L50 33.5"
        stroke={`url(#${metalSoftId})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
