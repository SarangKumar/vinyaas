import Image from "next/image";

import logo from "@/components/logo.png";
import { cn } from "@/lib/utils";

type VinyaasMarkProps = {
  className?: string;
  title?: string;
  /** Kept for call-site compatibility; the asset includes its own depth. */
  glow?: boolean;
  priority?: boolean;
};

/**
 * Vinyaas brand mark — silver ribbon diamond in a dark squircle.
 */
export function VinyaasMark({
  className,
  title = "Vinyaas",
  priority = false,
}: VinyaasMarkProps) {
  return (
    <Image
      src={logo}
      alt={title}
      width={64}
      height={64}
      priority={priority}
      className={cn("size-full", className)}
    />
  );
}
