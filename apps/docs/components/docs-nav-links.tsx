"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { docsNav, type DocsNavItem } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";

function NavIndicator({ kind }: { kind: "beta" | "new" }) {
  const label = kind === "beta" ? "Beta" : "New";

  return (
    <span
      data-nav-indicator={kind}
      className="bg-foreground/70 size-1.5 shrink-0 rounded-full"
      aria-label={label}
      title={label}
    />
  );
}

function NavLink({
  item,
  current,
  density,
}: {
  item: DocsNavItem;
  current: boolean;
  density: "default" | "comfortable";
}) {
  const comfortable = density === "comfortable";
  const base = comfortable
    ? "flex min-h-12 cursor-pointer items-center gap-2 rounded-md px-3 py-3 text-base"
    : "flex min-h-8 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-[0.75rem] leading-[1.3125rem]";

  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={
        current
          ? `bg-muted text-foreground font-medium ${base} ${focusRing}`
          : `text-foreground hover:bg-muted hover:text-foreground ${base} ${focusRing}`
      }
    >
      <span className="min-w-0 truncate">{item.title}</span>
      {item.indicator ? <NavIndicator kind={item.indicator} /> : null}
    </Link>
  );
}

function isCurrent(pathname: string, href: string) {
  const path = href.split("#")[0] ?? href;

  return pathname === path && !href.includes("#");
}

export function DocsNavLinks({
  className,
  density = "default",
}: {
  className?: string;
  /** Larger type + tap targets for the mobile navigation sheet. */
  density?: "default" | "comfortable";
}) {
  const pathname = usePathname();
  const comfortable = density === "comfortable";

  return (
    <nav className={className} aria-label="Documentation">
      {docsNav.map((group) => (
        <div
          key={group.title}
          className={
            group.layout === "names"
              ? "@container flex flex-col gap-1"
              : comfortable
                ? "flex flex-col gap-1.5"
                : "flex flex-col gap-1"
          }
        >
          {group.label ? (
            <p
              className={
                comfortable
                  ? "text-muted-foreground px-3 pt-1 pb-2 text-sm font-semibold tracking-[0.12em] uppercase"
                  : "text-muted-foreground px-2 pt-2 pb-1 text-xs font-semibold"
              }
            >
              {group.title}
            </p>
          ) : null}
          <ul
            className={
              group.layout === "names"
                ? comfortable
                  ? "grid grid-cols-1 gap-1"
                  : "grid grid-cols-1 gap-0.5 @[22rem]:grid-cols-2 @[40rem]:grid-cols-3"
                : comfortable
                  ? "flex flex-col gap-1"
                  : "flex flex-col gap-0.5"
            }
          >
            {group.items.map((item) => (
              <li
                key={`${group.title}-${item.href}`}
                className={
                  group.label ? (comfortable ? "pl-1" : "pl-2") : undefined
                }
              >
                <NavLink
                  item={item}
                  current={isCurrent(pathname, item.href)}
                  density={density}
                />
                {item.children && item.children.length > 0 ? (
                  <ul
                    className={
                      comfortable
                        ? "border-border mt-1 ml-3 flex flex-col gap-1 border-l pl-3"
                        : "border-border mt-0.5 ml-2 flex flex-col gap-0.5 border-l pl-2"
                    }
                  >
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavLink
                          item={child}
                          current={isCurrent(pathname, child.href)}
                          density={density}
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
