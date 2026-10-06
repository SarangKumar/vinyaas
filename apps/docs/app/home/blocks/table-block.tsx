"use client";

import Link from "next/link";
import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
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

const projects = [
  {
    initials: "VP",
    name: "Vinyaas Docs",
    href: "/introduction",
    owner: "Priya Shah",
    status: "Active",
    updated: "2h ago",
  },
  {
    initials: "PL",
    name: "Payments Ledger",
    href: "/components/table",
    owner: "Rahul Mehta",
    status: "Review",
    updated: "Yesterday",
  },
  {
    initials: "DS",
    name: "Design System",
    href: "/themes",
    owner: "Ada Lovelace",
    status: "Active",
    updated: "3d ago",
  },
  {
    initials: "ON",
    name: "Onboarding Kit",
    href: "/installation",
    owner: "Sarang Kumar",
    status: "Paused",
    updated: "1w ago",
  },
] as const;

export function TableBlock() {
  const [query, setQuery] = useState("");
  const rows = projects.filter((project) =>
    `${project.name} ${project.owner} ${project.status}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <PlayBlock
      title="Projects"
      description="Workspace projects with owners, status, and quick links."
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <Input
          aria-label="Search projects"
          placeholder="Search projects"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-sm min-w-0"
        />
        <p className="text-muted-foreground text-xs">{rows.length} projects</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((project) => (
            <TableRow key={project.name}>
              <TableCell>
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px]">
                      {project.initials}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    href={project.href}
                    className="text-foreground hover:text-foreground/80 focus-visible:ring-ring truncate font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                    aria-label={`Open ${project.name}`}
                  >
                    {project.name}
                  </Link>
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project.owner}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    project.status === "Active"
                      ? "secondary"
                      : project.status === "Review"
                        ? "outline"
                        : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project.updated}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Actions for ${project.name}`}
                    >
                      ···
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Copy link</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PlayBlock>
  );
}
