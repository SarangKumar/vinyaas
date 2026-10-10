"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
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
  ["Aarav Sharma", "aarav@example.com", "AS", "Admin", "Active"],
  ["Priya Singh", "priya@example.com", "PS", "Editor", "Pending"],
  ["Aarav Mehta", "aarav.mehta@example.com", "AM", "Viewer", "Disabled"],
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
  const visible = users.filter(([name, email, , role, status]) =>
    `${name} ${email} ${role} ${status}`.toLowerCase().includes(normalized),
  );

  return (
    <div className="grid w-full max-w-2xl gap-3 text-left">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Team members</h3>
          <p className="text-muted-foreground text-sm">
            People with access to this workspace.
          </p>
        </div>
        <Button size="sm">Invite</Button>
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
      <div className="overflow-x-auto">
        <Table className="min-w-[36rem]">
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No users match that search.</TableCell>
              </TableRow>
            ) : (
              visible.map(([name, email, initials, role, status]) => (
                <TableRow key={email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{name}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
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
    </div>
  );
}
