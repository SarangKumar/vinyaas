"use client";

import type { ReactNode } from "react";

import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  DataTable,
  type DataTableColumn,
} from "@/registry/new-york/ui/data-table";

export type Project = {
  id: string;
  name: string;
  owner: string;
  status: "Active" | "Review" | "Complete" | "Draft";
  updated: string;
};

export const projects: Project[] = [
  {
    id: "1",
    name: "Vinyaas",
    owner: "Sarang",
    status: "Active",
    updated: "2m ago",
  },
  {
    id: "2",
    name: "Dashboard",
    owner: "Priya",
    status: "Review",
    updated: "1h ago",
  },
  {
    id: "3",
    name: "Mobile App",
    owner: "Aarav",
    status: "Complete",
    updated: "2d ago",
  },
  {
    id: "4",
    name: "Marketing",
    owner: "Ananya",
    status: "Draft",
    updated: "4d ago",
  },
  {
    id: "5",
    name: "Analytics",
    owner: "Sarang",
    status: "Active",
    updated: "5d ago",
  },
  {
    id: "6",
    name: "Billing",
    owner: "Priya",
    status: "Draft",
    updated: "1w ago",
  },
  {
    id: "7",
    name: "Onboarding",
    owner: "Aarav",
    status: "Review",
    updated: "1w ago",
  },
  {
    id: "8",
    name: "Docs Site",
    owner: "Ananya",
    status: "Active",
    updated: "2w ago",
  },
];

function statusVariant(
  status: Project["status"],
): "secondary" | "outline" | "default" {
  if (status === "Active") {
    return "secondary";
  }

  if (status === "Complete") {
    return "default";
  }

  return "outline";
}

export const projectColumns: DataTableColumn<Project>[] = [
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
    sortable: true,
    searchable: true,
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    searchable: true,
    cell: (row) => (
      <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
    ),
  },
  {
    id: "updated",
    header: "Updated",
    accessorKey: "updated",
    sortable: true,
  },
];

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

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`View ${project.name}`}
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
        aria-label={`Edit ${project.name}`}
      >
        <ActionIcon>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </ActionIcon>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${project.name}`}
        className="text-destructive hover:text-destructive"
      >
        <ActionIcon>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
        </ActionIcon>
      </Button>
    </div>
  );
}

export function ProjectsDataTableDemo() {
  return (
    <DataTable
      columns={projectColumns}
      data={projects}
      searchable
      searchPlaceholder="Search projects..."
      selectable
      columnVisibility
      pagination={4}
      renderRowActions={(row) => <ProjectActions project={row} />}
      className="w-full max-w-3xl text-left"
    />
  );
}

export function BasicDataTableDemo() {
  return (
    <DataTable
      columns={projectColumns.slice(0, 3)}
      data={projects.slice(0, 3)}
      className="w-full max-w-2xl text-left"
    />
  );
}

export function SortingDataTableDemo() {
  return (
    <DataTable
      columns={projectColumns.slice(0, 3)}
      data={projects.slice(0, 4)}
      className="w-full max-w-2xl text-left"
    />
  );
}

export function SelectionDataTableDemo() {
  return (
    <DataTable
      columns={projectColumns.slice(0, 3)}
      data={projects.slice(0, 4)}
      selectable
      className="w-full max-w-2xl text-left"
    />
  );
}

export function SearchDataTableDemo() {
  return (
    <DataTable
      columns={projectColumns.slice(0, 3)}
      data={projects}
      searchable
      searchPlaceholder="Search projects..."
      className="w-full max-w-2xl text-left"
    />
  );
}

export function LoadingDataTableDemo() {
  return (
    <DataTable
      columns={projectColumns.slice(0, 3)}
      data={projects}
      loading
      className="w-full max-w-2xl text-left"
    />
  );
}

export function EmptyDataTableDemo() {
  return (
    <DataTable
      columns={projectColumns.slice(0, 3)}
      data={[]}
      searchable
      searchPlaceholder="Search projects..."
      emptyMessage="No results found."
      className="w-full max-w-2xl text-left"
    />
  );
}
