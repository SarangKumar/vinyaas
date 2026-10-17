"use client";

import type { ReactNode } from "react";

import {
  ComponentDemo,
  type ControlDef,
  type ControlValues,
} from "@/components/component-demo";
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

export function PageSizeDataTableDemo() {
  return (
    <DataTable
      columns={projectColumns.slice(0, 3)}
      data={projects}
      pagination={3}
      pageSizeOptions={[3, 5, 10]}
      className="w-full max-w-2xl text-left"
    />
  );
}

/* ── Interactive demo (used with the Customize panel) ─────────────────────── */

const dataTableControls: ControlDef[] = [
  {
    key: "pageSize",
    label: "Rows Per Page",
    type: "range",
    default: 3,
    min: 1,
    max: 6,
  },
  {
    key: "pageSizeOptions",
    label: "Row Choices",
    type: "select",
    default: "3,5,10",
    options: [
      { value: "none", label: "None" },
      { value: "3,5,10", label: "3 · 5 · 10" },
      { value: "2,4,6", label: "2 · 4 · 6" },
      { value: "5,10,20", label: "5 · 10 · 20" },
    ],
  },
  {
    key: "pageSizeLabel",
    label: "Choices Label",
    type: "text",
    default: "Rows per page",
    when: (values) => values.pageSizeOptions !== "none",
  },
  { key: "searchable", label: "Searchable", type: "toggle", default: false },
  { key: "selectable", label: "Selectable", type: "toggle", default: false },
  {
    key: "columnVisibility",
    label: "Column Visibility",
    type: "toggle",
    default: false,
  },
  { key: "loading", label: "Loading", type: "toggle", default: false },
];

function parsePageSizeOptions(value: string): number[] | undefined {
  if (value === "none") {
    return undefined;
  }

  return value.split(",").map(Number);
}

function DataTableInteractivePreview(values: ControlValues) {
  return (
    <DataTable
      columns={projectColumns.slice(0, 3)}
      data={projects}
      pagination={values.pageSize as number}
      pageSizeOptions={parsePageSizeOptions(values.pageSizeOptions as string)}
      pageSizeLabel={values.pageSizeLabel as string}
      searchable={values.searchable as boolean}
      selectable={values.selectable as boolean}
      columnVisibility={values.columnVisibility as boolean}
      loading={values.loading as boolean}
      className="w-full max-w-2xl text-left"
    />
  );
}

function dataTableCode(values: ControlValues): string {
  const options = parsePageSizeOptions(values.pageSizeOptions as string);
  const props = [
    `  columns={columns}`,
    `  data={projects}`,
    `  pagination={${values.pageSize}}`,
    options ? `  pageSizeOptions={[${options.join(", ")}]}` : null,
    options && values.pageSizeLabel !== "Rows per page"
      ? `  pageSizeLabel="${values.pageSizeLabel}"`
      : null,
    values.searchable ? `  searchable` : null,
    values.selectable ? `  selectable` : null,
    values.columnVisibility ? `  columnVisibility` : null,
    values.loading ? `  loading` : null,
  ].filter(Boolean);

  return `import { DataTable } from "@/components/ui/data-table";

<DataTable
${props.join("\n")}
/>`;
}

/** Keeps the controls and the snippet generator on the client. */
export function DataTableInteractiveSection() {
  return (
    <ComponentDemo
      preview={DataTableInteractivePreview}
      code={dataTableCode}
      controls={dataTableControls}
    />
  );
}
