"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  DataTable,
  type DataTableColumn,
} from "@/registry/new-york/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";

type Project = {
  id: string;
  name: string;
  owner: string;
  status: "Active" | "Review" | "Draft";
};

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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Actions for ${row.name}`}
              >
                ···
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </PlayBlock>
  );
}
