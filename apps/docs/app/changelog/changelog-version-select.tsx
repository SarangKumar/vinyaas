"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";

import { changelogVersions, resolveChangelogVersionId } from "./changelog-data";

/**
 * Filters the changelog to one release. Updates `?v=` without a full navigation.
 */
export function ChangelogVersionSelect({ selectedId }: { selectedId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = resolveChangelogVersionId(selectedId);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label
        htmlFor="changelog-version"
        className="text-foreground text-sm font-medium"
      >
        Version
      </label>
      <Select
        value={selected}
        searchable
        onValueChange={(value) => {
          const next = new URLSearchParams(searchParams.toString());
          const resolved = resolveChangelogVersionId(value);
          next.set("v", resolved);
          const query = next.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
          });
        }}
      >
        <SelectTrigger
          id="changelog-version"
          aria-label="Changelog version"
          className="w-full sm:w-56"
        >
          <SelectValue placeholder="Select a version" />
        </SelectTrigger>
        <SelectContent searchPlaceholder="Search versions…">
          {changelogVersions.map((version) => (
            <SelectItem key={version.id} value={version.id}>
              {version.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
