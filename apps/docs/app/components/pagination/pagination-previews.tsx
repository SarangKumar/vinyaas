"use client";

import { useState } from "react";
import type { ControlValues } from "@/components/component-demo";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/new-york/ui/pagination";

export function PaginationPreview({ values }: { values: ControlValues }) {
  const totalPages = 5;
  const [page, setPage] = useState(1);
  const isDisabled = values.disabled as boolean;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-muted-foreground text-xs">
        Page {page} of {totalPages}
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={isDisabled || page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            />
          </PaginationItem>
          {[1, 2, 3].map((item) => (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={page === item}
                disabled={isDisabled}
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
              isActive={page === totalPages}
              disabled={isDisabled}
              onClick={() => setPage(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              disabled={isDisabled || page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
