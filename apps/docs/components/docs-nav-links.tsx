"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { docsNav } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { NewIndicator } from "@/components/new-indicator";

export function DocsNavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Documentation">
      {docsNav.map((group) => (
        <div key={group.title} className="flex flex-col gap-4">
          <p className="text-subtle-foreground px-2 text-xs font-medium tracking-wide uppercase">
            {group.title}
          </p>
          <ul className="flex flex-col gap-1.5">
            {group.items.map((item) => {
              const current = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    aria-label={item.isNew ? `${item.title}, new` : undefined}
                    className={
                      current
                        ? `bg-muted text-foreground flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm font-medium ${focusRing}`
                        : `text-sidebar-foreground hover:bg-muted hover:text-foreground flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm ${focusRing}`
                    }
                  >
                    {item.title}
                    {item.isNew ? <NewIndicator /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
