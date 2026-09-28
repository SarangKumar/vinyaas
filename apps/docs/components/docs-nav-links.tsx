"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { docsNav, type DocsNavItem } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { NavIcon } from "@/components/icons";
import { NewIndicator } from "@/components/new-indicator";

function NavLink({ item, current }: { item: DocsNavItem; current: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      aria-label={item.isNew ? `${item.title}, new` : undefined}
      className={
        current
          ? `bg-muted text-foreground flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium ${focusRing}`
          : `text-sidebar-foreground hover:bg-muted hover:text-foreground flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm ${focusRing}`
      }
    >
      {item.icon ? (
        <NavIcon
          name={item.icon}
          className="text-muted-foreground size-3.5 shrink-0"
        />
      ) : null}
      <span className="min-w-0 truncate">{item.title}</span>
      {item.isNew ? <NewIndicator /> : null}
    </Link>
  );
}

function isCurrent(pathname: string, href: string) {
  const path = href.split("#")[0] ?? href;

  return pathname === path && !href.includes("#");
}

export function DocsNavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Documentation">
      {docsNav.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          {group.label ? (
            <p className="text-muted-foreground flex items-center gap-2 px-2 py-1 text-xs font-medium tracking-wide uppercase">
              {group.icon ? (
                <NavIcon
                  name={group.icon}
                  className="text-muted-foreground size-3.5 shrink-0"
                />
              ) : null}
              {group.title}
            </p>
          ) : null}
          <ul
            className={
              group.label ? "flex flex-col gap-0.5" : "flex flex-col gap-0.5"
            }
          >
            {group.items.map((item) => (
              <li key={item.href}>
                <NavLink item={item} current={isCurrent(pathname, item.href)} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
