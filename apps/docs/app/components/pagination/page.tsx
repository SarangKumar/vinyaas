import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";

import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  BasicPaginationDemo,
  DashboardPaginationDemo,
  GalleryPaginationDemo,
  LongRangePaginationDemo,
} from "./pagination-demos";

export const metadata: Metadata = componentPageMetadata("pagination");

const usage = `import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function DocsPagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
`;

const basicCode = `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function BasicPagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="/docs?page=0" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/docs?page=1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/docs?page=2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/docs?page=3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="/docs?page=2" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
`;

const longRangeCode = `import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function LongRangePagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=2" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=3" isActive>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=10">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=4" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
`;

const dashboardCode = `"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function InvoicePagination() {
  const [page, setPage] = useState(1);
  const total = 8;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Invoices</p>
          <p className="text-muted-foreground text-xs">
            Showing page {page} of {total}
          </p>
        </div>
        <Badge variant="secondary">{(page - 1) * 10 + 1}–{page * 10}</Badge>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            />
          </PaginationItem>
          {[1, 2, 3].map((item) => (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={page === item}
                onClick={() => setPage(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              isActive={page === total}
              onClick={() => setPage(total)}
            >
              {total}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              disabled={page >= total}
              onClick={() => setPage((current) => Math.min(total, current + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
`;

const inPracticeCode = `"use client";

import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const items = [
  { id: "1", title: "Speedcross 6", meta: "Trail · $140" },
  { id: "2", title: "Ghost 16", meta: "Road · $140" },
  { id: "3", title: "Lone Peak 8", meta: "Trail · $155" },
  { id: "4", title: "Aero Glide 2", meta: "Road · $160" },
  { id: "5", title: "Cascadia 18", meta: "Trail · $150" },
  { id: "6", title: "Pegasus 41", meta: "Road · $130" },
];

export function ProductGallery() {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(items.length / pageSize);
  const visible = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {visible.map((item) => (
          <article key={item.id} className="rounded-xl border p-3">
            <div className="bg-muted mb-3 aspect-[4/3] rounded-lg" />
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-muted-foreground text-xs">{item.meta}</p>
          </article>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (item) => (
              <PaginationItem key={item}>
                <PaginationLink
                  isActive={page === item}
                  onClick={() => setPage(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "aria-label",
    type: "string",
    defaultValue: '"Pagination"',
    description:
      "Pagination: accessible name for the navigation landmark. Override when multiple paginations share a page.",
  },
  {
    prop: "href",
    type: "string",
    description:
      "PaginationLink / Previous / Next: render an anchor. Omit href to render a button for controlled apps.",
  },
  {
    prop: "isActive",
    type: "boolean",
    defaultValue: "false",
    description:
      'PaginationLink: marks the current page with aria-current="page" and the outline variant.',
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    description:
      "Previous / Next / Link: disables interaction. Buttons use the native disabled attribute; anchors keep href with aria-disabled, tabIndex={-1}, and prevented activation.",
  },
  {
    prop: "size",
    type: "Button size tokens",
    defaultValue: "icon (Link) / default (Previous, Next)",
    description: "Uses the shared Button size scale via buttonVariants.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the part with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "A short page sequence with previous and next links.",
    preview: <BasicPaginationDemo />,
    code: basicCode,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "Controlled pagination for an application list. Omit href and manage page state yourself.",
    preview: <DashboardPaginationDemo />,
    code: dashboardCode,
  },
  {
    id: "long-range",
    title: "Long range",
    description: "Use ellipsis when the full page range would overflow.",
    preview: <LongRangePaginationDemo />,
    code: longRangeCode,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "Compose Pagination under a product gallery. Keep page state in the parent — this primitive only provides structure and styling.",
  preview: <GalleryPaginationDemo />,
  code: inPracticeCode,
};

export default async function PaginationPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/pagination/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Pagination"
      description="Composable page navigation with previous, next, page links, and ellipsis."
      overview={
        <>
          <p>
            Pagination is a UI primitive for paging lists and tables. It
            provides accessible structure and Button-aligned styling — not a
            page-state engine. Pass <code>href</code> for link-based navigation,
            or omit it and handle <code>onClick</code> in your application.
          </p>
          <p>
            On narrow viewports, Previous and Next keep an accessible name while
            the visible label collapses to an icon so controls stay usable
            without horizontal overflow. Pair with galleries, lists, or tables;
            leave Data Table for a later release.
          </p>
          <p>
            Install with <code>vinyaas add pagination</code> or via{" "}
            <code>vinyaas add --catalog dashboard</code> /{" "}
            <code>--catalog navigation</code>.
          </p>
        </>
      }
      install="vinyaas add pagination"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/pagination/index.tsx</code>. It imports{" "}
          <code>buttonVariants</code> from <code>@/components/ui/button</code>{" "}
          and <code>cn</code> from <code>@/lib/utils</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The root renders <code>nav</code> with{" "}
            <code>aria-label=&quot;Pagination&quot;</code>. The active page sets{" "}
            <code>aria-current=&quot;page&quot;</code>. Previous and Next expose
            explicit labels (<code>Go to previous page</code> /{" "}
            <code>Go to next page</code>); chevrons are decorative.
          </p>
          <p>
            Disabled controls are not activatable. Focus uses the shared Button
            focus-visible ring. Tab order follows document order — there is no
            focus trap.
          </p>
        </>
      }
      source={source}
    >
      <BasicPaginationDemo />
    </ComponentReference>
  );
}
