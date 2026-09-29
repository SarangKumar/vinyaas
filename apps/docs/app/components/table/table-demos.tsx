"use client";

import { useState } from "react";

import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import { Input } from "@/registry/new-york/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table";

const users = [
  ["Aarav Sharma", "Admin", "Active"],
  ["Priya Singh", "Editor", "Pending"],
  ["Rahul Mehta", "Viewer", "Disabled"],
] as const;

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export function CustomerTable() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const visible = users.filter(([name, role, status]) =>
    `${name} ${role} ${status}`.toLowerCase().includes(normalized),
  );

  return (
    <div className="grid w-full max-w-xl gap-3 text-left">
      <div>
        <h3 className="text-sm font-medium">Users</h3>
      </div>
      <div className="relative">
        <SearchIcon />
        <Input
          aria-label="Search users"
          placeholder="Search users..."
          value={query}
          className="pl-9"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No users match that search.</TableCell>
            </TableRow>
          ) : (
            visible.map(([name, role, status]) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>{role}</TableCell>
                <TableCell>
                  <Badge
                    variant={status === "Active" ? "secondary" : "outline"}
                  >
                    {status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Actions for ${name}`}
                      >
                        <MoreIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Copy email</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        Remove
                      </DropdownMenuItem>
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
