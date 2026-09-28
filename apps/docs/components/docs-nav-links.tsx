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
      {item.icon ? <NavIcon name={item.icon} /> : null}
      <span className="min-w-0 truncate">{item.title}</span>
      {item.isNew ? <NewIndicator /> : null}
    </Link>
  );
}

export function DocsNavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Documentation">
      {docsNav.map((group) => (
        <div key={group.title} className="flex flex-col gap-4">
          <p className="text-subtle-foreground px-2 text-xs font-medium tracking-wide uppercase">
            {group.title}
          </p>
          {group.sections ? (
            <div className="flex flex-col gap-4">
              {group.sections.map((section) => (
                <div key={section.title} className="flex flex-col gap-1.5">
                  <p className="text-foreground flex items-center gap-2 px-2 text-sm font-medium">
                    <NavIcon name={section.icon} />
                    {section.title}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          item={item}
                          current={pathname === item.href.split("#")[0]}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {group.items?.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    current={
                      pathname === item.href.split("#")[0] &&
                      !item.href.includes("#")
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}
