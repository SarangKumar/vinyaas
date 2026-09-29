import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { CustomerTable } from "./table-demos";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("table");

const rows = [
  ["Ada Lovelace", "Writer"],
  ["Grace Hopper", "Scientist"],
];

function TeamTable({
  caption,
  footer,
  wide,
}: {
  caption?: string;
  footer?: boolean;
  wide?: boolean;
}) {
  return (
    <Table className={wide ? "min-w-[40rem]" : undefined}>
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([name, role]) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>{role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {footer ? (
        <TableFooter>
          <TableRow>
            <TableCell>2 people</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
}

const usage = `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Team() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Writer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "className",
    type: "string",
    description: "Merged onto the underlying table, row, cell, or caption.",
  },
  {
    prop: "children",
    type: "ReactNode",
    description: "The table sections, rows, and cells.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Headers name the columns. Cells stay in the body.",
    preview: <TeamTable />,
    code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  },
  {
    id: "caption",
    title: "Caption",
    description: "TableCaption is a native caption and names the table.",
    preview: <TeamTable caption="Team" />,
    code: `<Table>
  <TableCaption>Team</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
</Table>`,
  },
  {
    id: "footer",
    title: "Footer",
    description: "TableFooter is a native tfoot for a summary row.",
    preview: <TeamTable footer />,
    code: `<TableFooter>
  <TableRow>
    <TableCell>2 people</TableCell>
  </TableRow>
</TableFooter>`,
  },
  {
    id: "responsive",
    title: "Responsive",
    description:
      "A wide table scrolls inside its wrapper. The page itself does not scroll sideways.",
    preview: <TeamTable wide />,
    code: `<Table className="min-w-[40rem]">
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
</Table>`,
  },
  {
    id: "users",
    title: "Users",
    description:
      "Search filters the rows in the page. Status uses a badge. The row menu is a dropdown. The table component itself stays a set of table elements.",
    preview: <CustomerTable />,
    code: `import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const customers = [
  ["Aarav Sharma", "aarav@example.com", "Active"],
  ["Priya Singh", "priya@example.com", "Pending"],
];

export function CustomerTable() {
  const [query, setQuery] = useState("");
  const visible = customers.filter(([name, email]) =>
    \`\${name} \${email}\`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div>
      <Input
        aria-label="Search customers"
        placeholder="Search customers..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No customers match that search.</TableCell>
            </TableRow>
          ) : (
            visible.map(([name, email, status]) => (
              <TableRow key={email}>
                <TableCell>{name}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell><Badge>{status}</Badge></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button aria-label={\`Actions for \${name}\`}>⋮</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
`,
  },
];

export default async function TablePage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/table/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Table"
      description="A semantic table for rows and columns."
      overview={
        <>
          <p>
            Table renders a native <code>table</code>. It sets spacing, type,
            borders, and a horizontal scroll wrapper. It does not sort, filter,
            paginate, or store column state.
          </p>
          <p>
            <code>TableHead</code> is a <code>th</code>.{" "}
            <code>TableCaption</code> is a <code>caption</code>. The other parts
            map to <code>thead</code>, <code>tbody</code>, <code>tfoot</code>,{" "}
            <code>tr</code>, and <code>td</code>.
          </p>
        </>
      }
      install="vinyaas add table"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/table/index.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>
            The parts are native table elements. The component does not add ARIA
            roles.
          </p>
          <ul className="list-disc pl-5">
            <li>Give each column a TableHead.</li>
            <li>Use TableCaption when the table needs an accessible name.</li>
            <li>A wide table scrolls in its wrapper.</li>
          </ul>
        </>
      }
      source={source}
    >
      <TeamTable caption="Team" />
    </ComponentReference>
  );
}
