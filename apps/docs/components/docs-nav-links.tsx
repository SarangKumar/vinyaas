"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { docsNav } from "@/components/docs-nav";

export function DocsNavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Documentation">
      {docsNav.map((group) => (
        <div key={group.title} className="flex flex-col gap-2">
          <p className="px-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
            {group.title}
          </p>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const current = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={
                      current
                        ? "block rounded-md bg-gray-100 px-2 py-1.5 text-sm font-medium text-black"
                        : "block rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black"
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
