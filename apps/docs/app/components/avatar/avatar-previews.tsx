"use client";
import type { ControlValues } from "@/components/component-demo";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  type AvatarBadgeStatus,
} from "@/registry/new-york/ui/avatar";

export function AvatarPreview({ values }: { values: ControlValues }) {
  return (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
      {values.status && values.status !== "default" ? (
        <AvatarBadge status={values.status as AvatarBadgeStatus} />
      ) : null}
    </Avatar>
  );
}
