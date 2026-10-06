"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/new-york/ui/pagination";

const invoices = [
  {
    id: "INV-2041",
    customer: "Northwind Labs",
    status: "Paid",
    amount: "$420",
  },
  { id: "INV-2042", customer: "Orbit Mail", status: "Open", amount: "$180" },
  { id: "INV-2043", customer: "Cedar Health", status: "Due", amount: "$960" },
  { id: "INV-2044", customer: "Maple Studio", status: "Paid", amount: "$240" },
] as const;

const pageSize = 2;

/**
 * Compact invoice strip with pagination — light composite, no chrome shells.
 */
export function PaginationBlock() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(invoices.length / pageSize);
  const rows = invoices.slice((page - 1) * pageSize, page * pageSize);

  return (
    <PlayBlock
      title="Invoices"
      description="Page through a short billing list."
    >
      <ul className="flex flex-col gap-2">
        {rows.map((invoice) => (
          <li
            key={invoice.id}
            className="border-border flex items-center justify-between gap-3 rounded-md border px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{invoice.id}</p>
              <p className="text-muted-foreground truncate text-xs">
                {invoice.customer}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="outline">{invoice.status}</Badge>
              <span className="text-sm tabular-nums">{invoice.amount}</span>
            </div>
          </li>
        ))}
      </ul>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size="icon"
              className="[&>span]:hidden"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => {
            const item = index + 1;
            return (
              <PaginationItem key={item}>
                <PaginationLink
                  isActive={page === item}
                  onClick={() => setPage(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              size="icon"
              className="[&>span]:hidden"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </PlayBlock>
  );
}
