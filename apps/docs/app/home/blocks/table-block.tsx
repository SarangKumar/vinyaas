"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar/avatar";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu/dropdown-menu";
import { Input } from "@/registry/new-york/ui/input/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table/table";

const people = [
  ["AL", "Ada Lovelace", "Active", "Writer"],
  ["PS", "Priya Shah", "Away", "Finance"],
  ["RM", "Rahul Mehta", "Active", "Platform"],
];

export function TableBlock() {
  const [query, setQuery] = useState("");
  const rows = people.filter((person) =>
    person.join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PlayBlock title="Directory">
      <Input
        aria-label="Search people"
        placeholder="Search people"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([initials, name, status]) => (
            <TableRow key={name}>
              <TableCell>
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{name}</span>
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={status === "Away" ? "outline" : "secondary"}>
                  {status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Actions for ${name}`}
                    >
                      ···
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-muted-foreground text-xs">{rows.length} people</p>
    </PlayBlock>
  );
}
