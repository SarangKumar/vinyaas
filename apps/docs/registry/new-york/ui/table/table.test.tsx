import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

describe("Table", () => {
  it("renders a semantic table with a caption, header, body, and footer", () => {
    render(
      <Table className="min-w-[40rem]">
        <TableCaption>Team</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
            <TableCell>Writer</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>1 person</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const table = screen.getByRole("table", { name: "Team" });

    expect(table.tagName).toBe("TABLE");
    expect(table).toHaveClass("text-sm", "min-w-[40rem]");
    expect(table.parentElement).toHaveClass("overflow-x-auto", "min-w-0");
    expect(document.querySelector("caption")).toHaveTextContent("Team");
    expect(document.querySelector("thead")).toBeInTheDocument();
    expect(document.querySelector("tbody")).toBeInTheDocument();
    expect(document.querySelector("tfoot")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" }).tagName).toBe(
      "TH",
    );
    expect(screen.getByRole("cell", { name: "Ada" }).tagName).toBe("TD");
  });
});
