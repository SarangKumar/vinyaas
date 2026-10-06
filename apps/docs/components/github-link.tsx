"use client";

import { useEffect, useState } from "react";

import { githubUrl } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";

export function githubRepoApiUrl(repositoryUrl: string) {
  const match = repositoryUrl.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/,
  );

  if (!match) {
    return null;
  }

  const repo = match[2]?.replace(/\.git$/, "");

  return `https://api.github.com/repos/${match[1]}/${repo}`;
}

/** @deprecated Prefer githubRepoApiUrl — kept for existing imports/tests. */
export function githubStarsUrl(repositoryUrl: string) {
  return githubRepoApiUrl(repositoryUrl);
}

/** Compact star count for UI (12 → "12", 2400 → "2.4k"). */
export function formatStarCount(count: number) {
  if (!Number.isFinite(count) || count < 0) {
    return "0";
  }

  if (count < 1000) {
    return String(Math.round(count));
  }

  const value = count / 1000;
  const rounded = value >= 10 ? value.toFixed(0) : value.toFixed(1);

  return `${rounded.replace(/\.0$/, "")}k`;
}

type GitHubLinkProps = {
  /**
   * `default` — desktop navbar icon + count
   * `compact` — mobile navbar (large touch target; count from ~360px)
   * `mobile` — sheet footer with “View on GitHub”
   */
  variant?: "default" | "compact" | "mobile";
};

export function GitHubLink({ variant = "default" }: GitHubLinkProps) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const endpoint = githubRepoApiUrl(githubUrl);

    if (!endpoint || typeof fetch !== "function") {
      return;
    }

    const controller = new AbortController();
    let ignore = false;

    fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { stargazers_count?: unknown } | null) => {
        if (ignore || typeof data?.stargazers_count !== "number") {
          return;
        }

        setStars(data.stargazers_count);
      })
      .catch(() => {});

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  if (variant === "mobile") {
    const label =
      stars !== null ? `GitHub, ${formatStarCount(stars)} stars` : "GitHub";

    return (
      <a
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        title="GitHub"
        data-github-link="mobile"
        className={`text-sidebar-foreground hover:bg-muted hover:text-foreground flex min-h-14 w-full flex-col justify-center gap-1 rounded-md px-3 py-1 text-left ${focusRing}`}
      >
        <span className="text-muted-foreground flex items-center gap-2 text-sm">
          <GitHubIcon className="size-5" />
          View on GitHub
        </span>
      </a>
    );
  }

  if (variant === "compact") {
    const label =
      stars !== null ? `GitHub, ${formatStarCount(stars)} stars` : "GitHub";

    return (
      <a
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        title="GitHub"
        data-github-link="compact"
        className={`text-sidebar-foreground hover:bg-muted hover:text-foreground inline-flex h-12 min-w-12 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 ${focusRing}`}
      >
        <GitHubIcon className="size-5" />
        {stars !== null ? (
          <span
            aria-hidden="true"
            className="hidden text-sm tabular-nums min-[360px]:inline"
          >
            {formatStarCount(stars)}
          </span>
        ) : null}
      </a>
    );
  }

  return (
    <a
      href={githubUrl}
      aria-label="GitHub"
      title="GitHub"
      data-github-link="default"
      className={`text-sidebar-foreground hover:text-foreground inline-flex h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-sm ${focusRing}`}
    >
      <GitHubIcon className="size-4" />
      {stars !== null ? (
        <span aria-hidden="true" className="tabular-nums">
          {stars}
        </span>
      ) : null}
    </a>
  );
}

function GitHubIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
    </svg>
  );
}

function StarIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      fill="currentColor"
    >
      <path d="M12 3.2 14.5 9l6.3.5-4.8 4.1 1.5 6.1L12 16.7 6.5 19.7l1.5-6.1L3.2 9.5 9.5 9 12 3.2Z" />
    </svg>
  );
}
