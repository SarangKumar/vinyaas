"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type AvatarStatus = "idle" | "loading" | "loaded" | "error";

const AvatarContext = createContext<{
  status: AvatarStatus;
  setStatus: (status: AvatarStatus) => void;
} | null>(null);

function useAvatar() {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error(
      "AvatarImage and AvatarFallback must render inside Avatar.",
    );
  }

  return context;
}

export type AvatarProps = React.ComponentProps<"span">;

export function Avatar({ className, ref, ...props }: AvatarProps) {
  const [status, setStatus] = useState<AvatarStatus>("idle");

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <span
        ref={ref}
        className={cn(
          "relative flex size-10 shrink-0 overflow-hidden rounded-full",
          className,
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
}

export type AvatarImageProps = React.ComponentProps<"img">;

export function AvatarImage({
  className,
  alt,
  src,
  ref,
  onLoad,
  onError,
  ...props
}: AvatarImageProps) {
  const { status, setStatus } = useAvatar();
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (image?.complete) {
      setStatus(image.naturalWidth > 0 ? "loaded" : "error");
    } else {
      setStatus("loading");
    }

    return () => {
      setStatus("idle");
    };
  }, [setStatus, src]);

  return (
    // The installed component is a native image, not a Next.js image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={(node) => {
        imageRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      alt={alt}
      src={src}
      {...props}
      hidden={status === "error" ? true : undefined}
      className={cn(
        "aspect-square size-full object-cover",
        status === "loaded" ? "block" : "sr-only",
        className,
      )}
      onLoad={(event) => {
        setStatus("loaded");
        onLoad?.(event);
      }}
      onError={(event) => {
        setStatus("error");
        onError?.(event);
      }}
    />
  );
}

export type AvatarFallbackProps = React.ComponentProps<"span">;

export function AvatarFallback({
  className,
  ref,
  ...props
}: AvatarFallbackProps) {
  const { status } = useAvatar();

  if (status === "loaded") {
    return null;
  }

  return (
    <span
      ref={ref}
      {...props}
      aria-hidden={status === "loading" ? true : undefined}
      className={cn(
        "bg-muted text-muted-foreground flex size-full items-center justify-center text-xs font-medium [&_svg]:size-3.5",
        className,
      )}
    />
  );
}
