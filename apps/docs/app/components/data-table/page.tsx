import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  BasicDataTableDemo,
  EmptyDataTableDemo,
  LoadingDataTableDemo,
  ProjectsDataTableDemo,
  SearchDataTableDemo,
  SelectionDataTableDemo,
  SortingDataTableDemo,
} from "./data-table-demos";

export const metadata: Metadata = componentPageMetadata("data-table");

const usage = `import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

type Project = {
  id: string;
  name: string;
  owner: string;
  status: string;
};

const columns: DataTableColumn<Project>[] = [
  {
    id: "name",
    header: "Project",
    accessorKey: "name",
    sortable: true,
    searchable: true,
    enableHiding: false,
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
  },
];

export function ProjectsTable({ data }: { data: Project[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchable
      searchPlaceholder="Search projects..."
      selectable
      columnVisibility
      pagination={5}
    />
  );
}
`;

const inPracticeCode = `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
// Bring your own icons (lucide-react's Eye, Pencil, and Trash2 work well).
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";

type Project = {
  id: string;
  name: string;
  owner: string;
  status: "Active" | "Review" | "Complete" | "Draft";
  updated: string;
};

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
    sortable: true,
    searchable: true,
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: (row) => <Badge>{row.status}</Badge>,
  },
  {
    id: "updated",
    header: "Updated",
    accessorKey: "updated",
    sortable: true,
  },
];

export function ProjectsBoard({ data }: { data: Project[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchable
      searchPlaceholder="Search projects..."
      selectable
      columnVisibility
      pagination={4}
      renderRowActions={(row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" aria-label={\`View \${row.name}\`}>
            <EyeIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={\`Edit \${row.name}\`}>
            <PencilIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={\`Delete \${row.name}\`}>
            <TrashIcon />
          </Button>
        </div>
      )}
    />
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "columns",
    type: "DataTableColumn<T>[]",
    description: "Column definitions for headers, cells, sorting, and search.",
  },
  {
    prop: "data",
    type: "T[]",
    description: "Row data rendered by the table.",
  },
  {
    prop: "getRowId",
    type: "(row: T, index: number) => string",
    description: "Stable row id. Defaults to row.id when present.",
  },
  {
    prop: "searchable",
    type: "boolean",
    defaultValue: "false",
    description: "Shows a search field over searchable columns.",
  },
  {
    prop: "searchPlaceholder",
    type: "string",
    defaultValue: '"Search…"',
    description: "Placeholder and accessible name for the search field.",
  },
  {
    prop: "selectable",
    type: "boolean",
    defaultValue: "false",
    description: "Adds row checkboxes and a select-all control.",
  },
  {
    prop: "pagination",
    type: "boolean | number",
    defaultValue: "false",
    description: "Client-side pagination. A number sets the page size.",
  },
  {
    prop: "actionsWidth",
    type: "string | number",
    defaultValue: '"7rem"',
    description: "Width of the trailing actions column.",
  },
  {
    prop: "columns[].width",
    type: "string | number",
    description:
      "Column width. The table uses a fixed layout, so sorting, paging, and search never resize columns. Columns without a width share the remaining space.",
  },
  {
    prop: "columnVisibility",
    type: "boolean",
    defaultValue: "false",
    description: "Shows a Columns menu to hide and show columns.",
  },
  {
    prop: "loading",
    type: "boolean",
    defaultValue: "false",
    description: "Renders skeleton rows instead of data.",
  },
  {
    prop: "emptyMessage",
    type: "string",
    defaultValue: '"No results found."',
    description: "Copy shown when there are no rows to display.",
  },
  {
    prop: "renderRowActions",
    type: "(row: T) => ReactNode",
    description: "Optional trailing actions column renderer.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Columns and rows from a typed dataset.",
    preview: <BasicDataTableDemo />,
    code: `import { DataTable } from "@/components/ui/data-table";

<DataTable columns={columns} data={data} />
`,
  },
  {
    id: "sorting",
    title: "Sorting",
    description:
      "Click a sortable header to cycle ascending, descending, and unsorted. The sort icon has a fixed size and the table layout is fixed, so columns keep their width while the order changes.",
    preview: <SortingDataTableDemo />,
    code: `{
  id: "name",
  header: "Project",
  accessorKey: "name",
  sortable: true,
}
`,
  },
  {
    id: "selection",
    title: "Selection",
    description:
      "Select rows individually or use the header checkbox for the visible page.",
    preview: <SelectionDataTableDemo />,
    code: `<DataTable columns={columns} data={data} selectable />
`,
  },
  {
    id: "search",
    title: "Search",
    description: "Filter rows across columns marked searchable.",
    preview: <SearchDataTableDemo />,
    code: `<DataTable
  columns={columns}
  data={data}
  searchable
  searchPlaceholder="Search projects..."
/>
`,
  },
  {
    id: "loading",
    title: "Loading",
    description: "Skeleton rows while data is loading.",
    preview: <LoadingDataTableDemo />,
    code: `<DataTable columns={columns} data={data} loading />
`,
  },
  {
    id: "empty",
    title: "Empty",
    description: "A clear empty state when nothing matches.",
    preview: <EmptyDataTableDemo />,
    code: `<DataTable
  columns={columns}
  data={[]}
  emptyMessage="No results found."
/>
`,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A projects board with search, selection, column visibility, pagination, status badges, and row actions.",
  preview: <ProjectsDataTableDemo />,
  code: { tsx: inPracticeCode, jsx: inPracticeCode },
};

export default async function DataTablePage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/data-table/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Data Table"
      description="A dashboard table with search, sorting, selection, and pagination."
      overview={
        <p>
          Data Table composes Table, Checkbox, Input, Dropdown Menu, Skeleton,
          and Pagination into a client-side data view. Mark columns as{" "}
          <code>sortable</code> or <code>searchable</code>, then opt into
          selection, visibility, and pagination as needed.
        </p>
      }
      install="vinyaas add data-table"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/data-table/index.tsx</code>. It depends on{" "}
          <code>table</code>, <code>pagination</code>, <code>checkbox</code>,{" "}
          <code>input</code>, <code>button</code>, <code>dropdown-menu</code>,
          and <code>skeleton</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            The table keeps semantic <code>table</code> markup. Sortable headers
            are buttons with <code>aria-sort</code> on the column header.
            Selection checkboxes include accessible names for individual rows
            and select-all, including the partial-selection state.
          </p>
          <ul className="list-disc pl-5">
            <li>Enter and Space activate sortable headers and row actions.</li>
            <li>Pagination reuses the accessible Pagination controls.</li>
            <li>Column visibility items are menuitem checkboxes.</li>
            <li>
              Loading and empty states do not leave orphaned interactive
              controls.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <ProjectsDataTableDemo />
    </ComponentReference>
  );
}
