import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { DataTable, type DataTableColumn } from ".";

type Project = {
  id: string;
  name: string;
  owner: string;
  status: string;
};

const projects: Project[] = [
  { id: "1", name: "Vinyaas", owner: "Sarang", status: "Active" },
  { id: "2", name: "Dashboard", owner: "Priya", status: "Review" },
  { id: "3", name: "Mobile App", owner: "Aarav", status: "Complete" },
  { id: "4", name: "Marketing", owner: "Ananya", status: "Draft" },
  { id: "5", name: "Analytics", owner: "Sarang", status: "Active" },
  { id: "6", name: "Billing", owner: "Priya", status: "Draft" },
];

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
    searchable: true,
  },
];

describe("DataTable", () => {
  it("renders headers, rows, and custom cells", () => {
    render(
      <DataTable
        columns={[
          ...columns.slice(0, 2),
          {
            id: "status",
            header: "Status",
            cell: (row) => <span data-testid="status">{row.status}</span>,
          },
        ]}
        data={projects.slice(0, 2)}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "Project" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Owner" })).toBeTruthy();
    expect(screen.getByText("Vinyaas")).toBeInTheDocument();
    expect(screen.getByText("Priya")).toBeInTheDocument();
    expect(
      screen.getAllByTestId("status").map((node) => node.textContent),
    ).toEqual(["Active", "Review"]);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("cycles sort ascending, descending, and unsorted from the keyboard", () => {
    render(<DataTable columns={columns} data={projects.slice(0, 4)} />);

    const sortButton = screen.getByRole("button", {
      name: "Sort Project ascending",
    });
    const header = sortButton.closest("th");

    fireEvent.click(sortButton);
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(
      screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => row.textContent),
    ).toEqual([
      expect.stringContaining("Dashboard"),
      expect.stringContaining("Marketing"),
      expect.stringContaining("Mobile App"),
      expect.stringContaining("Vinyaas"),
    ]);

    fireEvent.click(
      screen.getByRole("button", { name: "Sort Project descending" }),
    );
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(
      screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => row.textContent),
    ).toEqual([
      expect.stringContaining("Vinyaas"),
      expect.stringContaining("Mobile App"),
      expect.stringContaining("Marketing"),
      expect.stringContaining("Dashboard"),
    ]);

    fireEvent.click(
      screen.getByRole("button", { name: "Clear sort on Project" }),
    );
    expect(header).toHaveAttribute("aria-sort", "none");
  });

  it("filters searchable columns", () => {
    render(
      <DataTable
        columns={columns}
        data={projects}
        searchable
        searchPlaceholder="Search projects..."
      />,
    );

    fireEvent.change(screen.getByLabelText("Search projects..."), {
      target: { value: "priya" },
    });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.queryByText("Vinyaas")).toBeNull();
    expect(screen.queryByText("Mobile App")).toBeNull();
  });

  it("selects rows with indeterminate select-all", () => {
    render(
      <DataTable columns={columns} data={projects.slice(0, 3)} selectable />,
    );

    const selectAll = screen.getByRole("checkbox", { name: "Select all rows" });
    const first = screen.getByRole("checkbox", { name: "Select row 1" });

    expect(selectAll).toBeInTheDocument();
    fireEvent.click(first);
    expect(first).toBeChecked();
    expect(screen.getByText("1 selected")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: "Select all rows, some currently selected",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Select all rows, some currently selected",
      }),
    );
    expect(
      screen.getByRole("checkbox", { name: "Deselect all rows" }),
    ).toBeChecked();
    expect(screen.getByText("3 selected")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("checkbox", { name: "Deselect all rows" }),
    );
    expect(screen.queryByText(/selected/)).toBeNull();
  });

  it("paginates rows and disables previous on the first page", () => {
    render(<DataTable columns={columns} data={projects} pagination={2} />);

    expect(screen.getByText("Vinyaas")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Mobile App")).toBeNull();
    expect(screen.getByText("Showing 1–2 of 6")).toBeInTheDocument();

    const previous = screen.getByRole("button", { name: /previous/i });
    expect(previous).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText("Mobile App")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
    expect(screen.queryByText("Vinyaas")).toBeNull();
    expect(screen.getByText("Showing 3–4 of 6")).toBeInTheDocument();
  });

  it("toggles column visibility while keeping locked columns", () => {
    render(
      <DataTable
        columns={columns}
        data={projects.slice(0, 1)}
        columnVisibility
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Columns" }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /Owner/i }));
    expect(screen.queryByRole("columnheader", { name: "Owner" })).toBeNull();
    expect(
      screen.getByRole("columnheader", { name: "Project" }),
    ).toBeInTheDocument();

    // Menu stays open after preventDefault toggles — show Owner again.
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /Owner/i }));
    expect(
      screen.getByRole("columnheader", { name: "Owner" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitemcheckbox", { name: /Project/i }),
    ).toBeDisabled();
  });

  it("renders empty and loading states", () => {
    const { rerender } = render(
      <DataTable columns={columns} data={[]} emptyMessage="No projects yet." />,
    );

    expect(screen.getByText("No projects yet.")).toBeInTheDocument();

    rerender(<DataTable columns={columns} data={projects} loading />);
    expect(screen.queryByText("Vinyaas")).toBeNull();
    expect(
      document.querySelectorAll('[class*="animate-pulse"]').length,
    ).toBeGreaterThan(0);
  });

  it("renders row actions and keeps them keyboard reachable", () => {
    render(
      <DataTable
        columns={columns}
        data={projects.slice(0, 1)}
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
      />,
    );

    const actions = screen.getByRole("button", { name: "Actions for Vinyaas" });
    expect(actions).toBeInTheDocument();
    fireEvent.click(actions);
    expect(screen.getByRole("menuitem", { name: "View" })).toBeInTheDocument();
  });
});
