"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from "@/registry/new-york/ui/combobox";

import { changelogVersions, resolveChangelogVersionId } from "./changelog-data";

/**
 * Filters the changelog to one release. Updates `?v=` without a full navigation.
 * Uses Combobox so longer version lists stay searchable.
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
      <Combobox
        value={selected}
        onValueChange={(value) => {
          if (!value) {
            return;
          }
          const next = new URLSearchParams(searchParams.toString());
          const resolved = resolveChangelogVersionId(value);
          next.set("v", resolved);
          const query = next.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
          });
        }}
      >
        <ComboboxTrigger
          id="changelog-version"
          aria-label="Changelog version"
          placeholder="Select a version"
          className="w-full sm:w-56"
        >
          {changelogVersions.find((version) => version.id === selected)?.label}
        </ComboboxTrigger>
        <ComboboxContent searchPlaceholder="Search versions…">
          {changelogVersions.map((version) => (
            <ComboboxItem key={version.id} value={version.id}>
              {version.label}
            </ComboboxItem>
          ))}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
