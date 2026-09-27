"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { docsNav } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";

export function DocsNavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Documentation">
      {docsNav.map((group) => (
        <div key={group.title} className="flex flex-col gap-2">
          <p className="text-muted-foreground px-2 text-[11px] font-medium tracking-wide uppercase">
            {group.title}
          </p>
          <ul className="flex flex-col">
            {group.items.map((item) => {
              const current = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={
                      current
                        ? `bg-muted text-foreground block cursor-pointer rounded-md px-2 py-1 text-[13px] font-medium ${focusRing}`
                        : `text-muted-foreground hover:bg-muted hover:text-foreground block cursor-pointer rounded-md px-2 py-1 text-[13px] ${focusRing}`
                    }
                  >
                    {item.title}
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
