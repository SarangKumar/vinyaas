"use client";

import { useState } from "react";

import { Badge } from "@/registry/new-york/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/new-york/ui/pagination";

export function BasicPaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#page-0" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#page-2" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function LongRangePaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#page-2" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-3" isActive>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-10">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#page-4" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function DashboardPaginationDemo() {
  const [page, setPage] = useState(1);
  const total = 8;

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Invoices</p>
          <p className="text-muted-foreground text-xs">
            Showing page {page} of {total}
          </p>
        </div>
        <Badge variant="secondary">
          {(page - 1) * 10 + 1}–{page * 10}
        </Badge>
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

const galleryItems = [
  {
    id: "trail-1",
    title: "Speedcross 6",
    meta: "Trail · $140",
    tone: "bg-secondary/80",
  },
  {
    id: "trail-2",
    title: "Ghost 16",
    meta: "Road · $140",
    tone: "bg-muted",
  },
  {
    id: "trail-3",
    title: "Lone Peak 8",
    meta: "Trail · $155",
    tone: "bg-secondary/60",
  },
  {
    id: "trail-4",
    title: "Aero Glide 2",
    meta: "Road · $160",
    tone: "bg-muted/80",
  },
  {
    id: "trail-5",
    title: "Cascadia 18",
    meta: "Trail · $150",
    tone: "bg-secondary/70",
  },
  {
    id: "trail-6",
    title: "Pegasus 41",
    meta: "Road · $130",
    tone: "bg-muted/70",
  },
] as const;

export function GalleryPaginationDemo() {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(galleryItems.length / pageSize);
  const items = galleryItems.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="border-border bg-card overflow-hidden rounded-xl border"
          >
            <div className={`${item.tone} aspect-[4/3] w-full`} />
            <div className="flex flex-col gap-0.5 p-3">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="text-muted-foreground text-xs">{item.meta}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-xs">
          Page {page} of {totalPages}
        </p>
        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
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
    </div>
  );
}
