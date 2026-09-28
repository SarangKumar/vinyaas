"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { focusRing } from "@/components/focus-ring";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function TableOfContents() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const update = () => {
      const next = readHeadings();
      setItems((current) => (sameHeadings(current, next) ? current : next));
    };
    const frame = window.requestAnimationFrame(update);
    const timeout = window.setTimeout(update, 0);
    const observer = new MutationObserver(update);

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <nav aria-label="On this page" className="px-5 py-8">
      <p className="text-foreground text-sm font-medium">On this page</p>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-5" : undefined}>
            <a
              href={`#${item.id}`}
              className={`text-sidebar-foreground hover:text-foreground block rounded-md py-0.5 text-sm leading-6 ${focusRing}`}
              onClick={(event) => {
                scrollArticleTo(item.id, event);
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function sameHeadings(current: TocItem[], next: TocItem[]): boolean {
  return (
    current.length === next.length &&
    current.every(
      (item, index) =>
        item.id === next[index]?.id && item.level === next[index]?.level,
    )
  );
}

function readHeadings(): TocItem[] {
  const root = document.getElementById("docs-content");

  if (!root) {
    return [];
  }

  const used = new Set<string>();
  const next: TocItem[] = [];

  for (const heading of root.querySelectorAll("h2, h3")) {
    const text = heading.textContent?.trim() ?? "";

    if (!text) {
      continue;
    }

    const id = headingId(heading, text, used);
    used.add(id);
    next.push({
      id,
      text,
      level: heading.tagName === "H3" ? 3 : 2,
    });
  }

  return next;
}

function headingId(heading: Element, text: string, used: Set<string>): string {
  if (heading.id) {
    return heading.id;
  }

  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  let id = base || "section";
  let suffix = 2;

  while (used.has(id) || document.getElementById(id)) {
    id = `${base || "section"}-${suffix}`;
    suffix += 1;
  }

  heading.id = id;
  return id;
}

function scrollArticleTo(id: string, event: { preventDefault(): void }) {
  const scroller = document.getElementById("docs-content");
  const target = document.getElementById(id);

  if (!scroller || !target) {
    return;
  }

  event.preventDefault();
  const top =
    target.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop;
  scroller.scrollTo({ top: Math.max(0, top - 24), behavior: "auto" });
  window.history.pushState(null, "", `#${id}`);
}
