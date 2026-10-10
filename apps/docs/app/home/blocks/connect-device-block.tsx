import Image from "next/image";

import { PlayBlock } from "@/app/home/play-block";

/**
 * Homepage connect-device card — real QR asset from /homepage-qr.png.
 */
export function ConnectDeviceBlock() {
  return (
    <PlayBlock title="Scan to connect">
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="border-border max-w-44 rounded-md border bg-white p-2 shadow-[0_1px_0_oklch(1_0_0/0.04)_inset]">
          <Image
            src="/homepage-qr.png"
            alt="QR code to link this workspace in the Vinyaas mobile app"
            width={632}
            height={628}
            className="aspect-square h-auto w-full rounded-sm"
            priority={false}
          />
        </div>
        <p className="text-muted-foreground max-w-56 text-center text-sm leading-6">
          Open the Vinyaas mobile app and scan to link this workspace.
        </p>
      </div>
    </PlayBlock>
  );
}
