"use client";

import { useMemo, useState } from "react";

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
import { Label } from "@/registry/new-york/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table";

const documents = [
  {
    id: "billing",
    title: "March invoice.pdf",
    owner: "PS",
    ownerName: "Priya Shah",
    modified: "2h ago",
    status: "Shared",
    kind: "PDF",
  },
  {
    id: "notes",
    title: "Deploy notes.md",
    owner: "RM",
    ownerName: "Rahul Mehta",
    modified: "Yesterday",
    status: "Private",
    kind: "MD",
  },
  {
    id: "brief",
    title: "Onboarding brief.docx",
    owner: "AL",
    ownerName: "Ada Lovelace",
    modified: "Mon",
    status: "Review",
    kind: "DOC",
  },
] as const;

export function RecentDocumentsBlock() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return documents;
    }

    return documents.filter((document) =>
      document.title.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <PlayBlock
      title="Documents"
      description="Recent files across the workspace."
    >
      <div className="grid min-w-0 gap-1.5">
        <Label htmlFor="play-docs-search">Search documents</Label>
        <Input
          id="play-docs-search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Filter by name"
          className="max-w-sm min-w-0"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <div className="flex min-w-0 items-center gap-2">
                  <Badge variant="secondary" className="shrink-0">
                    {document.kind}
                  </Badge>
                  <span className="truncate font-medium">{document.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px]">
                      {document.owner}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{document.ownerName}</span>
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {document.modified}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    document.status === "Private" ? "outline" : "secondary"
                  }
                >
                  {document.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      aria-label={`Actions for ${document.title}`}
                    >
                      ···
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No documents match.</p>
      ) : null}
    </PlayBlock>
  );
}
