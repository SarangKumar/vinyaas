import Image, { type StaticImageData } from "next/image";

type CompanionPreviewProps = {
  name: string;
  src: StaticImageData;
  alt?: string;
  /** Display size in CSS pixels. Source sprites stay 32×32. */
  size?: number;
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
        className="vinyaas-companion-float flex items-center justify-center"
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
