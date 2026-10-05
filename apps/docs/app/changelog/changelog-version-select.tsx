"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select";

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
      <NativeSelect
        id="changelog-version"
        aria-label="Changelog version"
        value={selected}
        className="w-full sm:w-56"
        onChange={(event) => {
          const next = new URLSearchParams(searchParams.toString());
          const value = resolveChangelogVersionId(event.target.value);
          next.set("v", value);
          const query = next.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
          });
        }}
      >
        {changelogVersions.map((version) => (
          <NativeSelectOption key={version.id} value={version.id}>
            {version.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}
