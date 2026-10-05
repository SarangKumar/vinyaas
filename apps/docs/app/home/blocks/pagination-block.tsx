"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/new-york/ui/pagination";

export function PaginationBlock() {
  const [page, setPage] = useState(2);
  const total = 10;

  return (
    <PlayBlock
      title="Pagination"
      description="Page through a long result set without leaving the list."
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">Results</p>
          <p className="text-muted-foreground text-xs tabular-nums">
            Page {page} of {total}
          </p>
        </div>
        <Pagination className="mx-0 w-full max-w-full justify-start overflow-x-auto">
          <PaginationContent className="flex-wrap">
            <PaginationItem>
              <PaginationPrevious
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={page === 2} onClick={() => setPage(2)}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={page === 3} onClick={() => setPage(3)}>
                3
              </PaginationLink>
            </PaginationItem>
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
                onClick={() =>
                  setPage((current) => Math.min(total, current + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </PlayBlock>
  );
}
