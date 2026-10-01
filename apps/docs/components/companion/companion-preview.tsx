import Image, { type StaticImageData } from "next/image";

type CompanionPreviewProps = {
  name: string;
  src: StaticImageData;
  alt?: string;
  /** Display size in CSS pixels. Source sprites stay pixel-art (50×50+). */
  size?: number;
  /** Soft float used in showcase cards; off for the live host. */
  floating?: boolean;
  className?: string;
};

/**
 * Presentational companion sprite for docs showcases.
 * Keeps asset rendering separate from future companion runtime.
 */
export function CompanionPreview({
  name,
  src,
  alt,
  size = 96,
  floating = true,
  className,
}: CompanionPreviewProps) {
  return (
    <div
      data-companion-preview={name.toLowerCase()}
      className={["inline-flex flex-col items-center gap-3", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex items-center justify-center",
          floating ? "vinyaas-companion-float" : undefined,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={alt ?? name}
          width={size}
          height={size}
          unoptimized
          priority={false}
          className="h-full w-full select-none"
          style={{ imageRendering: "pixelated" }}
          draggable={false}
        />
      </div>
    </div>
  );
}
