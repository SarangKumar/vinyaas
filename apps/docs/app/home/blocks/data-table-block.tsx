"use client";

import type { ReactNode } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  DataTable,
  type DataTableColumn,
} from "@/registry/new-york/ui/data-table";

type Project = {
  id: string;
  name: string;
  owner: string;
  status: "Active" | "Review" | "Draft";
};

function ActionIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const rows: Project[] = [
  { id: "1", name: "Vinyaas", owner: "Sarang", status: "Active" },
  { id: "2", name: "Dashboard", owner: "Priya", status: "Review" },
  { id: "3", name: "Mobile App", owner: "Aarav", status: "Draft" },
  { id: "4", name: "Marketing", owner: "Ananya", status: "Active" },
];

const columns: DataTableColumn<Project>[] = [
  {
    id: "name",
    header: "Project",
    accessorKey: "name",
    sortable: true,
    searchable: true,
    enableHiding: false,
    cell: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "owner",
    header: "Owner",
    accessorKey: "owner",
    searchable: true,
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: (row) => (
      <Badge variant={row.status === "Active" ? "secondary" : "outline"}>
        {row.status}
      </Badge>
    ),
  },
];

export function DataTableBlock() {
  return (
    <PlayBlock
      title="Data Table"
      description="Search, select, and page through a compact project list."
    >
      <DataTable
        columns={columns}
        data={rows}
        searchable
        searchPlaceholder="Search projects..."
        selectable
        pagination={3}
        renderRowActions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`View ${row.name}`}
            >
              <ActionIcon>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </ActionIcon>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${row.name}`}
            >
              <ActionIcon>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </ActionIcon>
            </Button>
          </div>
        )}
      />
    </PlayBlock>
  );
}
